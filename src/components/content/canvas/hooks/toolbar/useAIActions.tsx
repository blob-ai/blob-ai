
import { toast } from "sonner";

// Define AI action types
export type AIActionType = "improve" | "tone" | "rewrite" | "comment";

/**
 * Hook to handle AI actions triggered from the toolbar
 */
export const useAIActions = (
  selectedText: string,
  selectedRange: { start: number; end: number } | null,
  setToolbarVisible: (visible: boolean) => void
) => {
  // Handle AI actions (improve, tone, rewrite, comment)
  const handleAIAction = (action: AIActionType) => {
    if (!selectedText || selectedText.trim().length === 0) {
      toast.info(`Select text first to ${action} it`);
      return;
    }

    // Dispatch a custom event for AI actions
    if (typeof window !== 'undefined' && selectedRange) {
      const event = new CustomEvent('applyAIAction', { 
        detail: { 
          action,
          text: selectedText,
          range: selectedRange,
          context: 'content-editor' // Identify this as coming from the content editor
        } 
      });
      document.dispatchEvent(event);
    }

    // Hide the toolbar after action is triggered
    setToolbarVisible(false);
  };

  return { handleAIAction };
};
