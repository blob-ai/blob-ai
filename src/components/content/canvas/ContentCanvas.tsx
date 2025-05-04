
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import CanvasToolbar from "./CanvasToolbar";
import CanvasEditor from "./CanvasEditor";
import CanvasPreview from "./CanvasPreview";
import ContentChatPanel from "./ContentChatPanel";
import useContentFormatting from "./hooks/useContentFormatting";
import ResizablePanelsWrapper from "./ResizablePanelsWrapper";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

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

  const handleSendToAI = async (message: string, selectedText?: string) => {
    console.log("Sending content to AI:", message);
    
    // Prepare the full prompt with selected content if available
    const fullPrompt = selectedText 
      ? `${message}\n\nSelected content:\n${selectedText}`
      : message;
    
    toast.info(`AI processing request: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    
    // Simulate AI processing with a timeout
    toast.loading("AI is processing your content...", { id: "ai-processing" });
    
    try {
      // Simulate an AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Handle text transformation based on the message
      if (selectedText && textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        let transformedText = selectedText;
        
        if (message.toLowerCase().includes("rewrite")) {
          transformedText = `${selectedText} (rewritten with more engaging language)`;
        } else if (message.toLowerCase().includes("shorter")) {
          transformedText = selectedText.split(" ")
            .slice(0, Math.ceil(selectedText.split(" ").length / 2))
            .join(" ");
        } else if (message.toLowerCase().includes("longer")) {
          transformedText = `${selectedText} with additional context and supporting details to expand on the key points`;
        } else if (message.toLowerCase().includes("grammar") || message.toLowerCase().includes("fix")) {
          transformedText = selectedText.replace(/\b(i)\b/g, "I").replace(/\s+([.,;:!?])/g, "$1");
        }
        
        const newContent = 
          content.substring(0, start) + 
          transformedText + 
          content.substring(end);
        
        setContent(newContent);
        toast.success("Text transformed successfully!", { id: "ai-processing" });
      } else {
        toast.success("AI processing complete!", { id: "ai-processing" });
      }
    } catch (error) {
      toast.error("Failed to process your request. Please try again.", { id: "ai-processing" });
    }
  };

  // Helper function to get selected text or paragraph
  const getSelectedContentForAI = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      if (start === end) {
        // No selection, get paragraph
        const textBefore = content.substring(0, start);
        const textAfter = content.substring(start);
        
        const paragraphStart = textBefore.lastIndexOf('\n\n') + 2;
        const paragraphEnd = textAfter.indexOf('\n\n');
        
        return content.substring(
          paragraphStart, 
          paragraphEnd > -1 ? start + paragraphEnd : content.length
        );
      } else {
        // Return selected text
        return content.substring(start, end);
      }
    }
    return "";
  };

  const canvasContent = (
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
        onFormat={onFormatting}
      />

      <div className="flex-1 p-6 bg-[#0F1117] overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {!mobileView ? (
            <CanvasEditor 
              content={content}
              setContent={setContent}
              onKeyDown={handleKeyDown}
              textareaRef={textareaRef}
              onTextTransform={handleSendToAI}
            />
          ) : (
            <CanvasPreview content={content} />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ResizablePanelsWrapper
      leftPanel={
        <ContentChatPanel 
          onSendMessage={(message) => {
            // Determine if this is a selection-based message or direct message
            if (message.startsWith("Improve") || message.startsWith("Edit") || message.startsWith("Fix")) {
              const selectedContent = getSelectedContentForAI();
              if (selectedContent) {
                handleSendToAI(message, selectedContent);
                return;
              }
            }
            handleSendToAI(message);
          }}
        />
      }
      rightPanel={canvasContent}
      initialLeftSize={25}
      initialRightSize={75}
      collapsible={true}
    />
  );
};

export default ContentCanvas;
