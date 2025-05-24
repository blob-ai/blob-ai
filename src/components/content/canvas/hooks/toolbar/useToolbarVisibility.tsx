
import { useState, useEffect } from "react";
import { FormattingType } from "@/lib/formatting";
import { checkActiveFormats } from "./toolbarUtils";

/**
 * Hook to handle the visibility of the toolbar based on text selection
 */
export const useToolbarVisibility = (
  setSelectedText: (text: string) => void,
  setSelectedRange: (range: { start: number; end: number } | null) => void,
  setActiveFormats: (formats: FormattingType[]) => void
) => {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  
  // Monitor selection changes specifically for the Canvas Editor
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      // Hide toolbar if no selection or empty selection
      if (!selection || selection.isCollapsed || !selection.rangeCount) {
        setToolbarVisible(false);
        setSelectedText("");
        setSelectedRange(null);
        return;
      }
      
      // Get the selected text
      const textContent = selection.toString();
      
      if (!textContent || textContent.trim().length === 0) {
        setToolbarVisible(false);
        setSelectedText("");
        setSelectedRange(null);
        return;
      }
      
      // Check if selection is within the Canvas Editor
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      
      // Find the Canvas Editor textarea
      const canvasTextarea = document.querySelector('[data-content-editor="true"]') as HTMLTextAreaElement;
      
      if (!canvasTextarea) {
        setToolbarVisible(false);
        return;
      }
      
      // Check if the selection is within the Canvas Editor or if it's a textarea selection
      const isInCanvasEditor = canvasTextarea.contains(container) || 
                              container === canvasTextarea || 
                              container.parentElement === canvasTextarea ||
                              (container.nodeType === Node.TEXT_NODE && canvasTextarea.contains(container.parentNode));
      
      // For textarea selections, use the textarea's selection properties
      if (canvasTextarea === document.activeElement && canvasTextarea.selectionStart !== canvasTextarea.selectionEnd) {
        const start = canvasTextarea.selectionStart || 0;
        const end = canvasTextarea.selectionEnd || 0;
        const selectedText = canvasTextarea.value.substring(start, end);
        
        if (selectedText && selectedText.trim().length > 0) {
          console.log("Canvas Editor selection detected:", selectedText);
          setSelectedText(selectedText);
          setSelectedRange({ start, end });
          setActiveFormats(checkActiveFormats(selectedText));
          setToolbarVisible(true);
          return;
        }
      }
      
      // For other selections within the editor container
      if (isInCanvasEditor && textContent.trim().length > 0) {
        console.log("Canvas Editor text selection:", textContent);
        setSelectedText(textContent);
        setSelectedRange({
          start: 0,
          end: textContent.length
        });
        setActiveFormats(checkActiveFormats(textContent));
        setToolbarVisible(true);
        return;
      }
      
      // Hide toolbar if selection is not in Canvas Editor
      setToolbarVisible(false);
      setSelectedText("");
      setSelectedRange(null);
    };
    
    // Handle both selection change and mouse up events
    const handleMouseUp = () => {
      // Small delay to ensure selection is registered
      setTimeout(handleSelectionChange, 10);
    };
    
    // Add event listeners
    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setSelectedText, setSelectedRange, setActiveFormats]);
  
  return { toolbarVisible, setToolbarVisible };
};
