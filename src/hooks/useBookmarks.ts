import { useState, useEffect } from "react";
import { Bookmark } from "@/types/bookmark";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Create a temporary local storage implementation to simulate
// the functionality for initial development
// The actual Supabase integration will replace this later

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { user } = useAuth();
  
  // Load bookmarks
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // In production this would use Supabase
        // const { data, error } = await supabase
        //   .from('bookmarks')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .order('created_at', { ascending: false });
        
        // if (error) throw error;
        
        // For now, use localStorage
        const storedBookmarks = localStorage.getItem(`bookmarks_${user.id}`);
        const initialBookmarks: Bookmark[] = storedBookmarks 
          ? JSON.parse(storedBookmarks) 
          : [];
          
        setBookmarks(initialBookmarks);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading bookmarks:', err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchBookmarks();
  }, [user]);
  
  // Save to localStorage for now
  useEffect(() => {
    if (user && bookmarks) {
      localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(bookmarks));
    }
  }, [bookmarks, user]);
  
  // Add a bookmark
  const addBookmark = async (bookmark: Omit<Bookmark, "user_id" | "created_at" | "updated_at">) => {
    if (!user) {
      toast.error("You must be logged in to save bookmarks");
      return;
    }
    
    try {
      const newBookmark: Bookmark = {
        ...bookmark,
        title: bookmark.title || bookmark.name || "Unnamed Bookmark",
        type: bookmark.type || "text",
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // In production we would use Supabase
      // const { data, error } = await supabase
      //   .from('bookmarks')
      //   .insert(newBookmark)
      //   .select()
      //   .single();
      
      // if (error) throw error;
      
      // For now, handle locally
      setBookmarks(prev => [newBookmark, ...prev]);
      return newBookmark;
    } catch (err: any) {
      console.error('Error adding bookmark:', err);
      setError(err);
      toast.error("Failed to save bookmark");
      return null;
    }
  };
  
  // Delete a bookmark
  const deleteBookmark = async (id: string) => {
    if (!user) return;
    
    try {
      // In production we would use Supabase
      // const { error } = await supabase
      //   .from('bookmarks')
      //   .delete()
      //   .eq('id', id)
      //   .eq('user_id', user.id);
      
      // if (error) throw error;
      
      // For now, handle locally
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
      toast.success("Bookmark deleted");
    } catch (err: any) {
      console.error('Error deleting bookmark:', err);
      setError(err);
      toast.error("Failed to delete bookmark");
    }
  };
  
  // Update a bookmark
  const updateBookmark = async (id: string, data: Partial<Bookmark>) => {
    if (!user) return;
    
    try {
      // In production we would use Supabase
      // const { error } = await supabase
      //   .from('bookmarks')
      //   .update({ ...data, updated_at: new Date().toISOString() })
      //   .eq('id', id)
      //   .eq('user_id', user.id);
      
      // if (error) throw error;
      
      // For now, handle locally
      setBookmarks(prev => prev.map(bookmark => 
        bookmark.id === id 
          ? { ...bookmark, ...data, updated_at: new Date().toISOString() } 
          : bookmark
      ));
      
      return true;
    } catch (err: any) {
      console.error('Error updating bookmark:', err);
      setError(err);
      toast.error("Failed to update bookmark");
      return false;
    }
  };
  
  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    deleteBookmark,
    updateBookmark
  };
};
