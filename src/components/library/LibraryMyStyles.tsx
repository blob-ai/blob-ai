
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Search, Folder, FolderPlus, Star, Clock, Heart, Sparkles, X } from "lucide-react";
import { CardContainer } from "@/components/ui/card-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StyleCard from "./StyleCard";
import { useNavigate } from "react-router-dom";
import QuickSaveModal from "./QuickSaveModal";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Define the Style type to fix TypeScript errors
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
};

const LibraryMyStyles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [showQuickSaveModal, setShowQuickSaveModal] = useState(false);
  const [savedStyles, setSavedStyles] = useState<Style[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: "f1", name: "All", count: 0 },
    { id: "f2", name: "Inspiration", count: 0 }
  ]);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const navigate = useNavigate();

  const filteredStyles = savedStyles.filter(style => {
    // Filter by search term
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         style.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (style.creatorHandle && style.creatorHandle.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by active view
    const matchesView = 
      activeView === "all" || 
      (activeView === "favorites" && style.isFavorite) || 
      (activeView === "recent" && new Date(style.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // Last 7 days

    // Filter by selected folder
    const matchesFolder = selectedFolder === "All" || style.folder === selectedFolder;

    return matchesSearch && matchesView && matchesFolder;
  });

  const handleCreateStyle = () => {
    setSearchParams({ tab: "create" });
  };

  const setSearchParams = (params: { tab: string }) => {
    navigate({
      pathname: "/dashboard/library",
      search: `?tab=${params.tab}`
    });
  };

  const handleQuickSave = () => {
    setShowQuickSaveModal(true);
  };

  const handleSaveInspiration = (newStyle: Style) => {
    // Add the new style to the savedStyles array
    setSavedStyles(prevStyles => [newStyle, ...prevStyles]);

    // Update the folder count
    setFolders(prevFolders => prevFolders.map(folder => 
      folder.name === newStyle.folder ? { ...folder, count: folder.count + 1 } : folder
    ));

    // Show success message
    toast.success("Inspiration saved successfully!");
  };

  const handleCreateFolder = () => {
    setShowNewFolderInput(true);
  };

  const handleAddFolder = () => {
    if (newFolderName.trim() === "") {
      toast.error("Folder name cannot be empty");
      return;
    }

    // Check if folder with same name already exists
    if (folders.some(folder => folder.name.toLowerCase() === newFolderName.toLowerCase())) {
      toast.error("A folder with this name already exists");
      return;
    }

    // Add new folder
    setFolders(prev => [...prev, { 
      id: uuidv4(),
      name: newFolderName.trim(), 
      count: 0 
    }]);

    // Reset state
    setNewFolderName("");
    setShowNewFolderInput(false);
    toast.success(`Folder "${newFolderName}" created`);
  };

  const handleDeleteFolder = (id: string, name: string) => {
    // Don't allow deleting the "All" folder
    if (name === "All") {
      toast.error("The 'All' folder cannot be deleted");
      return;
    }

    // Move any styles in this folder to "All"
    setSavedStyles(prevStyles => 
      prevStyles.map(style => 
        style.folder === name ? { ...style, folder: "All" } : style
      )
    );

    // Delete folder
    setFolders(prev => prev.filter(folder => folder.id !== id));
    
    // If the deleted folder was selected, switch to "All"
    if (selectedFolder === name) {
      setSelectedFolder("All");
    }

    toast.success(`Folder "${name}" deleted`);
  };

  const handleDeleteStyle = (id: string) => {
    // Find the style to get its folder
    const style = savedStyles.find(s => s.id === id);
    if (!style) return;
    
    // Delete style
    setSavedStyles(prev => prev.filter(s => s.id !== id));
    
    // Decrement folder count
    setFolders(prevFolders => prevFolders.map(folder => 
      folder.name === style.folder ? { ...folder, count: Math.max(0, folder.count - 1) } : folder
    ));

    toast.success(`Style "${style.name}" deleted`);
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
            onClick={handleCreateFolder}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {folders.map(folder => (
            <div key={folder.id} className="flex items-center">
              <Button 
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
                  className="ml-1 h-8 w-8 p-0 text-white/40 hover:text-white hover:bg-red-900/20"
                  onClick={() => handleDeleteFolder(folder.id, folder.name)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}

          {showNewFolderInput && (
            <div className="flex mt-2 items-center gap-2">
              <Input
                autoFocus
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="h-8 text-sm bg-[#1A202C] border-white/10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddFolder();
                  if (e.key === 'Escape') {
                    setShowNewFolderInput(false);
                    setNewFolderName("");
                  }
                }}
              />
              <Button 
                size="sm"
                className="h-8 bg-[#3260ea] hover:bg-[#2853c6]"
                onClick={handleAddFolder}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 hover:bg-white/10"
                onClick={() => {
                  setShowNewFolderInput(false);
                  setNewFolderName("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-2 mt-8">
          <Button 
            onClick={handleCreateStyle} 
            className="w-full bg-[#3260ea] hover:bg-[#2853c6]"
          >
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
            className="pl-10 bg-[#101217] border-white/10 h-10" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>

        {/* View tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
          <TabsList className="bg-[#101217] border border-white/10 p-1">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-[#24293A] data-[state=active]:text-white"
            >
              <Star className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className="data-[state=active]:bg-[#24293A] data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:bg-[#24293A] data-[state=active]:text-white"
            >
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Mobile folder selector and buttons */}
        <div className="sm:hidden mb-4 space-y-3">
          <select 
            className="w-full bg-[#101217] border border-white/10 rounded-md h-10 px-3 text-white" 
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
            <Button 
              onClick={handleCreateFolder}
              variant="outline"
              className="flex-1 bg-transparent border-white/20"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button 
              onClick={handleCreateStyle} 
              className="flex-1 bg-[#3260ea] hover:bg-[#2853c6]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Style
            </Button>
          </div>
        </div>

        {/* Saved styles grid */}
        <ScrollArea className="flex-1">
          {filteredStyles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 pb-10">
              {filteredStyles.map(style => (
                <StyleCard key={style.id} style={style} onDelete={handleDeleteStyle} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-[#101217]/50 rounded-lg border border-white/5">
              <Star className="h-16 w-16 text-white/20 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No saved styles found</h3>
              <p className="text-white/70 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search' 
                  : selectedFolder !== "All" 
                    ? `No styles in the "${selectedFolder}" folder yet` 
                    : 'Start saving styles from the Explore tab'}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSearchParams({ tab: "explore" })} 
                  className="bg-transparent border-white/20"
                >
                  Browse Explore
                </Button>
                <Button 
                  onClick={handleCreateStyle}
                  className="bg-[#3260ea] hover:bg-[#2853c6]"
                >
                  Create Style
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
      
      {/* Quick Save Modal */}
      <QuickSaveModal 
        isOpen={showQuickSaveModal} 
        onClose={() => setShowQuickSaveModal(false)} 
        onSave={handleSaveInspiration}
        folders={folders.filter(folder => folder.name !== "All").map(folder => folder.name)}
      />
    </div>
  );
};

export default LibraryMyStyles;
