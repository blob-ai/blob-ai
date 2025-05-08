import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Search, Folder, Star, Clock, Heart, Pin, Save, Sparkles } from "lucide-react";
import { CardContainer } from "@/components/ui/card-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StyleCard from "./StyleCard";
import { useNavigate } from "react-router-dom";
import QuickSaveModal from "./QuickSaveModal";
import { toast } from "sonner";

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
  isPinned: boolean;
  folder: string;
  isTemplate: boolean;
  source: "user" | "creator";
  isSavedInspiration?: boolean;
};

// Sample saved styles - in a real app this would come from an API
const SAMPLE_SAVED_STYLES: Style[] = [{
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
  source: "creator"
}, {
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
  source: "creator"
}, {
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
  source: "creator"
}, {
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
  source: "user"
}];

// Sample folders
const FOLDERS = [{
  id: "f1",
  name: "All",
  count: 12
}, {
  id: "f2",
  name: "Inspiration",
  count: 5
}, {
  id: "f3",
  name: "Business",
  count: 3
}, {
  id: "f4",
  name: "Personal",
  count: 4
}, {
  id: "f5",
  name: "Quick Inspirations",
  count: 0
}, {
  id: "f6",
  name: "Templates",
  count: 2
}];
const LibraryMyStyles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [showQuickSaveModal, setShowQuickSaveModal] = useState(false);
  const [savedStyles, setSavedStyles] = useState<Style[]>(SAMPLE_SAVED_STYLES);
  const [folders, setFolders] = useState(FOLDERS);
  const navigate = useNavigate();
  const filteredStyles = savedStyles.filter(style => {
    // Filter by search term
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase()) || style.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) || style.creatorHandle && style.creatorHandle.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by active view
    const matchesView = activeView === "all" || activeView === "favorites" && style.isFavorite || activeView === "pinned" && style.isPinned || activeView === "recent" && new Date(style.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days

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
  const handleQuickSave = () => {
    setShowQuickSaveModal(true);
  };
  const handleSaveInspiration = (newStyle: Style) => {
    // Add the new style to the savedStyles array
    setSavedStyles(prevStyles => [newStyle, ...prevStyles]);

    // Update the folder count
    setFolders(prevFolders => prevFolders.map(folder => folder.name === newStyle.folder ? {
      ...folder,
      count: folder.count + 1
    } : folder));

    // Show success message
    toast.success("Inspiration saved successfully!");
  };
  return <div className="flex h-full overflow-hidden">
      {/* Sidebar with folders */}
      <div className="hidden sm:flex flex-col w-64 border-r border-white/10 pr-4 mr-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Folders</h3>
          <Button variant="outline" size="sm" className="bg-transparent border-dashed h-8 w-8 p-0" title="New Folder">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {folders.map(folder => <Button key={folder.id} variant={selectedFolder === folder.name ? "secondary" : "ghost"} className={`w-full justify-start ${selectedFolder === folder.name ? 'bg-[#24293A] text-white' : ''}`} onClick={() => setSelectedFolder(folder.name)}>
              <Folder className="h-4 w-4 mr-2" />
              {folder.name}
              <span className="ml-auto text-white/40 text-xs">{folder.count}</span>
            </Button>)}
        </div>
        
        <div className="space-y-2 mt-8">
          <Button onClick={handleCreateStyle} className="w-full bg-[#3260ea] hover:bg-[#2853c6]">
            <Plus className="h-4 w-4 mr-2" />
            Create Your Own Style
          </Button>
          
          <Button onClick={handleQuickSave} variant="outline" className="w-full bg-transparent border-white/20 hover:bg-white/5">
            <Save className="h-4 w-4 mr-2" />
            Quick Save Inspiration
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Hero card for Quick Save */}
        <CardContainer className="mb-4 p-4 bg-gradient-to-r from-[#1F2937] to-[#1A202C] shadow-md">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block bg-[#3260ea]/20 p-3 rounded-full">
              <Sparkles className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium text-white">Have a bookmarked post that inspired you?</h3>
              <p className="text-sm text-white/80">
                <strong>Quick Save</strong> it and reuse it later.
              </p>
            </div>
            <Button onClick={handleQuickSave} className="bg-[#3260ea] hover:bg-[#2853c6] whitespace-nowrap" size="sm">
              <Save className="h-4 w-4 mr-1" />
              <span className="sm:inline hidden">Quick Save</span>
              <span className="sm:hidden inline">Save</span>
            </Button>
          </div>
        </CardContainer>

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
          <select className="w-full bg-[#1A202C] border border-white/10 rounded-md h-10 px-3 text-white" value={selectedFolder} onChange={e => setSelectedFolder(e.target.value)}>
            {folders.map(folder => <option key={folder.id} value={folder.name}>
                {folder.name} ({folder.count})
              </option>)}
          </select>
          
          <div className="flex gap-2">
            <Button onClick={handleCreateStyle} className="flex-1 bg-[#3260ea] hover:bg-[#2853c6]">
              <Plus className="h-4 w-4 mr-2" />
              Create Style
            </Button>
            
            <Button onClick={handleQuickSave} variant="outline" className="flex-1 bg-transparent border-white/20 hover:bg-white/5">
              <Save className="h-4 w-4 mr-2" />
              Quick Save
            </Button>
          </div>
        </div>

        {/* Saved styles grid */}
        <ScrollArea className="flex-1">
          {filteredStyles.length > 0 ? <div className="grid grid-cols-1 gap-4 pb-10">
              {filteredStyles.map(style => <StyleCard key={style.id} style={style} />)}
            </div> : <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-[#1A202C]/50 rounded-lg border border-white/5">
              <Star className="h-16 w-16 text-white/20 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No saved styles found</h3>
              <p className="text-white/70 mb-4">
                {searchTerm ? 'Try adjusting your search' : 'Start saving styles from the Explore tab or Quick Save your inspiration'}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSearchParams({
              tab: "explore"
            })} className="bg-transparent border-white/20">
                  Browse Explore
                </Button>
                <Button onClick={handleQuickSave} className="bg-[#3260ea] hover:bg-[#2853c6]">
                  <Save className="h-4 w-4 mr-2" />
                  Quick Save
                </Button>
              </div>
            </div>}
        </ScrollArea>
      </div>
      
      {/* Quick Save Modal */}
      <QuickSaveModal isOpen={showQuickSaveModal} onClose={() => setShowQuickSaveModal(false)} onSave={handleSaveInspiration} />
    </div>;
};
export default LibraryMyStyles;