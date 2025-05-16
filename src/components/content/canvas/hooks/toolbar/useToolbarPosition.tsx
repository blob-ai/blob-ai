
import { useState, RefObject, useEffect } from "react";

/**
 * Hook to handle toolbar positioning based on text selection
 */
export const useToolbarPosition = (toolbarRef: RefObject<HTMLDivElement>) => {
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  // Calculate proper toolbar position based on selection
  const calculateToolbarPosition = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Find the editor container
    const editorContainer = document.getElementById('canvas-editor-container') || 
                           document.querySelector('[data-editor="true"]');
    
    if (!editorContainer) return;
    
    const containerRect = editorContainer.getBoundingClientRect();
    
    // Position the toolbar above the selection
    setToolbarPosition({
      top: rect.top - containerRect.top - (toolbarRef.current?.offsetHeight || 0) - 10,
      left: rect.left + (rect.width / 2) - containerRect.left - (toolbarRef.current?.offsetWidth || 0) / 2
    });
  };

  // Update position when selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      calculateToolbarPosition();
    };
    
    document.addEventListener("selectionchange", handleSelectionChange);
    
    // Also calculate on resize since positions may change
    window.addEventListener("resize", handleSelectionChange);
    
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      window.removeEventListener("resize", handleSelectionChange);
    };
  }, []);

  // Ensure toolbar stays within viewport bounds
  const positionToolbar = () => {
    if (!toolbarRef.current) return {};
    
    const toolbar = toolbarRef.current;
    const viewportWidth = window.innerWidth;
    const toolbarWidth = toolbar.offsetWidth;
    let { top, left } = toolbarPosition;
    
    // Keep toolbar within horizontal bounds
    if (left < 20) left = 20;
    if (left + toolbarWidth > viewportWidth - 20) left = viewportWidth - toolbarWidth - 20;
    
    // Keep toolbar from going above the viewport
    if (top < 50) top = 50; // Min top position
    
    // If toolbar would be positioned above the viewport, place it below the selection instead
    if (top < 0) {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorContainer = document.getElementById('canvas-editor-container');
        if (editorContainer) {
          const containerRect = editorContainer.getBoundingClientRect();
          top = rect.bottom - containerRect.top + 10; // 10px below the selection
        }
      }
    }
    
    return { top: `${top}px`, left: `${left}px`, position: 'absolute' };
  };

  return { toolbarPosition, setToolbarPosition, calculateToolbarPosition, positionToolbar };
};
