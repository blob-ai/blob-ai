
import React, { useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Heart, Bookmark, MessageSquare, Repeat, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Post {
  id: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  text: string;
  engagement: {
    likes: number;
    retweets: number;
  };
  date: string;
  isFavorite: boolean;
  folder: string;
}

interface SavedPostCardProps {
  post: Post;
}

const SavedPostCard: React.FC<SavedPostCardProps> = ({ post }) => {
  const [isFavorite, setIsFavorite] = useState(post.isFavorite);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleApplyStyle = () => {
    // Navigate to style lab with this post's style
    // This would be implemented in a real app
    console.log("Apply style from post:", post.id);
  };

  return (
    <CardContainer className="hover:border-primary-400/30 transition-all">
      <div className="flex flex-col">
        {/* Post header */}
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/10">
              <AvatarImage src={post.creatorAvatar} alt={post.creatorName} />
              <AvatarFallback>{post.creatorName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium leading-tight">{post.creatorName}</p>
              <p className="text-white/60 text-sm">{post.creatorHandle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="bg-black/30 text-white/60 border-white/10 h-6">
              {post.folder}
            </Badge>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/10"
              onClick={toggleFavorite}
            >
              <Heart 
                className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white/60'}`} 
              />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10">
                  <MoreHorizontal className="h-4 w-4 text-white/60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1A1F2C] border-white/10 text-white">
                <DropdownMenuItem>Move to folder</DropdownMenuItem>
                <DropdownMenuItem>Remove from saved</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Post content */}
        <div className="mt-3 text-white/90 whitespace-pre-line">
          {post.text}
        </div>
        
        {/* Post metadata */}
        <div className="mt-3 flex items-center justify-between text-white/60 text-sm">
          <span>{formatDate(post.date)}</span>
        </div>
        
        {/* Post stats */}
        <div className="mt-3 flex items-center gap-4 text-white/60 text-sm border-t border-white/10 pt-3">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" />
            <span>Reply</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Repeat className="h-4 w-4" />
            <span>{formatNumber(post.engagement.retweets)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="h-4 w-4" />
            <span>{formatNumber(post.engagement.likes)}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Share2 className="h-4 w-4" />
          </div>
        </div>
        
        {/* Action button */}
        <Button 
          variant="default" 
          className="mt-4 bg-primary-500 hover:bg-primary-600"
          onClick={handleApplyStyle}
        >
          Apply This Style
        </Button>
      </div>
    </CardContainer>
  );
};

export default SavedPostCard;
