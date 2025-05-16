
import { toast } from "sonner";
import { applyFormatting, FormattingType, hasFormatting } from "@/lib/formatting";

/**
 * Hook to handle text formatting operations
 */
export const useFormattingActions = (
  activeFormats: FormattingType[],
  setActiveFormats: (formats: FormattingType[]) => void
) => {
  // Basic formatting operations
  const handleFormatting = (
    format: FormattingType,
    content: string,
    setContent: (content: string) => void,
    textareaRef: React.RefObject<HTMLTextAreaElement>
  ) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end) {
      // If no text is selected, show toast message
      toast.info(`Select text first to apply ${format} formatting`);
      return;
    }
    
    const selectedText = content.substring(start, end);
    
    // If the format is already applied, remove it
    if (hasFormatting(selectedText, format)) {
      // This would require a more complex implementation to remove formatting
      // For now, just apply it again as a simple implementation
      toast.info(`Format toggle will be implemented in the next version`);
    }
    
    // Apply the formatting
    const newContent = applyFormatting(content, format, start, end);
    setContent(newContent);
    
    // Restore focus to the textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + (format === 'list' ? 
        selectedText.split('\n').join('\n• ').length + 2 : 
        selectedText.length + (format === 'bold' ? 4 : 2)));
    }, 0);
    
    // Update active formats
    if (!activeFormats.includes(format)) {
      setActiveFormats([...activeFormats, format]);
    }
  };

  return { handleFormatting };
};
