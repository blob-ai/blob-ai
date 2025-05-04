
import { toast } from "sonner";

const useContentFormatting = () => {
  const handleFormatting = (
    format: string,
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
    
    let formattedText = "";
    
    switch(format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "underline":
        formattedText = `_${selectedText}_`;
        break;
      case "list":
        formattedText = selectedText.split("\n").map(line => `• ${line}`).join("\n");
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = 
      content.substring(0, start) + 
      formattedText + 
      content.substring(end);
    
    setContent(newContent);
    
    // Restore focus to the textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };

  return { handleFormatting };
};

export default useContentFormatting;
