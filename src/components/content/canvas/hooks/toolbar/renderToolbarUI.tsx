
import React, { RefObject } from "react";
import { 
  Bold, 
  Italic, 
  List
} from "lucide-react";
import { FormattingType } from "@/lib/formatting";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RenderToolbarProps {
  toolbarRef: RefObject<HTMLDivElement>;
  positionToolbar: () => Record<string, string>;
  activeFormats: FormattingType[];
  handleAIAction: (action: any) => void; // Keep for compatibility but won't use
  handleFormatting: (format: FormattingType) => void;
}

/**
 * Renders the simplified floating toolbar UI for CanvasEditor
 * Only includes Bold, Italic, and Bullet formatting options
 */
export const renderToolbarUI = ({
  toolbarRef,
  positionToolbar,
  activeFormats,
  handleFormatting
}: RenderToolbarProps) => {
  // Simplified format options - only text formatting tools
  const formatOptions = [
    { id: 'bold' as FormattingType, icon: <Bold className="h-3.5 w-3.5" />, label: "Bold" },
    { id: 'italic' as FormattingType, icon: <Italic className="h-3.5 w-3.5" />, label: "Italic" },
    { id: 'list' as FormattingType, icon: <List className="h-3.5 w-3.5" />, label: "Bullet List" },
  ];
  
  return (
    <TooltipProvider>
      <div
        ref={toolbarRef}
        className="selection-toolbar animate-toolbar-appear bg-[#242c3d] shadow-xl border border-white/20 rounded-lg px-2 py-1"
        style={positionToolbar()}
        data-testid="content-editor-toolbar"
      >
        {/* Text formatting options only */}
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
      </div>
    </TooltipProvider>
  );
};
