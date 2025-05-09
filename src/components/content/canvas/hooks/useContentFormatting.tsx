
import { toast } from "sonner";
import { useRef, useEffect, useState } from "react";
import { 
  Bold, 
  Italic, 
  Underline,
  List 
} from "lucide-react";
import { applyFormatting, FormattingType, hasFormatting } from "@/lib/formatting";

const useContentFormatting = () => {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [activeFormats, setActiveFormats] = useState<FormattingType[]>([]);
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

  // Check which formatting is active for the current selection
  const checkActiveFormats = (selectedText: string) => {
    const formats: FormattingType[] = [];
    
    if (hasFormatting(selectedText, 'bold')) formats.push('bold');
    if (hasFormatting(selectedText, 'italic')) formats.push('italic');
    if (hasFormatting(selectedText, 'underline')) formats.push('underline');
    if (hasFormatting(selectedText, 'list')) formats.push('list');
    
    setActiveFormats(formats);
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
        
        // Check which formats are active
        checkActiveFormats(textContent);
      } else {
        setToolbarVisible(false);
      }
    };
    
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);
  
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

  // Render the floating toolbar
  const renderFloatingToolbar = () => {
    if (!toolbarVisible) return null;
    
    const formatOptions = [
      { id: 'bold' as FormattingType, icon: <Bold className="h-3.5 w-3.5" />, label: "Bold" },
      { id: 'italic' as FormattingType, icon: <Italic className="h-3.5 w-3.5" />, label: "Italic" },
      { id: 'underline' as FormattingType, icon: <Underline className="h-3.5 w-3.5" />, label: "Underline" },
      { id: 'list' as FormattingType, icon: <List className="h-3.5 w-3.5" />, label: "List" },
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
            className={`p-1.5 rounded transition-colors flex items-center ${
              activeFormats.includes(option.id) ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/70'
            }`}
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
    setToolbarVisible,
    activeFormats,
  };
};

export default useContentFormatting;
