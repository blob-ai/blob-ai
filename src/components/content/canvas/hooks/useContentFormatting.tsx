import { toast } from "sonner";
import { useRef, useEffect, useState } from "react";
import { 
  Bold, 
  Italic, 
  Underline,
  List,
  Wand2,
  Palette,
  RefreshCw,
  MessageCircle
} from "lucide-react";
import { applyFormatting, FormattingType, hasFormatting } from "@/lib/formatting";

// Define AI action types
type AIActionType = "improve" | "tone" | "rewrite" | "comment";

const useContentFormatting = () => {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [activeFormats, setActiveFormats] = useState<FormattingType[]>([]);
  const [selectedText, setSelectedText] = useState<string>("");
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
    if (top < 50) top = 50; // Min top position
    
    // If toolbar would be positioned above the viewport, place it below the selection instead
    if (top < 0) {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = document.querySelector('textarea')?.getBoundingClientRect() || { top: 0 };
        top = rect.bottom - containerRect.top + 10; // 10px below the selection
      }
    }
    
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
        setSelectedText(textContent);
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
          range: selectedRange
        } 
      });
      document.dispatchEvent(event);
    }

    // Hide the toolbar after action is triggered
    setToolbarVisible(false);
  };

  // Render the floating toolbar
  const renderFloatingToolbar = () => {
    if (!toolbarVisible) return null;
    
    // Format options - text formatting tools
    const formatOptions = [
      { id: 'bold' as FormattingType, icon: <Bold className="h-3.5 w-3.5" />, label: "Bold" },
      { id: 'italic' as FormattingType, icon: <Italic className="h-3.5 w-3.5" />, label: "Italic" },
      { id: 'underline' as FormattingType, icon: <Underline className="h-3.5 w-3.5" />, label: "Underline" },
      { id: 'list' as FormattingType, icon: <List className="h-3.5 w-3.5" />, label: "List" },
    ];
    
    // AI action options - AI editing tools
    const aiOptions = [
      { id: 'improve' as AIActionType, icon: <Wand2 className="h-3.5 w-3.5" />, label: "Improve" },
      { id: 'tone' as AIActionType, icon: <Palette className="h-3.5 w-3.5" />, label: "Tone" },
      { id: 'rewrite' as AIActionType, icon: <RefreshCw className="h-3.5 w-3.5" />, label: "Rewrite" },
      { id: 'comment' as AIActionType, icon: <MessageCircle className="h-3.5 w-3.5" />, label: "Comment" },
    ];
    
    return (
      <div
        ref={toolbarRef}
        className="selection-toolbar"
        style={positionToolbar()}
      >
        {/* Text formatting options */}
        <div className="flex gap-1">
          {formatOptions.map((option) => (
            <button
              key={option.id}
              className={`p-2 rounded transition-colors flex items-center justify-center ${
                activeFormats.includes(option.id) ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/70'
              }`}
              title={option.label}
              onClick={() => {
                // Dispatch formatting event
                if (typeof window !== 'undefined') {
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
        
        {/* Separator */}
        <div className="w-px h-5 bg-white/20 mx-1"></div>
        
        {/* AI action options */}
        <div className="flex gap-1">
          {aiOptions.map((option) => (
            <button
              key={option.id}
              className="p-2 rounded transition-colors flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white"
              title={option.label}
              onClick={() => handleAIAction(option.id)}
            >
              {option.icon}
              <span className="sr-only">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return { 
    handleFormatting,
    renderFloatingToolbar,
    toolbarVisible,
    setToolbarVisible,
    activeFormats,
    selectedText,
    selectedRange
  };
};

export default useContentFormatting;
