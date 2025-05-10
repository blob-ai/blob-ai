
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import BookmarkSection from "./BookmarkSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuickSaveModal from "./QuickSaveModal";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Bookmark } from "@/types/bookmark";

const LibraryExploreStyles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { bookmarks, loading, error, addBookmark, deleteBookmark, updateBookmark } = useBookmarks();

  const categories = ['All', 'Twitter', 'LinkedIn', 'Facebook', 'Other'];

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = 
      searchQuery === "" || 
      bookmark.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === null || 
      selectedCategory === 'All' || 
      (bookmark.source && bookmark.source.toLowerCase() === selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const handleAddBookmark = async (bookmark: Omit<Bookmark, "id" | "user_id" | "created_at" | "updated_at">) => {
    await addBookmark(bookmark);
    setIsModalOpen(false);
  };

  const handleBookmarkUpdate = (bookmark: Bookmark) => {
    updateBookmark(bookmark.id, bookmark);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Input 
            placeholder="Search bookmarks..." 
            className="bg-[#191F2C] border-white/10 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
        <Button 
          className="bg-[#3260ea] hover:bg-[#2853c6] gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <BookmarkPlus className="h-4 w-4" />
          <span className="md:inline-block">Save New</span>
        </Button>
      </div>
      
      <div className="mb-4">
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="bg-[#191F2C] border border-white/10 p-0.5">
            {categories.map((category) => (
              <TabsTrigger 
                key={category}
                value={category} 
                onClick={() => setSelectedCategory(category)}
                className="data-[state=active]:bg-[#3260ea] data-[state=active]:shadow-none text-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="flex-grow pr-4">
        {loading ? (
          <div className="text-center py-10 text-white/50">Loading bookmarks...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-400">Error loading bookmarks</div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="text-center py-10 text-white/50">
            {searchQuery 
              ? "No matching bookmarks found. Try a different search term." 
              : "No bookmarks yet. Click 'Save New' to create your first bookmark."}
          </div>
        ) : (
          <BookmarkSection 
            bookmarks={filteredBookmarks}
            onDelete={deleteBookmark}
            onUpdate={handleBookmarkUpdate}
          />
        )}
      </ScrollArea>
      
      <QuickSaveModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddBookmark}
      />
    </div>
  );
};

export default LibraryExploreStyles;
