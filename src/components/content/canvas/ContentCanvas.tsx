
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Image, 
  Bold, 
  Italic, 
  List, 
  Underline,
  AlignLeft,
  Eye,
  MoreHorizontal,
  History,
  Save,
} from "lucide-react";
import ContentEditingToolbar from "./ContentEditingToolbar";
import ContentChatPanel from "./ContentChatPanel";
import { toast } from "sonner";

interface ContentCanvasProps {
  initialContent?: string;
  onPublish: (content: string) => void;
  onSaveDraft: (content: string) => void;
  onSchedule: (content: string, date: Date) => void;
}

const ContentCanvas: React.FC<ContentCanvasProps> = ({
  initialContent = "",
  onPublish,
  onSaveDraft,
  onSchedule,
}) => {
  const [content, setContent] = useState(initialContent);
  const [selection, setSelection] = useState<{ start: number; end: number; text: string } | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mobileView, setMobileView] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (content !== initialContent) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds if there are changes
    
    return () => clearTimeout(saveTimer);
  }, [content, initialContent]);

  const handleAutoSave = () => {
    setIsSaving(true);
    // Simulate saving to backend
    setTimeout(() => {
      onSaveDraft(content);
      setIsSaving(false);
      setLastSaved(new Date());
    }, 500);
  };

  const handleTextSelect = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      if (start !== end) {
        const selectedText = content.substring(start, end);
        setSelection({ start, end, text: selectedText });
        setShowToolbar(true);
        
        // Calculate toolbar position based on selection
        const textarea = textareaRef.current;
        const selectionRect = getSelectionCoordinates(textarea, start, end);
        
        setToolbarPosition({
          top: selectionRect.top - 50,
          left: selectionRect.left + (selectionRect.width / 2) - 100, // Center toolbar
        });
      } else {
        setShowToolbar(false);
        setSelection(null);
      }
    }
  };

  // Improved function to get coordinates of selection
  const getSelectionCoordinates = (
    textarea: HTMLTextAreaElement,
    start: number,
    end: number
  ) => {
    // For accurate positioning, we would use Range and getBoundingClientRect in a real implementation
    // This is a simplified version for demonstration
    const textareaRect = textarea.getBoundingClientRect();
    
    // Approximate the position based on line height and character position
    const textBeforeSelection = content.substring(0, start);
    const lineBreaks = textBeforeSelection.split('\n').length - 1;
    const lineHeight = 24; // Approximate line height in pixels
    
    return {
      top: textareaRect.top + lineBreaks * lineHeight,
      left: textareaRect.left + 10, // Approximate horizontal position
      width: textareaRect.width - 20,
      height: lineHeight,
    };
  };

  const handleTextOperation = (operation: string) => {
    if (!selection) return;
    
    const selectedText = content.substring(selection.start, selection.end);
    let newText = "";
    
    switch (operation) {
      case "rewrite":
        // In a real implementation, this would call an AI service
        newText = `${selectedText} (rewritten)`;
        toast.info("AI rewrite requested. This would call an AI service in production.");
        break;
      case "shorter":
        newText = `${selectedText.split(" ").slice(0, Math.max(1, Math.floor(selectedText.split(" ").length / 2))).join(" ")}`;
        break;
      case "longer":
        newText = `${selectedText} with additional expanded details`;
        toast.info("AI expansion requested. This would call an AI service in production.");
        break;
      case "fix":
        // In a real implementation, this would call a grammar checking service
        newText = selectedText;
        toast.info("Grammar fix requested. This would call an AI service in production.");
        break;
      default:
        newText = selectedText;
    }
    
    const newContent = 
      content.substring(0, selection.start) + 
      newText + 
      content.substring(selection.end);
    
    setContent(newContent);
    setShowToolbar(false);
  };

  const handleFormatting = (format: string) => {
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

  const toggleChatPanel = () => {
    setShowChatPanel(!showChatPanel);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleFormatting('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormatting('italic');
          break;
        case 'u':
          e.preventDefault();
          handleFormatting('underline');
          break;
        case 's':
          e.preventDefault();
          handleAutoSave();
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <ContentEditingToolbar
            onSelect={() => {}}
            onFormat={handleFormatting}
            isFloating={false}
          />
          
          <div className="h-5 border-r border-white/10"></div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/5"
            onClick={() => {
              /* Image upload logic */
              toast.info("Image upload feature coming soon");
            }}
          >
            <Image className="h-4 w-4 mr-1" />
            <span className="text-sm">Add Image</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/5"
            onClick={() => setMobileView(!mobileView)}
          >
            <Eye className="h-4 w-4 mr-1" />
            <span className="text-sm">Preview</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/5"
            onClick={toggleChatPanel}
          >
            {showChatPanel ? (
              <>
                <span className="text-sm">Hide AI</span>
              </>
            ) : (
              <>
                <span className="text-sm">Show AI</span>
              </>
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-xs text-white/50 mr-2">
            {isSaving ? (
              <span>Saving...</span>
            ) : lastSaved ? (
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            ) : null}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/10 hover:bg-white/5"
            onClick={handleAutoSave}
          >
            <Save className="h-4 w-4 mr-1" />
            <span className="text-sm">Save Draft</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/10 hover:bg-white/5"
            onClick={() => {
              // Show schedule dialog
              const date = new Date();
              date.setDate(date.getDate() + 1);
              onSchedule(content, date);
            }}
          >
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm">Schedule</span>
          </Button>
          
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-500"
            onClick={() => onPublish(content)}
          >
            Publish
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {showChatPanel && (
          <ContentChatPanel 
            onSendMessage={(message) => {
              console.log("Message sent:", message);
              toast.info(`AI request: "${message}". This would call an AI service in production.`);
            }}
          />
        )}
        
        <div className="flex-1 p-6 bg-[#0F1117] overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {!mobileView ? (
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onSelect={handleTextSelect}
                  onKeyDown={handleKeyDown}
                  className="min-h-[calc(100vh-200px)] bg-transparent resize-none text-white border-none p-0 text-lg leading-relaxed focus-visible:ring-0 focus-visible:outline-none"
                  placeholder="Start writing your content here..."
                />
                
                {showToolbar && selection && (
                  <ContentEditingToolbar
                    onSelect={handleTextOperation}
                    onFormat={() => {}}
                    style={{
                      position: 'absolute',
                      top: toolbarPosition.top,
                      left: toolbarPosition.left,
                    }}
                    isFloating={true}
                  />
                )}
              </div>
            ) : (
              <div className="border border-white/10 rounded-xl p-4 bg-black">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-700 mr-3"></div>
                  <div>
                    <div className="font-medium">Your Name</div>
                    <div className="text-xs text-white/60">Your Credentials</div>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  {content.split("\n").map((paragraph, i) => {
                    // Handle markdown formatting
                    let formattedText = paragraph;
                    
                    // Bold text (between ** **)
                    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    
                    // Italic text (between * *)
                    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
                    
                    // Underline (between _ _)
                    formattedText = formattedText.replace(/_(.*?)_/g, '<u>$1</u>');
                    
                    // Bullet points
                    if (formattedText.startsWith('• ')) {
                      formattedText = formattedText.replace('• ', '');
                      return <li key={i} dangerouslySetInnerHTML={{ __html: formattedText }} />;
                    }
                    
                    return <p key={i} dangerouslySetInnerHTML={{ __html: formattedText }} />;
                  })}
                  
                  {content.length > 280 && (
                    <div className="text-blue-400 font-medium mt-2">...see more</div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <button className="text-white/70">
                      <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 17.27L16.18 21l-1.64-7.03L20 9.24l-7.19-.61L10 2 7.19 8.63 0 9.24l5.46 4.73L3.82 21 10 17.27z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button className="text-white/70">
                      <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 18.5 2 13h2c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8v3L8 4l4-4v3zm-2 5h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button className="text-white/70">
                      <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm1 15H9v-2h2v2zm0-4H9V4h2v7z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="text-white/60 text-sm">0 Comments</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCanvas;
