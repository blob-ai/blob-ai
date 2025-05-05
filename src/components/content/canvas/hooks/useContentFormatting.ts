import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";

interface SelectionCoordinates {
  x: number;
  y: number;
  height: number;
}

const useContentFormatting = () => {
  const [selectionCoords, setSelectionCoords] = useState<SelectionCoordinates | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  
  // Calculate selection coordinates for floating toolbar positioning
  const calculateSelectionCoordinates = (): SelectionCoordinates | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Only proceed if we have a valid selection
    if (rect.width === 0) return null;
    
    return {
      x: rect.left + rect.width / 2, // Center of the selection
      y: rect.top - 10, // Slightly above the selection
      height: rect.height
    };
  };
  
  // Track selection position
  useEffect(() => {
    const handleSelectionChange = () => {
      const coords = calculateSelectionCoordinates();
      setSelectionCoords(coords);
    };
    
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);
  
  // Handle formatting with floating toolbar
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

  // Create a floating toolbar for selected text
  const FloatingToolbar = ({
    onFormat,
    content,
    setContent,
    textareaRef
  }: {
    onFormat: (format: string) => void;
    content: string;
    setContent: (content: string) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
  }) => {
    if (!selectionCoords) return null;
    
    // Ensure toolbar stays within viewport
    const positionToolbar = () => {
      if (!toolbarRef.current || !selectionCoords) return {};
      
      const toolbar = toolbarRef.current;
      const toolbarRect = toolbar.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Center the toolbar above the selection
      let left = selectionCoords.x - toolbarRect.width / 2;
      let top = selectionCoords.y - toolbarRect.height - 10;
      
      // Keep toolbar within viewport bounds
      if (left < 10) left = 10;
      if (left + toolbarRect.width > viewportWidth - 10)
        left = viewportWidth - toolbarRect.width - 10;
      
      // If toolbar would go off the top, position it below the selection
      if (top < 10) {
        top = selectionCoords.y + selectionCoords.height + 10;
      }
      
      return {
        left: `${left}px`,
        top: `${top}px`
      };
    };
    
    return (
      <div
        ref={toolbarRef}
        className="absolute z-50 bg-[#16181c] border border-white/20 rounded-lg shadow-lg px-2 py-1 flex items-center gap-1 animate-fade-in"
        style={positionToolbar()}
      >
        <button
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          onClick={() => onFormat("bold")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>
        
        <button
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          onClick={() => onFormat("italic")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 4h-9M14 20H5M14.7 4 9.2 20"></path>
          </svg>
        </button>
        
        <button
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          onClick={() => onFormat("underline")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
            <path d="M4 20h16"></path>
          </svg>
        </button>
        
        <button
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          onClick={() => onFormat("list")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
      </div>
    );
  };

  return { 
    handleFormatting,
    FloatingToolbar,
    selectionCoords
  };
};

export default useContentFormatting;
