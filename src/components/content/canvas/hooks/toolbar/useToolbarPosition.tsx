
import { useState, RefObject, useEffect } from "react";

/**
 * Hook to handle toolbar positioning based on text selection in Canvas Editor
 */
export const useToolbarPosition = (toolbarRef: RefObject<HTMLDivElement>) => {
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  // Calculate proper toolbar position based on selection
  const calculateToolbarPosition = () => {
    const selection = window.getSelection();
    const canvasTextarea = document.querySelector('[data-content-editor="true"]') as HTMLTextAreaElement;
    
    if (!selection || selection.isCollapsed || !selection.rangeCount || !canvasTextarea) {
      return;
    }
    
    let rect: DOMRect | null = null;
    
    // Try to get selection rectangle
    try {
      const range = selection.getRangeAt(0);
      rect = range.getBoundingClientRect();
    } catch (e) {
      // Fallback for textarea selections
      if (canvasTextarea === document.activeElement) {
        rect = canvasTextarea.getBoundingClientRect();
      }
    }
    
    if (!rect || (rect.width === 0 && rect.height === 0)) {
      return;
    }
    
    // Find the Canvas Editor container
    const editorContainer = document.getElementById('canvas-editor-container') || 
                           document.querySelector('[data-canvas-editor="true"]') ||
                           canvasTextarea.closest('[class*="canvas"]') ||
                           canvasTextarea.parentElement;
    
    if (!editorContainer) {
      console.warn("Canvas Editor container not found");
      return;
    }
    
    const containerRect = editorContainer.getBoundingClientRect();
    const toolbarHeight = toolbarRef.current?.offsetHeight || 40;
    const toolbarWidth = toolbarRef.current?.offsetWidth || 200;
    
    // Calculate position relative to the container
    let top = rect.top - containerRect.top - toolbarHeight - 10;
    let left = rect.left + (rect.width / 2) - containerRect.left - (toolbarWidth / 2);
    
    // Ensure toolbar stays within container bounds
    const maxLeft = containerRect.width - toolbarWidth - 10;
    const minLeft = 10;
    
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;
    
    // If toolbar would appear above the container, position it below the selection
    if (top < 10) {
      top = rect.bottom - containerRect.top + 10;
    }
    
    setToolbarPosition({ top, left });

    console.log("Toolbar positioned at:", { top, left });
  };

  // Update position when selection changes
  useEffect(() => {
    const handlePositionUpdate = () => {
      requestAnimationFrame(calculateToolbarPosition);
    };
    
    document.addEventListener("selectionchange", handlePositionUpdate);
    window.addEventListener("resize", handlePositionUpdate);
    window.addEventListener("scroll", handlePositionUpdate);
    
    return () => {
      document.removeEventListener("selectionchange", handlePositionUpdate);
      window.removeEventListener("resize", handlePositionUpdate);
      window.removeEventListener("scroll", handlePositionUpdate);
    };
  }, []);

  // Return positioning styles for the toolbar
  const positionToolbar = () => {
    if (!toolbarRef.current) return {};
    
    return { 
      top: `${toolbarPosition.top}px`, 
      left: `${toolbarPosition.left}px`, 
      position: 'absolute' as const,
      zIndex: 9999
    };
  };

  return { toolbarPosition, setToolbarPosition, calculateToolbarPosition, positionToolbar };
};
