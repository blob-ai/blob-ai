
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Search, Folder, Star, Clock, Heart, Pin } from "lucide-react";
import { CardContainer } from "@/components/ui/card-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StyleCard from "./StyleCard";
import { useNavigate } from "react-router-dom";

// Sample saved styles - in a real app this would come from an API
const SAMPLE_SAVED_STYLES = [
  {
    id: "p1",
    name: "Naval's Wisdom",
    creatorName: "Naval Ravikant",
    creatorHandle: "@naval",
    creatorAvatar: "https://pbs.twimg.com/profile_images/1256841238298292232/ycqwaMI2_400x400.jpg",
    description: "Concise philosophical insights",
    tone: ["Thoughtful", "Direct", "Philosophical"],
    example: "If you aren't willing to be mocked, you'll never be original enough.",
    date: "2023-05-15",
    isFavorite: true,
    isPinned: true,
    folder: "Inspiration",
    isTemplate: false,
    source: "creator" as const
  },
  {
    id: "p2",
    name: "Business Growth Tactics",
    creatorName: "Alex Hormozi",
    creatorHandle: "@AlexHormozi",
    creatorAvatar: "https://pbs.twimg.com/profile_images/1602381288925261824/OBgGZqZ7_400x400.jpg",
    description: "List-based tactical advice",
    tone: ["Bold", "Motivational", "Strategic"],
    example: "The 3 types of leverage:\n\n1. Money\n2. People\n3. Technology",
    date: "2023-06-22",
    isFavorite: false,
    isPinned: false,
    folder: "Business",
    isTemplate: true,
    source: "creator" as const
  },
  {
    id: "p3",
    name: "5-Hour Rule Framework",
    creatorName: "Sahil Bloom",
    creatorHandle: "@SahilBloom",
    creatorAvatar: "https://pbs.twimg.com/profile_images/1735694839870857216/MQW8CD5T_400x400.jpg",
    description: "Mental models and frameworks",
    tone: ["Educational", "Clear", "Structured"],
    example: "The 5-hour rule: Invest in yourself for 1 hour each day.",
    date: "2023-06-10",
    isFavorite: true,
    isPinned: true,
    folder: "Inspiration",
    isTemplate: false,
    source: "creator" as const
  },
  {
    id: "p4",
    name: "My Tech Commentary",
    creatorName: "You",
    creatorHandle: "",
    creatorAvatar: "",
    description: "Personal style for tech topics",
    tone: ["Analytical", "Clear", "Opinionated"],
    example: "Tech isn't just about features, it's about how those features change our lives.",
    date: "2023-07-05",
    isFavorite: false,
    isPinned: false,
    folder: "Personal",
    isTemplate: false,
    source: "user" as const
  }
];

// Sample folders
const FOLDERS = [
  { id: "f1", name: "All", count: 12 },
  { id: "f2", name: "Inspiration", count: 5 },
  { id: "f3", name: "Business", count: 3 },
  { id: "f4", name: "Personal", count: 4 }
];

const LibraryMyStyles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const navigate = useNavigate();

  const filteredStyles = SAMPLE_SAVED_STYLES.filter(style => {
    // Filter by search term
    const matchesSearch = 
      style.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      style.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (style.creatorHandle && style.creatorHandle.toLowerCase().includes(searchTerm.toLowerCase()));
      
    // Filter by active view
    const matchesView = 
      (activeView === "all") ||
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

  const setSearchParams = (params: { tab: string }) => {
    navigate({
      pathname: "/dashboard/library",
      search: `?tab=${params.tab}`
    });
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar with folders */}
      <div className="hidden sm:flex flex-col w-64 border-r border-white/10 pr-4 mr-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Folders</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent border-dashed h-8 w-8 p-0"
            title="New Folder"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {FOLDERS.map((folder) => (
            <Button
              key={folder.id}
              variant={selectedFolder === folder.name ? "secondary" : "ghost"} 
              className={`w-full justify-start ${selectedFolder === folder.name ? 'bg-white/10' : ''}`}
              onClick={() => setSelectedFolder(folder.name)}
            >
              <Folder className="h-4 w-4 mr-2" />
              {folder.name}
              <span className="ml-auto text-white/40 text-xs">{folder.count}</span>
            </Button>
          ))}
        </div>
        
        <Button 
          onClick={handleCreateStyle}
          className="mt-8 bg-primary-500 hover:bg-primary-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Your Own Style
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search bar */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder="Search saved styles"
            className="pl-10 bg-black/20 border-white/10 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* View tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
          <TabsList className="bg-black/20 border border-white/10 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/10">
              <Star className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
            <TabsTrigger value="pinned" className="data-[state=active]:bg-white/10">
              <Pin className="h-4 w-4 mr-2" />
              Pinned
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-white/10">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-white/10">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Mobile folder selector and create button */}
        <div className="sm:hidden mb-4 space-y-3">
          <select 
            className="w-full bg-black/20 border border-white/10 rounded-md h-10 px-3 text-white"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
          >
            {FOLDERS.map((folder) => (
              <option key={folder.id} value={folder.name}>
                {folder.name} ({folder.count})
              </option>
            ))}
          </select>
          
          <Button 
            onClick={handleCreateStyle}
            className="w-full bg-primary-500 hover:bg-primary-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your Own Style
          </Button>
        </div>

        {/* Saved styles grid */}
        <ScrollArea className="flex-1">
          {filteredStyles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 pb-10">
              {filteredStyles.map((style) => (
                <StyleCard key={style.id} style={style} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Star className="h-16 w-16 text-white/20 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No saved styles found</h3>
              <p className="text-white/60 mb-4">
                {searchTerm ? 'Try adjusting your search' : 'Start saving styles from the Explore tab'}
              </p>
              <Button 
                variant="outline"
                onClick={() => setSearchParams({ tab: "explore" })}
              >
                Browse Explore
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default LibraryMyStyles;
