
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Search, Folder, Star, Clock, Heart, Pin, Save } from "lucide-react";
import { CardContainer } from "@/components/ui/card-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StyleCard from "./StyleCard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define the Style type
type Style = {
  id: string;
  name: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  description: string;
  tone: string[];
  example: string;
  date: string;
  isFavorite: boolean;
  isPinned: boolean;
  folder: string;
  isTemplate: boolean;
  source: "user" | "creator";
  isSavedInspiration?: boolean;
};

// Define the Folder type
type Folder = {
  id: string;
  name: string;
  count: number;
  position: number;
};

const LibraryMyStyles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [savedStyles, setSavedStyles] = useState<Style[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch folders and styles from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch folders
        const { data: folderData, error: folderError } = await supabase
          .from('style_folders')
          .select('*')
          .order('position', { ascending: true });

        if (folderError) throw folderError;

        // Fetch styles
        const { data: styleData, error: styleError } = await supabase
          .from('styles')
          .select(`
            *,
            style_folders (name)
          `);

        if (styleError) throw styleError;

        // Process folders
        const processedFolders = folderData.map(folder => ({
          id: folder.id,
          name: folder.name,
          position: folder.position,
          count: styleData.filter(style => style.folder_id === folder.id).length
        }));

        // Add "All" folder count
        const allFolder = processedFolders.find(f => f.name === "All");
        if (allFolder) {
          allFolder.count = styleData.length;
        }

        // Process styles
        const processedStyles = styleData.map(style => ({
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
          isSavedInspiration: style.is_saved_inspiration
        }));

        setSavedStyles(processedStyles);
        setFolders(processedFolders);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load your styles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStyles = savedStyles.filter(style => {
    // Filter by search term
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         style.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (style.creatorHandle && style.creatorHandle.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by active view
    const matchesView = activeView === "all" || 
                       (activeView === "favorites" && style.isFavorite) || 
                       (activeView === "pinned" && style.isPinned) || 
                       (activeView === "recent" && new Date(style.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // Last 7 days

    // Filter by selected folder
    const matchesFolder = selectedFolder === "All" || style.folder === selectedFolder;
    
    return matchesSearch && matchesView && matchesFolder;
  });

  const handleCreateStyle = () => {
    setSearchParams({
      tab: "create"
    });
  };

  const setSearchParams = (params: {
    tab: string;
  }) => {
    navigate({
      pathname: "/dashboard/library",
      search: `?tab=${params.tab}`
    });
  };

  const handleSaveQuick = () => {
    setSearchParams({
      tab: "create"
    });
    toast.success("Opening quick save form");
  };

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name");
    if (!folderName) return;
    
    try {
      const { data, error } = await supabase
        .from('style_folders')
        .insert({
          name: folderName,
          position: folders.length + 1
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const newFolder = {
          id: data[0].id,
          name: data[0].name,
          position: data[0].position,
          count: 0
        };
        
        setFolders([...folders, newFolder]);
        toast.success(`Folder "${folderName}" created`);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  return <div className="flex h-full overflow-hidden">
      {/* Sidebar with folders */}
      <div className="hidden sm:flex flex-col w-64 border-r border-white/10 pr-4 mr-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Folders</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent border-dashed h-8 w-8 p-0" 
            title="New Folder"
            onClick={handleCreateFolder}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {isLoading ? (
            Array(5).fill(0).map((_, idx) => (
              <div key={idx} className="h-10 bg-white/5 animate-pulse rounded-md mb-1"></div>
            ))
          ) : (
            folders.map(folder => (
              <Button 
                key={folder.id} 
                variant={selectedFolder === folder.name ? "secondary" : "ghost"} 
                className={`w-full justify-start ${selectedFolder === folder.name ? 'bg-[#24293A] text-white' : ''}`}
                onClick={() => setSelectedFolder(folder.name)}
              >
                <Folder className="h-4 w-4 mr-2" />
                {folder.name}
                <span className="ml-auto text-white/40 text-xs">{folder.count}</span>
              </Button>
            ))
          )}
        </div>
        
        <div className="space-y-2 mt-8">
          <Button onClick={handleCreateStyle} className="w-full bg-[#3260ea] hover:bg-[#2853c6]">
            <Plus className="h-4 w-4 mr-2" />
            Create Your Own Style
          </Button>
          
          <Button onClick={handleSaveQuick} variant="outline" className="w-full bg-transparent border-white/20 hover:bg-white/5">
            <Save className="h-4 w-4 mr-2" />
            Quick Save
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search bar */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input placeholder="Search saved styles" className="pl-10 bg-[#1A202C] border-white/10 h-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>

        {/* View tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
          <TabsList className="bg-[#1A202C] border border-white/10 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#24293A] data-[state=active]:text-white">
              <Star className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
            <TabsTrigger value="pinned" className="data-[state=active]:bg-[#24293A] data-[state=active]:text-white">
              <Pin className="h-4 w-4 mr-2" />
              Pinned
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-[#24293A] data-[state=active]:text-white">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-[#24293A] data-[state=active]:text-white">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Mobile folder selector and buttons */}
        <div className="sm:hidden mb-4 space-y-3">
          <select 
            className="w-full bg-[#1A202C] border border-white/10 rounded-md h-10 px-3 text-white" 
            value={selectedFolder} 
            onChange={e => setSelectedFolder(e.target.value)}
          >
            {folders.map(folder => (
              <option key={folder.id} value={folder.name}>
                {folder.name} ({folder.count})
              </option>
            ))}
          </select>
          
          <div className="flex gap-2">
            <Button onClick={handleCreateStyle} className="flex-1 bg-[#3260ea] hover:bg-[#2853c6]">
              <Plus className="h-4 w-4 mr-2" />
              Create Style
            </Button>
            
            <Button onClick={handleSaveQuick} variant="outline" className="flex-1 bg-transparent border-white/20 hover:bg-white/5">
              <Save className="h-4 w-4 mr-2" />
              Quick Save
            </Button>
          </div>
        </div>

        {/* Saved styles grid */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 pb-10">
              {Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="h-64 bg-white/5 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : filteredStyles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 pb-10">
              {filteredStyles.map(style => <StyleCard key={style.id} style={style} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-[#1A202C]/50 rounded-lg border border-white/5">
              <Star className="h-16 w-16 text-white/20 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No saved styles found</h3>
              <p className="text-white/70 mb-4">
                {searchTerm ? 'Try adjusting your search' : 'Start saving styles from the Explore tab or create your own style'}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSearchParams({
                  tab: "explore"
                })} className="bg-transparent border-white/20">
                  Browse Explore
                </Button>
                <Button onClick={handleCreateStyle} className="bg-[#3260ea] hover:bg-[#2853c6]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Style
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>;
};

export default LibraryMyStyles;
