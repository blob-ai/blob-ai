
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
      
      // Hide toolbar if no selection or empty selection
      if (!selection || selection.isCollapsed || !selection.rangeCount) {
        setToolbarVisible(false);
        return;
      }
      
      // Get the node where the selection is happening
      const range = selection.getRangeAt(0);
      const node = range.commonAncestorContainer;
      
      // Only proceed if selection is in the editor
      if (!isElementInEditor(node)) {
        console.log("Selection not in editor area:", node);
        setToolbarVisible(false);
        return;
      }
      
      const textContent = range.toString();
      
      if (textContent && textContent.trim().length > 0) {
        console.log("Selected text:", textContent);
        setSelectedText(textContent);
        
        // Find the textarea to store selection range (try multiple element types)
        const editor = document.querySelector('[data-content-editor="true"]') as HTMLTextAreaElement 
                      || document.querySelector('textarea') as HTMLTextAreaElement
                      || document.querySelector('input[type="text"]') as HTMLInputElement;
                      
        if (editor) {
          const selectedRange = {
            start: editor.selectionStart || 0,
            end: editor.selectionEnd || 0
          };
          
          setSelectedRange(selectedRange);
          
          // Check which formats are active
          setActiveFormats(checkActiveFormats(textContent));
          
          // Show the toolbar
          console.log("Showing toolbar");
          setToolbarVisible(true);
        } else {
          // Handle selection in non-input elements (like contentEditable)
          setSelectedRange({
            start: 0,
            end: textContent.length
          });
          
          setActiveFormats(checkActiveFormats(textContent));
          console.log("Showing toolbar for non-input element");
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
