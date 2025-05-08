
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Search, Folder, Star, Clock, Heart, Pin, Trash2 } from "lucide-react";
import { CardContainer } from "@/components/ui/card-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StyleCard from "./StyleCard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useStyles } from "@/hooks/useStyles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const LibraryMyStyles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const { folders, styles, isLoading, createFolder, deleteFolder } = useStyles();
  const navigate = useNavigate();

  const filteredStyles = styles.filter(style => {
    // Filter by search term
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          style.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          style.creatorHandle && style.creatorHandle.toLowerCase().includes(searchTerm.toLowerCase());

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

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    try {
      await createFolder(newFolderName);
      setNewFolderName("");
      setIsCreateFolderDialogOpen(false);
      toast.success(`Folder "${newFolderName}" created`);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleDeleteFolder = async (id: string, name: string) => {
    if (name === "All") {
      toast.error("Cannot delete the All folder");
      return;
    }

    if (confirm(`Are you sure you want to delete the "${name}" folder? Styles in this folder will be moved to "Uncategorized".`)) {
      try {
        await deleteFolder(id);
      } catch (error) {
        console.error("Error deleting folder:", error);
      }
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar with folders */}
      <div className="hidden sm:flex flex-col w-64 border-r border-white/10 pr-4 mr-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Folders</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent border-dashed h-8 w-8 p-0" 
            title="New Folder" 
            onClick={() => setIsCreateFolderDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {isLoading ? (
            <div className="p-4 text-center text-white/50">Loading folders...</div>
          ) : folders.map(folder => (
            <div key={folder.id} className="flex items-center">
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
              {folder.name !== "All" && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 bg-transparent hover:bg-red-900/20 hover:text-red-400"
                  onClick={() => handleDeleteFolder(folder.id, folder.name)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="space-y-2 mt-8">
          <Button onClick={handleCreateStyle} className="w-full bg-[#3260ea] hover:bg-[#2853c6]">
            <Plus className="h-4 w-4 mr-2" />
            Create Your Own Style
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search bar */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input 
            placeholder="Search saved styles" 
            className="pl-10 bg-[#1A202C] border-white/10 h-10" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
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
            
            <Button 
              variant="outline" 
              className="flex-1 bg-transparent border-white/20 hover:bg-white/5"
              onClick={() => setIsCreateFolderDialogOpen(true)}
            >
              <Folder className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>
        </div>

        {/* Saved styles grid */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-white/70">Loading styles...</p>
            </div>
          ) : filteredStyles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 pb-10">
              {filteredStyles.map(style => (
                <StyleCard key={style.id} style={style} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-[#1A202C]/50 rounded-lg border border-white/5">
              <Star className="h-16 w-16 text-white/20 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No saved styles found</h3>
              <p className="text-white/70 mb-4">
                {searchTerm ? 'Try adjusting your search' : 'Start saving styles or create your own'}
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
      
      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
        <DialogContent className="bg-[#1E2431] border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="bg-[#1A202C] border-white/10"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateFolderDialogOpen(false)}
              className="bg-transparent border-white/20"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateFolder}
              className="bg-[#3260ea] hover:bg-[#2853c6]"
              disabled={!newFolderName.trim()}
            >
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LibraryMyStyles;
