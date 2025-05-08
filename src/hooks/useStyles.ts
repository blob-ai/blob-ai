
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StyleFolder, Style, StyleUIObject } from '@/types/styles';
import { toast } from 'sonner';

export function useStyles() {
  const [folders, setFolders] = useState<(StyleFolder & { count: number })[]>([]);
  const [styles, setStyles] = useState<StyleUIObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    getCurrentUser();
  }, []);

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('style_folders')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    } catch (err) {
      console.error('Error fetching folders:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    }
  };

  const fetchStyles = async () => {
    try {
      const { data, error } = await supabase
        .from('styles')
        .select(`*, style_folders (name)`);

      if (error) throw new Error(error.message);
      return data || [];
    } catch (err) {
      console.error('Error fetching styles:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    }
  };

  const processData = (folders: StyleFolder[], styles: any[]) => {
    // Process folders with counts
    const processedFolders = folders.map(folder => ({
      ...folder,
      count: styles.filter(style => style.folder_id === folder.id).length
    }));

    // Add "All" folder count if it doesn't exist
    const allFolder = processedFolders.find(f => f.name === "All");
    if (allFolder) {
      allFolder.count = styles.length;
    }

    // Process styles for UI
    const processedStyles = styles.map(style => ({
      id: style.id,
      name: style.name,
      creatorName: style.creator_name || "You",
      creatorHandle: style.creator_handle || "",
      creatorAvatar: style.creator_avatar || "",
      description: style.description || "",
      tone: style.tone || [],
      example: style.example || "",
      date: new Date(style.created_at).toISOString().split('T')[0],
      isFavorite: style.is_favorite,
      isPinned: style.is_pinned,
      folder: style.style_folders?.name || "Uncategorized",
      isTemplate: style.is_template,
      source: style.source || "user",
      isSavedInspiration: false
    }));

    return { processedFolders, processedStyles };
  };

  // Initial data fetching
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [foldersData, stylesData] = await Promise.all([
        fetchFolders(),
        fetchStyles()
      ]);
      
      const { processedFolders, processedStyles } = processData(foldersData, stylesData);
      setFolders(processedFolders);
      setStyles(processedStyles);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load styles data');
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const createFolder = async (name: string) => {
    if (!userId) {
      toast.error('You must be logged in to create folders');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('style_folders')
        .insert({ 
          name,
          position: folders.length + 1,
          user_id: userId
        })
        .select();

      if (error) throw new Error(error.message);
      if (data && data[0]) {
        const newFolder = { ...data[0], count: 0 };
        setFolders(prev => [...prev, newFolder]);
        return newFolder;
      }
    } catch (err) {
      console.error('Error creating folder:', err);
      toast.error('Failed to create folder');
      throw err;
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('style_folders')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      setFolders(prev => prev.filter(folder => folder.id !== id));
      toast.success('Folder deleted successfully');
    } catch (err) {
      console.error('Error deleting folder:', err);
      toast.error('Failed to delete folder');
      throw err;
    }
  };

  // Initialize data
  useEffect(() => {
    fetchData();
  }, []);

  return {
    folders,
    styles,
    isLoading,
    error,
    userId,
    refetch: fetchData,
    createFolder,
    deleteFolder
  };
}
