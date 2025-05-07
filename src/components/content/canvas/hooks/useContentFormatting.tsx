import { toast } from "sonner";
import { useRef, useEffect, useState } from "react";
import { 
  Bold, 
  Italic, 
  Underline,
  List 
} from "lucide-react";

const useContentFormatting = () => {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Calculate proper toolbar position based on selection
  const calculateToolbarPosition = (
    selection: Selection | null, 
    container: HTMLTextAreaElement
  ) => {
    if (!selection || selection.isCollapsed) return { top: 0, left: 0 };
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Position the toolbar above the selection
    return {
      top: rect.top - containerRect.top - (toolbarRef.current?.offsetHeight || 0) - 10,
      left: rect.left + (rect.width / 2) - containerRect.left - (toolbarRef.current?.offsetWidth || 0) / 2
    };
  };

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
    if (top < 50) top = 50;
    
    return { top: `${top}px`, left: `${left}px` };
  };

  // Monitor selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setToolbarVisible(false);
        return;
      }
      
      // Only show toolbar if the selection is within our editor
      const editorElement = document.querySelector('textarea');
      if (!editorElement) return;
      
      const range = selection.getRangeAt(0);
      const textContent = range.toString();
      
      if (textContent && textContent.trim().length > 0) {
        setToolbarVisible(true);
        setToolbarPosition(calculateToolbarPosition(selection, editorElement));
        
        // Store the selection range for applying formatting
        const textarea = editorElement as HTMLTextAreaElement;
        setSelectedRange({
          start: textarea.selectionStart,
          end: textarea.selectionEnd
        });
      } else {
        setToolbarVisible(false);
      }
    };
    
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);
  
  // Basic formatting operations
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

  // Render the floating toolbar
  const renderFloatingToolbar = () => {
    if (!toolbarVisible) return null;
    
    const formatOptions = [
      { id: "bold", icon: <Bold className="h-3.5 w-3.5" />, label: "Bold" },
      { id: "italic", icon: <Italic className="h-3.5 w-3.5" />, label: "Italic" },
      { id: "underline", icon: <Underline className="h-3.5 w-3.5" />, label: "Underline" },
      { id: "list", icon: <List className="h-3.5 w-3.5" />, label: "List" },
    ];
    
    return (
      <div
        ref={toolbarRef}
        className="absolute z-50 bg-[#16181c] border border-white/20 rounded-lg shadow-lg px-2 py-1 flex items-center gap-1 animate-fade-in"
        style={positionToolbar()}
      >
        {formatOptions.map((option) => (
          <button
            key={option.id}
            className="p-1.5 rounded hover:bg-white/10 transition-colors flex items-center"
            title={option.label}
            onClick={() => {
              // This will be connected to the formatting handler in CanvasEditor
              if (typeof window !== 'undefined') {
                // Create and dispatch a custom event
                const event = new CustomEvent('applyFormatting', { 
                  detail: { format: option.id } 
                });
                document.dispatchEvent(event);
              }
            }}
          >
            {option.icon}
          </button>
        ))}
      </div>
    );
  };

  return { 
    handleFormatting,
    renderFloatingToolbar,
    toolbarVisible,
    setToolbarVisible
  };
};

export default useContentFormatting;
