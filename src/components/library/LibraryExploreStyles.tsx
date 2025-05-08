
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import CreatorCard from "./CreatorCard";

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
    avatar: "https://pbs.twimg.com/profile_images/1218306485326008320/7rA5nWg1_400x400.jpg",
    followers: "348K",
    category: "Humor",
    summary: "Short, relatable observational humor paired with images.",
    tone: "Sarcastic, Witty, Concise"
  }
];

const categories = ["All", "Tech", "Marketing", "Personal Growth", "Humor"];
const tones = ["All", "Bold", "Thoughtful", "Casual", "Analytical", "Motivational", "Educational", "Sarcastic"];
const sortOptions = ["Popularity", "Most Recent", "A-Z"];

const LibraryExploreStyles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTone, setSelectedTone] = useState("All");
  const [sortBy, setSortBy] = useState("Popularity");

  const filteredCreators = SAMPLE_CREATORS.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          creator.handle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || creator.category === selectedCategory;
    const matchesTone = selectedTone === "All" || creator.tone.includes(selectedTone);
    
    return matchesSearch && matchesCategory && matchesTone;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 px-1">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder="Search creator styles"
            className="pl-10 bg-black/20 border-white/10 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[130px] bg-black/20 border-white/10 h-10">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1F2C] border-white/10 text-white">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedTone} onValueChange={setSelectedTone}>
            <SelectTrigger className="w-[130px] bg-black/20 border-white/10 h-10">
              <SelectValue placeholder="Tone" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1F2C] border-white/10 text-white">
              {tones.map((tone) => (
                <SelectItem key={tone} value={tone}>{tone}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px] bg-black/20 border-white/10 h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1F2C] border-white/10 text-white">
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
  );
};

export default LibraryExploreStyles;
