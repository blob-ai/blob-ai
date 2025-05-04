
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import CanvasToolbar from "./CanvasToolbar";
import CanvasEditor from "./CanvasEditor";
import CanvasPreview from "./CanvasPreview";
import ContentChatPanel from "./ContentChatPanel";
import useContentFormatting from "./hooks/useContentFormatting";

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
  const [mobileView, setMobileView] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { handleFormatting } = useContentFormatting();

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

  const toggleChatPanel = () => {
    setShowChatPanel(!showChatPanel);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleFormatting('bold', content, setContent, textareaRef);
          break;
        case 'i':
          e.preventDefault();
          handleFormatting('italic', content, setContent, textareaRef);
          break;
        case 'u':
          e.preventDefault();
          handleFormatting('underline', content, setContent, textareaRef);
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

  const onFormatting = (format: string) => {
    handleFormatting(format, content, setContent, textareaRef);
  };

  return (
    <div className="flex flex-col h-full">
      <CanvasToolbar
        onToggleMobileView={() => setMobileView(!mobileView)}
        onToggleChatPanel={toggleChatPanel}
        showChatPanel={showChatPanel}
        handleAutoSave={handleAutoSave}
        isSaving={isSaving}
        lastSaved={lastSaved}
        onSchedule={onSchedule}
        onPublish={onPublish}
        content={content}
      />

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
              <CanvasEditor 
                content={content}
                setContent={setContent}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <CanvasPreview content={content} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCanvas;
