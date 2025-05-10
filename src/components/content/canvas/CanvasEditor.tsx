
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import ContentEditingToolbar from "./ContentEditingToolbar";
import useContentFormatting from "./hooks/useContentFormatting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { FormattingType } from "@/lib/formatting";
import ContentAnalysisPanel, { ContentAnalysis } from "./ContentAnalysisPanel";

interface CanvasEditorProps {
  content: string;
  setContent: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onTextTransform: (operation: string, selectedText: string) => void;
  contentAnalysis: ContentAnalysis | null;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  content,
  setContent,
  onKeyDown,
  textareaRef,
  onTextTransform,
  contentAnalysis
}) => {
  const [selection, setSelection] = useState<{ start: number; end: number; text: string } | null>(null);
  const { handleFormatting, renderFloatingToolbar } = useContentFormatting();

  const handleTextSelect = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      if (start !== end) {
        const selectedText = content.substring(start, end);
        setSelection({ start, end, text: selectedText });
      } else {
        setSelection(null);
      }
    }
  };

  const handleTextOperation = (operation: string) => {
    if (!selection) return;
    onTextTransform(operation, selection.text);
  };

  // Apply formatting from the toolbar
  const applyFormat = (format: string) => {
    handleFormatting(format as FormattingType, content, setContent, textareaRef);
  };

  // Listen for custom formatting event from the floating toolbar
  useEffect(() => {
    const handleCustomFormatEvent = (e: CustomEvent) => {
      const { format } = e.detail;
      if (format && textareaRef.current) {
        handleFormatting(format as FormattingType, content, setContent, textareaRef);
      }
    };
    
    document.addEventListener('applyFormatting', handleCustomFormatEvent as EventListener);
    
    return () => {
      document.removeEventListener('applyFormatting', handleCustomFormatEvent as EventListener);
    };
  }, [content, handleFormatting, setContent, textareaRef]);

  // For textarea styling to help show markdown formatting
  const getTextareaClassName = () => {
    return `min-h-[calc(100vh-300px)] bg-transparent resize-none text-white border-none p-0 text-lg leading-relaxed focus-visible:ring-0 focus-visible:outline-none markdown-textarea`;
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex items-center mb-4">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/placeholder.svg" alt="Your content" />
          <AvatarFallback className="bg-blue-600">
            <UserRound className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="text-sm text-white/70">Your post</div>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onSelect={handleTextSelect}
        onKeyDown={onKeyDown}
        className={getTextareaClassName()}
        placeholder="Start writing your content here..."
        spellCheck={true}
      />
      
      {/* Content Analysis Panel - added below the editor */}
      <ContentAnalysisPanel contentAnalysis={contentAnalysis} className="mt-4" />
      
      {/* Modern floating toolbar that appears near text selection */}
      {renderFloatingToolbar()}
      
      {/* Legacy toolbar - can be removed once floating toolbar is fully functional */}
      {selection && (
        <ContentEditingToolbar
          onSelect={handleTextOperation}
          onFormat={applyFormat}
          style={{
            position: 'absolute',
            display: 'none', // Hide the legacy toolbar
          }}
          isFloating={true}
        />
      )}
    </div>
  );
};

export default CanvasEditor;
