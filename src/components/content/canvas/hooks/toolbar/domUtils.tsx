
/**
 * Helper to check if an element is part of the editor
 */
export const isElementInEditor = (element: Node | null): boolean => {
  if (!element) return false;
  
  // Check if we're in a chat panel or other non-editor area
  let currentNode: Node | null = element;
  while (currentNode) {
    if (currentNode.nodeType === Node.ELEMENT_NODE) {
      const el = currentNode as HTMLElement;
      
      // Explicitly exclude areas where toolbar should not appear
      if (el.classList.contains('no-selection-toolbar') || 
          el.closest('.chat-container') || 
          el.closest('[data-chat-panel]') ||
          el.closest('[data-content-analysis]') || 
          el.closest('.content-analysis-panel') ||
          el.closest('#content-analysis-panel') ||
          el.closest('[data-content-analysis="true"]') ||
          el.closest('.accordion-content') ||
          el.closest('[role="tabpanel"]') ||
          el.closest('[data-accordion-content="true"]')) {
        return false;
      }
    }
    currentNode = currentNode.parentNode;
  }
  
  // Now check if we're specifically in the editor
  currentNode = element;
  while (currentNode) {
    if (currentNode.nodeType === Node.ELEMENT_NODE) {
      const el = currentNode as HTMLElement;
      
      // Check for the canvas editor container ID or data attribute
      if (el.id === 'canvas-editor-container' || 
          el.getAttribute('data-editor') === 'true' ||
          el.getAttribute('data-content-editor') === 'true' ||
          el.classList.contains('editor-content-area')) {
        return true;
      }
    }
    currentNode = currentNode.parentNode;
  }
  
  return false;
};
