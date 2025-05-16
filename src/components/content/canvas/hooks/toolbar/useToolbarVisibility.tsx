
import { useState, useEffect } from "react";
import { FormattingType } from "@/lib/formatting";
import { checkActiveFormats } from "./toolbarUtils";
import { isElementInEditor } from "./domUtils";

/**
 * Hook to handle the visibility of the toolbar based on text selection
 */
export const useToolbarVisibility = (
  setSelectedText: (text: string) => void,
  setSelectedRange: (range: { start: number; end: number } | null) => void,
  setActiveFormats: (formats: FormattingType[]) => void
) => {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  
  // Monitor selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setToolbarVisible(false);
        return;
      }
      
      // Get the node where the selection is happening
      const range = selection.getRangeAt(0);
      const node = range.commonAncestorContainer;
      
      // Only proceed if selection is in the editor
      if (!isElementInEditor(node)) {
        setToolbarVisible(false);
        return;
      }
      
      const textContent = range.toString();
      
      if (textContent && textContent.trim().length > 0) {
        setSelectedText(textContent);
        setToolbarVisible(true);
        
        // Find the textarea to store selection range
        const textarea = document.querySelector('[data-content-editor="true"]') as HTMLTextAreaElement;
        if (textarea) {
          setSelectedRange({
            start: textarea.selectionStart,
            end: textarea.selectionEnd
          });
          
          // Check which formats are active
          setActiveFormats(checkActiveFormats(textContent));
        }
      } else {
        setToolbarVisible(false);
      }
    };
    
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [setSelectedText, setSelectedRange, setActiveFormats]);
  
  return { toolbarVisible, setToolbarVisible };
};
