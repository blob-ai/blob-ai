
import { useState, useRef } from "react";
import { FormattingType } from "@/lib/formatting";
import { useToolbarVisibility } from "./toolbar/useToolbarVisibility";
import { useToolbarPosition } from "./toolbar/useToolbarPosition";
import { useAIActions } from "./toolbar/useAIActions";
import { useFormattingActions } from "./toolbar/useFormattingActions";
import { renderToolbarUI } from "./toolbar/renderToolbarUI";

/**
 * Hook for handling content formatting and selection toolbar
 */
const useContentFormatting = () => {
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [activeFormats, setActiveFormats] = useState<FormattingType[]>([]);
  const [selectedText, setSelectedText] = useState<string>("");
  const toolbarRef = useRef<HTMLDivElement>(null);
  
  // Destructure sub-hooks
  const { toolbarVisible, setToolbarVisible } = useToolbarVisibility(
    setSelectedText, 
    setSelectedRange, 
    setActiveFormats
  );
  
  const { 
    toolbarPosition, 
    positionToolbar,
    calculateToolbarPosition
  } = useToolbarPosition(toolbarRef);
  
  const { handleAIAction } = useAIActions(
    selectedText, 
    selectedRange, 
    setToolbarVisible
  );
  
  const { handleFormatting: handleFormattingAction } = useFormattingActions(
    activeFormats, 
    setActiveFormats
  );
  
  // Apply formatting handler
  const handleFormatting = (
    format: FormattingType, 
    content: string, 
    setContent: (content: string) => void, 
    textareaRef: React.RefObject<HTMLTextAreaElement>
  ) => {
    handleFormattingAction(format, content, setContent, textareaRef);
  };
  
  // Helper to handle formatting from the toolbar
  const handleToolbarFormatting = (format: FormattingType) => {
    // Dispatch a custom event for formatting
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('applyFormatting', { 
        detail: { 
          format,
          context: 'content-editor' 
        } 
      });
      document.dispatchEvent(event);
    }
  };
  
  // Render floating toolbar UI
  const renderFloatingToolbar = () => {
    if (!toolbarVisible) return null;
    
    return renderToolbarUI({
      toolbarRef,
      positionToolbar,
      activeFormats,
      handleAIAction,
      handleFormatting: handleToolbarFormatting
    });
  };

  return { 
    handleFormatting,
    renderFloatingToolbar,
    toolbarVisible,
    setToolbarVisible,
    activeFormats,
    selectedText,
    selectedRange
  };
};

export default useContentFormatting;
