
import { useState, useEffect } from "react";
import { FormattingType } from "@/lib/formatting";
import { checkActiveFormats } from "./toolbarUtils";
import { isElementInEditor } from "./domUtils";

/**
 * Hook to handle the visibility of the toolbar based on text selection
 * This is specifically for the CanvasEditor textarea only
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
      
      // Hide toolbar if no selection or empty selection
      if (!selection || selection.isCollapsed || !selection.rangeCount) {
        setToolbarVisible(false);
        return;
      }
      
      // Get the node where the selection is happening
      const range = selection.getRangeAt(0);
      const node = range.commonAncestorContainer;
      
      // Check if selection is specifically in the content editor textarea
      const isInContentEditor = node.nodeType === Node.TEXT_NODE 
        ? node.parentElement?.closest('[data-content-editor="true"]') !== null
        : (node as Element).closest('[data-content-editor="true"]') !== null;
      
      // Also check if we're NOT in the chat panel
      const isInChatPanel = node.nodeType === Node.TEXT_NODE
        ? node.parentElement?.closest('[data-chat-panel="content-chat"]') !== null
        : (node as Element).closest('[data-chat-panel="content-chat"]') !== null;
      
      // Only show toolbar if selection is in content editor and NOT in chat panel
      if (!isInContentEditor || isInChatPanel) {
        console.log("Selection not in content editor or is in chat panel:", node);
        setToolbarVisible(false);
        return;
      }
      
      const textContent = range.toString();
      
      if (textContent && textContent.trim().length > 0) {
        console.log("Selected text in content editor:", textContent);
        setSelectedText(textContent);
        
        // Find the textarea specifically in the content editor
        const editor = document.querySelector('[data-content-editor="true"]') as HTMLTextAreaElement;
                      
        if (editor) {
          const selectedRange = {
            start: editor.selectionStart || 0,
            end: editor.selectionEnd || 0
          };
          
          setSelectedRange(selectedRange);
          
          // Check which formats are active
          setActiveFormats(checkActiveFormats(textContent));
          
          // Show the toolbar
          console.log("Showing toolbar for content editor selection");
          setToolbarVisible(true);
        } else {
          // Handle selection in non-input elements within the content editor
          setSelectedRange({
            start: 0,
            end: textContent.length
          });
          
          setActiveFormats(checkActiveFormats(textContent));
          console.log("Showing toolbar for content editor non-input element");
          setToolbarVisible(true);
        }
      } else {
        setToolbarVisible(false);
      }
    };
    
    // Add debounce to avoid excessive updates
    let timeout: NodeJS.Timeout;
    const debouncedSelectionChange = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleSelectionChange, 100);
    };
    
    document.addEventListener("selectionchange", debouncedSelectionChange);
    
    return () => {
      document.removeEventListener("selectionchange", debouncedSelectionChange);
      clearTimeout(timeout);
    };
  }, [setSelectedText, setSelectedRange, setActiveFormats]);
  
  return { toolbarVisible, setToolbarVisible };
};
