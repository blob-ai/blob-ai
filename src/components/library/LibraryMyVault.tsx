
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Search, Folder, BookmarkCheck, Clock, Heart } from "lucide-react";
import { CardContainer } from "@/components/ui/card-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SavedPostCard from "./SavedPostCard";

// Sample saved posts - in a real app this would come from an API
const SAMPLE_SAVED_POSTS = [
  {
    id: "p1",
    creatorName: "Naval Ravikant",
    creatorHandle: "@naval",
    creatorAvatar: "https://pbs.twimg.com/profile_images/1256841238298292232/ycqwaMI2_400x400.jpg",
    text: "If you aren't willing to be mocked, you'll never be original enough.",
    engagement: { likes: 2563, retweets: 412 },
    date: "2023-05-15",
    isFavorite: true,
    folder: "Inspiration"
  },
  {
    id: "p2",
    creatorName: "Alex Hormozi",
    creatorHandle: "@AlexHormozi",
    creatorAvatar: "https://pbs.twimg.com/profile_images/1602381288925261824/OBgGZqZ7_400x400.jpg",
    text: "The 3 types of leverage:\n\n1. Money\n2. People\n3. Technology\n\nMost beginners focus on 1, not realizing that's the hardest to get.\n\nIf you can create leverage with people and technology, money will flow to you.\n\nMaster people and tech first. Money comes last.",
    engagement: { likes: 1853, retweets: 324 },
    date: "2023-06-22",
    isFavorite: false,
    folder: "Business"
  },
  {
    id: "p3",
    creatorName: "Sahil Bloom",
    creatorHandle: "@SahilBloom",
    creatorAvatar: "https://pbs.twimg.com/profile_images/1735694839870857216/MQW8CD5T_400x400.jpg",
    text: "The 5-hour rule:\n\nThe most successful people in history all followed the same routine.\n\nThey dedicated at least 5 hours per week to deliberate learning.\n\nBen Franklin, Oprah, Bill Gates, Warren Buffett.\n\nIt's a simple rule: Invest in yourself for 1 hour each day.",
    engagement: { likes: 1245, retweets: 287 },
    date: "2023-06-10",
    isFavorite: true,
    folder: "Inspiration"
  },
  {
    id: "p4",
    creatorName: "Paul Graham",
    creatorHandle: "@paulg",
    creatorAvatar: "https://pbs.twimg.com/profile_images/1824002576/pg-railsconf_400x400.jpg",
    text: "17 unconventional productivity tips I've found to actually work:\n\n1. If you're stuck, write down 10 bad ideas first\n2. Save tasks requiring deep focus for when you're most alert",
    engagement: { likes: 956, retweets: 176 },
    date: "2023-07-05",
    isFavorite: false,
    folder: "Productivity"
  }
];

// Sample folders
const FOLDERS = [
  { id: "f1", name: "All", count: 12 },
  { id: "f2", name: "Inspiration", count: 5 },
  { id: "f3", name: "Business", count: 3 },
  { id: "f4", name: "Productivity", count: 4 }
];

const LibraryMyVault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState("All");

  const filteredPosts = SAMPLE_SAVED_POSTS.filter(post => {
    // Filter by search term
    const matchesSearch = 
      post.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.creatorHandle.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filter by active view
    const matchesView = 
      (activeView === "all") ||
      (activeView === "favorites" && post.isFavorite) ||
      (activeView === "recent" && new Date(post.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // Last 7 days
      
    // Filter by selected folder
    const matchesFolder = selectedFolder === "All" || post.folder === selectedFolder;
    
    return matchesSearch && matchesView && matchesFolder;
  });

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar with folders */}
      <div className="hidden sm:flex flex-col w-64 border-r border-white/10 pr-4 mr-4 overflow-auto">
        <h3 className="text-lg font-medium mb-4">Folders</h3>
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
        <Button variant="outline" className="mt-4 bg-transparent border-dashed">
          <Plus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search bar */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder="Search saved posts"
            className="pl-10 bg-black/20 border-white/10 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* View tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
          <TabsList className="bg-black/20 border border-white/10 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/10">
              <BookmarkCheck className="h-4 w-4 mr-2" />
              All
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

        {/* Mobile folder selector */}
        <div className="sm:hidden mb-4">
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
        </div>

        {/* Saved posts grid */}
        <ScrollArea className="flex-1">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 pb-10">
              {filteredPosts.map((post) => (
                <SavedPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <BookmarkCheck className="h-16 w-16 text-white/20 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No saved posts found</h3>
              <p className="text-white/60 mb-4">
                {searchTerm ? 'Try adjusting your search' : 'Start saving posts from the Discover tab'}
              </p>
              <Button variant="outline">
                Browse Discover
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default LibraryMyVault;
