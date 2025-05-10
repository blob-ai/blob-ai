import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { Search, Save, Sparkles } from "lucide-react";
import CreatorCard from "./CreatorCard";
import BookmarkSection from "./BookmarkSection";
import QuickSaveModal from "./QuickSaveModal";
import { toast } from "sonner";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Bookmark } from "@/types/bookmark";
import { v4 as uuidv4 } from "uuid";

// Sample creator data - in a real app this would come from an API
const SAMPLE_CREATORS = [
  {
    id: "1",
    name: "Naval Ravikant",
    handle: "@naval",
    avatar: "https://pbs.twimg.com/profile_images/1256841238298292232/ycqwaMI2_400x400.jpg",
    followers: "1.9M",
    category: "Tech",
    summary: "Concise philosophical insights on wealth, health and happiness.",
    tone: "Thoughtful, Direct, Philosophical"
  },
  {
    id: "2",
    name: "Pieter Levels",
    handle: "@levelsio",
    avatar: "https://pbs.twimg.com/profile_images/1560843221928894464/zWrUjorg_400x400.jpg",
    followers: "236K",
    category: "Tech",
    summary: "Indie maker building in public. Transparent business metrics and startup insights.",
    tone: "Casual, Direct, Informative"
  },
  {
    id: "3",
    name: "Paul Graham",
    handle: "@paulg",
    avatar: "https://pbs.twimg.com/profile_images/1824002576/pg-railsconf_400x400.jpg",
    followers: "1.4M",
    category: "Tech",
    summary: "Long-form thoughts on startups, innovation, and society. Essay-like threads.",
    tone: "Thoughtful, Academic, Analytical"
  },
  {
    id: "4",
    name: "Alex Hormozi",
    handle: "@AlexHormozi",
    avatar: "https://pbs.twimg.com/profile_images/1602381288925261824/OBgGZqZ7_400x400.jpg", 
    followers: "586K",
    category: "Marketing",
    summary: "Marketing and business growth strategies. Actionable, list-based advice.",
    tone: "Bold, Motivational, Strategic"
  },
  {
    id: "5",
    name: "Sahil Bloom",
    handle: "@SahilBloom",
    avatar: "https://pbs.twimg.com/profile_images/1735694839870857216/MQW8CD5T_400x400.jpg",
    followers: "851K",
    category: "Personal Growth",
    summary: "Mental models and frameworks for business and life. Thread-based content.",
    tone: "Educational, Structured, Clear"
  },
  {
    id: "6",
    name: "Dude With Sign",
    handle: "@dudewithsign",
    avatar: "https://pbs.twimg.com/profile_images/1218306485326008320/7A5nWg1_400x400.jpg",
    followers: "348K",
    category: "Humor",
    summary: "Short, relatable observational humor paired with images.",
    tone: "Sarcastic, Witty, Concise"
  }
];

const categories = ["All", "Tech", "Marketing", "Personal Growth", "Humor"];
const sortOptions = ["Popularity", "Most Recent", "A-Z"];

const LibraryExploreStyles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Popularity");
  const [showQuickSaveModal, setShowQuickSaveModal] = useState(false);
  
  const { bookmarks, loading, error, addBookmark, deleteBookmark, updateBookmark } = useBookmarks();

  const filteredCreators = SAMPLE_CREATORS.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          creator.handle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || creator.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSaveBookmark = (newBookmark: Omit<Bookmark, "id" | "user_id" | "created_at" | "updated_at">) => {
    const bookmark = {
      ...newBookmark,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    addBookmark(bookmark);
    setShowQuickSaveModal(false);
    toast.success("Bookmark saved successfully!");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Quick save banner */}
      <CardContainer className="mb-4 p-4 flex items-center justify-between bg-[#1A1F2C]">
        <div className="flex items-center gap-3">
          <div className="bg-[#3260ea]/20 rounded-full p-2">
            <Sparkles className="h-5 w-5 text-[#3260ea]" />
          </div>
          <div>
            <h3 className="font-medium text-white">Have a bookmarked post that inspired you?</h3>
            <p className="text-sm text-white/70">Quick Save it and reuse it later.</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowQuickSaveModal(true)}
          className="whitespace-nowrap bg-[#3260ea] hover:bg-[#2853c6]"
        >
          <Save className="h-4 w-4 mr-2" /> 
          Save a Post
        </Button>
      </CardContainer>

      {/* Bookmarks section */}
      {bookmarks && bookmarks.length > 0 && (
        <BookmarkSection 
          bookmarks={bookmarks}
          onDelete={deleteBookmark}
          onUpdate={(bookmark) => {
            updateBookmark(bookmark.id, bookmark);
          }}
        />
      )}
      
      {/* Search and filters */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-white mb-4">Creator Inspiration</h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-6 px-1">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search creator styles"
              className="pl-10 bg-[#1A202C] border-white/10 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[130px] bg-[#1A202C] border-white/10 h-10">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A202C] border-white/10 text-white">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px] bg-[#1A202C] border-white/10 h-10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A202C] border-white/10 text-white">
                {sortOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Creator grid */}
        <ScrollArea className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
            {filteredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Quick Save Modal */}
      <QuickSaveModal 
        isOpen={showQuickSaveModal} 
        onClose={() => setShowQuickSaveModal(false)} 
        onSave={handleSaveBookmark}
      />
    </div>
  );
};

export default LibraryExploreStyles;
