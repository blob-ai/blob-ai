
import React, { RefObject } from "react";
import { 
  Bold, 
  Italic, 
  Underline,
  List,
  Wand2,
  Palette,
  RefreshCw,
  MessageCircle
} from "lucide-react";
import { FormattingType } from "@/lib/formatting";
import { AIActionType } from "./useAIActions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RenderToolbarProps {
  toolbarRef: RefObject<HTMLDivElement>;
  positionToolbar: () => Record<string, string>;
  activeFormats: FormattingType[];
  handleAIAction: (action: AIActionType) => void;
  handleFormatting: (format: FormattingType) => void;
}

/**
 * Renders the floating toolbar UI
 */
export const renderToolbarUI = ({
  toolbarRef,
  positionToolbar,
  activeFormats,
  handleAIAction,
  handleFormatting
}: RenderToolbarProps) => {
  // Format options - text formatting tools
  const formatOptions = [
    { id: 'bold' as FormattingType, icon: <Bold className="h-3.5 w-3.5" />, label: "Bold" },
    { id: 'italic' as FormattingType, icon: <Italic className="h-3.5 w-3.5" />, label: "Italic" },
    { id: 'underline' as FormattingType, icon: <Underline className="h-3.5 w-3.5" />, label: "Underline" },
    { id: 'list' as FormattingType, icon: <List className="h-3.5 w-3.5" />, label: "List" },
  ];
  
  // AI action options - AI editing tools
  const aiOptions = [
    { id: 'improve' as AIActionType, icon: <Wand2 className="h-3.5 w-3.5" />, label: "Improve" },
    { id: 'tone' as AIActionType, icon: <Palette className="h-3.5 w-3.5" />, label: "Tone" },
    { id: 'rewrite' as AIActionType, icon: <RefreshCw className="h-3.5 w-3.5" />, label: "Rewrite" },
    { id: 'comment' as AIActionType, icon: <MessageCircle className="h-3.5 w-3.5" />, label: "Comment" },
  ];
  
  return (
    <TooltipProvider>
      <div
        ref={toolbarRef}
        className="selection-toolbar animate-toolbar-appear bg-[#242c3d] shadow-xl z-[9999]"
        style={positionToolbar()}
        data-testid="content-editor-toolbar"
      >
        {/* Text formatting options */}
        <div className="flex gap-1">
          {formatOptions.map((option) => (
            <Tooltip key={option.id}>
              <TooltipTrigger asChild>
                <button
                  className={`p-2 rounded transition-colors flex items-center justify-center ${
                    activeFormats.includes(option.id) ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/70'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFormatting(option.id);
                  }}
                >
                  {option.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-[#16181c] text-white text-xs">
                {option.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        {/* Separator */}
        <div className="w-px h-5 bg-white/20 mx-1"></div>
        
        {/* AI action options */}
        <div className="flex gap-1">
          {aiOptions.map((option) => (
            <Tooltip key={option.id}>
              <TooltipTrigger asChild>
                <button
                  className="p-2 rounded transition-colors flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAIAction(option.id);
                  }}
                >
                  {option.icon}
                  <span className="sr-only">{option.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-[#16181c] text-white text-xs">
                {option.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};
