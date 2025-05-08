import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define the Creator type
type Creator = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  description: string;
  styleCount: number;
  followers: number;
  isVerified: boolean;
};

// Sample creator data - in a real app this would come from an API
const SAMPLE_CREATORS: Creator[] = [
  {
    id: "c1",
    name: "Naval Ravikant",
    handle: "@naval",
    avatar: "https://pbs.twimg.com/profile_images/1256841238298292232/ycqwaMI2_400x400.jpg",
    description: "Philosopher, Investor, and Podcaster",
    styleCount: 12,
    followers: 5432,
    isVerified: true
  },
  {
    id: "c2",
    name: "Alex Hormozi",
    handle: "@AlexHormozi",
    avatar: "https://pbs.twimg.com/profile_images/1602381288925261824/OBgGZqZ7_400x400.jpg",
    description: "Business Growth Expert",
    styleCount: 8,
    followers: 4876,
    isVerified: false
  },
  {
    id: "c3",
    name: "Sahil Bloom",
    handle: "@SahilBloom",
    avatar: "https://pbs.twimg.com/profile_images/1735694839870857216/MQW8CD5T_400x400.jpg",
    description: "Writer and Investor",
    styleCount: 15,
    followers: 6123,
    isVerified: true
  },
  {
    id: "c4",
    name: "James Clear",
    handle: "@JamesClear",
    avatar: "https://pbs.twimg.com/profile_images/1459506244336871424/Wdr5JvWW_400x400.jpg",
    description: "Author of Atomic Habits",
    styleCount: 10,
    followers: 7291,
    isVerified: true
  },
  {
    id: "c5",
    name: "Trung Phan",
    handle: "@TrungTPhan",
    avatar: "https://pbs.twimg.com/profile_images/1478459499577249793/AIWJ5jes_400x400.jpg",
    description: "Writer at The Hustle",
    styleCount: 7,
    followers: 3987,
    isVerified: false
  }
];

// CreatorCard component with updated background color
const CreatorCard = ({ creator }: { creator: Creator }) => {
  return (
    <CardContainer className="bg-[#1e2431] border-white/10 p-4 hover:border-white/20 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="w-12 h-12 rounded-full border border-white/10"
        />
        <div>
          <h3 className="font-medium text-white">{creator.name}</h3>
          <p className="text-sm text-white/60">{creator.handle}</p>
        </div>
        
        {/* Render verified badge if creator is verified */}
        {creator.isVerified && (
          <div className="ml-auto mr-1">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-none">
              <CheckCircle className="h-3 w-3 mr-1" /> Verified
            </Badge>
          </div>
        )}
      </div>
      
      <p className="text-sm text-white/70 mb-3 line-clamp-2">
        {creator.description}
      </p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">{creator.styleCount} styles</span>
          <span className="text-white/30">•</span>
          <span className="text-xs text-white/50">{creator.followers} followers</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 bg-transparent border-white/20 hover:bg-white/5"
        >
          Follow
        </Button>
      </div>
    </CardContainer>
  );
};

const LibraryExploreStyles: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
        <Input placeholder="Search creators" className="pl-10 bg-[#1A202C] border-white/10 h-10" />
      </div>

      {/* Creators grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
          {SAMPLE_CREATORS.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LibraryExploreStyles;
