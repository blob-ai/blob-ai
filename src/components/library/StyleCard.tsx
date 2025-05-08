
import React, { useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  HeartOff, 
  MessageSquare, 
  MoreHorizontal, 
  Pencil, 
  Pin, 
  PinOff, 
  Trash2 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Style {
  id: string;
  name: string;
  creatorName: string;
  creatorHandle?: string;
  creatorAvatar?: string;
  description: string;
  tone: string[];
  example: string;
  date: string;
  isFavorite: boolean;
  isPinned: boolean;
  folder: string;
  isTemplate: boolean;
  source: "user" | "creator";
}

interface StyleCardProps {
  style: Style;
}

const StyleCard: React.FC<StyleCardProps> = ({ style }) => {
  const [isFavorite, setIsFavorite] = useState(style.isFavorite);
  const [isPinned, setIsPinned] = useState(style.isPinned);
  const navigate = useNavigate();
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(!isFavorite ? "Added to favorites" : "Removed from favorites");
  };
  
  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinned(!isPinned);
    toast.success(!isPinned ? "Style pinned successfully" : "Style unpinned");
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Style deleted");
    // In a real app, you would call an API to delete the style
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dashboard/library?tab=create&edit=${style.id}`);
  };
  
  const handleUseStyle = () => {
    navigate("/dashboard/content/create", { 
      state: { selectedStyle: style.id }
    });
    toast.success(`Using style: ${style.name}`);
  };
  
  const handleChatWithVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Premium feature: Chat with this voice");
    // In a real app, this would open a chat interface or show upgrade modal
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
  
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <CardContainer className="hover:border-primary-400/40 transition-all cursor-pointer">
      <div>
        {/* Card header with avatar and actions */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            {style.source === "creator" && style.creatorAvatar ? (
              <Avatar className="h-10 w-10 border border-white/10">
                <AvatarImage src={style.creatorAvatar} alt={style.creatorName} />
                <AvatarFallback>{getInitials(style.creatorName)}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-500/30 flex items-center justify-center border border-primary-500/50">
                <span className="font-medium text-primary-400">{getInitials(style.name)}</span>
              </div>
            )}
            
            <div>
              <h3 className="text-white font-medium">{style.name}</h3>
              <p className="text-white/60 text-xs">
                {style.source === "creator" ? `From ${style.creatorHandle || style.creatorName}` : "Created by you"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
              onClick={handleToggleFavorite}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? <Heart className="h-4 w-4 text-red-500" /> : <HeartOff className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
              onClick={handleTogglePin}
              title={isPinned ? "Unpin style" : "Pin style"}
            >
              {isPinned ? <Pin className="h-4 w-4 text-primary-400" /> : <PinOff className="h-4 w-4" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1A1F2C] border-white/10 text-white">
                <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit style
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-500 focus:text-red-500">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete style
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Card content */}
        <div>
          {style.description && (
            <p className="text-sm text-white/80 mb-3">{style.description}</p>
          )}
          
          <div className="flex flex-wrap gap-1 mb-3">
            {style.tone.map((tone, index) => (
              <Badge key={index} variant="secondary" className="bg-white/10 text-white/80 border-none">
                {tone}
              </Badge>
            ))}
            
            {style.isTemplate && (
              <Badge variant="outline" className="bg-primary-500/20 text-primary-400 border-none">
                Template
              </Badge>
            )}
          </div>
          
          {/* Example preview */}
          <div className="bg-black/20 border border-white/5 rounded-md p-3 my-3">
            <p className="text-sm text-white/80 italic">"{style.example}"</p>
          </div>
        </div>
        
        {/* Card footer */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-white/40">
            Saved on {formatDate(style.date)}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent hover:bg-white/10"
              onClick={handleChatWithVoice}
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              Chat with Voice
            </Button>
            
            <Button
              size="sm"
              className="bg-primary-500 hover:bg-primary-600"
              onClick={handleUseStyle}
            >
              Use This Style
            </Button>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default StyleCard;
