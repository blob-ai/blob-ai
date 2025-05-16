
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

interface RenderToolbarProps {
  toolbarRef: RefObject<HTMLDivElement>;
  positionToolbar: () => Record<string, string>;
  activeFormats: FormattingType[];
  handleAIAction: (action: AIActionType) => void;
}

/**
 * Renders the floating toolbar UI
 */
export const renderToolbarUI = ({
  toolbarRef,
  positionToolbar,
  activeFormats,
  handleAIAction
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
    <div
      ref={toolbarRef}
      className="selection-toolbar animate-toolbar-appear"
      style={positionToolbar()}
      data-testid="content-editor-toolbar"
    >
      {/* Text formatting options */}
      <div className="flex gap-1">
        {formatOptions.map((option) => (
          <button
            key={option.id}
            className={`p-2 rounded transition-colors flex items-center justify-center ${
              activeFormats.includes(option.id) ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/70'
            }`}
            title={option.label}
            onClick={() => {
              // Dispatch formatting event
              if (typeof window !== 'undefined') {
                const event = new CustomEvent('applyFormatting', { 
                  detail: { 
                    format: option.id,
                    context: 'content-editor' 
                  } 
                });
                document.dispatchEvent(event);
              }
            }}
          >
            {option.icon}
          </button>
        ))}
      </div>
      
      {/* Separator */}
      <div className="w-px h-5 bg-white/20 mx-1"></div>
      
      {/* AI action options */}
      <div className="flex gap-1">
        {aiOptions.map((option) => (
          <button
            key={option.id}
            className="p-2 rounded transition-colors flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white"
            title={option.label}
            onClick={() => handleAIAction(option.id)}
          >
            {option.icon}
            <span className="sr-only">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
