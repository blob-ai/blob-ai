
import React, { useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  MessageSquare,
  Trash2,
  Pin,
  Copy,
  Edit,
  Share,
  MoreHorizontal,
  Layout,
  BookmarkCheck,
  Type,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface StyleCardProps {
  style: {
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
}

const StyleCard: React.FC<StyleCardProps> = ({ style }) => {
  const [isFavorite, setIsFavorite] = useState(style.isFavorite);
  const [isPinned, setIsPinned] = useState(style.isPinned);
  const navigate = useNavigate();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      !isFavorite ? 
        `Added ${style.name} to favorites` : 
        `Removed ${style.name} from favorites`
    );
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    toast.success(
      !isPinned ? 
        `Pinned ${style.name} to top` : 
        `Unpinned ${style.name}`
    );
  };

  const handleDelete = () => {
    toast.success(`Deleted ${style.name}`);
  };

  const handleUseStyle = () => {
    toast.success(`Using ${style.name} style`);
    navigate('/dashboard/content?step=canvas', { 
      state: { selectedStyle: style } 
    });
  };

  const handleChatAbout = () => {
    toast.success(`Opening chat about ${style.name}`);
  };

  const handleConvertToStyle = () => {
    navigate('/dashboard/library?tab=create', { 
      state: { 
        convertFromInspiration: true,
        inspirationData: style 
      }
    });
    toast.success(`Converting ${style.name} to style`);
  };

  // Determine card accent color and icon based on type
  const getCardTypeDetails = () => {
    if (style.isSavedInspiration) {
      return {
        icon: <BookmarkCheck className="h-4 w-4 text-amber-400" />,
        label: "Saved Inspiration",
        description: "Content you've saved for reference"
      };
    } else if (style.isTemplate) {
      return {
        icon: <Layout className="h-4 w-4 text-emerald-400" />,
        label: "Template",
        description: "Structure-focused format for reuse"
      };
    } else {
      return {
        icon: <Type className="h-4 w-4 text-blue-400" />,
        label: "Style",
        description: "Tone & voice pattern for your content"
      };
    }
  };

  const cardTypeDetails = getCardTypeDetails();

  return (
    <CardContainer className={`bg-[#1A202C] border-white/10 p-0 overflow-hidden ${
      style.isSavedInspiration 
        ? "border-l-4 border-l-amber-500/50" 
        : style.isTemplate 
          ? "border-l-4 border-l-emerald-500/50" 
          : "border-l-4 border-l-[#3260ea]/50"
    } shadow-md hover:shadow-lg transition-all`}>
      {/* Card Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1E2431]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {cardTypeDetails.icon}
            <h3 className="font-medium text-white">{style.name}</h3>
          </div>
          <div className="flex items-center text-sm text-white/70">
            {style.source === "creator" ? (
              <>
                <img
                  src={style.creatorAvatar || "/placeholder.svg"}
                  alt={style.creatorName}
                  className="w-5 h-5 rounded-full mr-1"
                />
                <span>{style.creatorHandle || style.creatorName}</span>
              </>
            ) : style.isSavedInspiration ? (
              <span>Saved Inspiration</span>
            ) : (
              <span>Created by you</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            onClick={toggleFavorite}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            onClick={togglePin}
          >
            <Pin
              className={`h-4 w-4 ${isPinned ? "text-[#3260ea]" : ""}`}
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-[#1A202C] border-white/10 text-white"
              align="end"
              forceMount
            >
              <DropdownMenuLabel>{style.name}</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleUseStyle}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Use this {style.isSavedInspiration ? "inspiration" : style.isTemplate ? "template" : "style"}</span>
                </DropdownMenuItem>
                
                {style.isSavedInspiration && (
                  <DropdownMenuItem onClick={handleConvertToStyle}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Convert to Style</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem onClick={handleChatAbout}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>{style.isSavedInspiration ? 'Chat about this' : 'Chat with this voice'}</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-white/10" />
                
                <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        {style.description && (
          <p className="text-sm text-white/80">{style.description}</p>
        )}

        <ScrollArea className="h-28 w-full rounded-md border border-white/10 p-3 bg-[#151A24] shadow-inner">
          <p className="text-sm whitespace-pre-wrap text-white/90">{style.example}</p>
        </ScrollArea>

        <div className="flex flex-wrap gap-2">
          {style.tone.map((tag) => (
            <Badge
              key={tag}
              className={`${
                style.isSavedInspiration
                  ? "bg-amber-500/20 text-amber-400"
                  : style.isTemplate
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-[#3260ea]/20 text-blue-400"
              } border-none`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-white/10 p-3 bg-[#1E2431] flex items-center justify-between">
        <div className="text-xs text-white/50 flex items-center gap-1">
          {cardTypeDetails.icon}
          <span>{cardTypeDetails.label} • {style.folder}</span>
        </div>

        {style.isSavedInspiration ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-transparent border-white/20 hover:bg-white/10"
              onClick={handleConvertToStyle}
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Convert to Style
            </Button>
            <Button
              size="sm"
              className="h-8 bg-[#3260ea] hover:bg-[#2853c6]"
              onClick={handleUseStyle}
            >
              Use in Post
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            className="h-8 bg-[#3260ea] hover:bg-[#2853c6]"
            onClick={handleUseStyle}
          >
            Use This {style.isTemplate ? "Template" : "Style"}
          </Button>
        )}
      </div>
    </CardContainer>
  );
};

export default StyleCard;
