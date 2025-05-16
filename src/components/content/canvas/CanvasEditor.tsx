
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
      const { format, context } = e.detail;
      // Only handle events specifically for the content editor
      if (format && context === 'content-editor' && textareaRef.current) {
        handleFormatting(format as FormattingType, content, setContent, textareaRef);
      }
    };
    
    const handleAIActionEvent = (e: CustomEvent) => {
      const { action, text, range, context } = e.detail;
      // Only handle events specifically for the content editor
      if (action && text && context === 'content-editor') {
        onTextTransform(action, text);
      }
    };
    
    document.addEventListener('applyFormatting', handleCustomFormatEvent as EventListener);
    document.addEventListener('applyAIAction', handleAIActionEvent as EventListener);
    
    return () => {
      document.removeEventListener('applyFormatting', handleCustomFormatEvent as EventListener);
      document.removeEventListener('applyAIAction', handleAIActionEvent as EventListener);
    };
  }, [content, handleFormatting, setContent, textareaRef, onTextTransform]);

  // For textarea styling to help show markdown formatting
  const getTextareaClassName = () => {
    return `min-h-[calc(100vh-300px)] bg-transparent resize-none text-white border-none p-0 text-lg leading-relaxed focus-visible:ring-0 focus-visible:outline-none markdown-textarea selection:bg-opacity-15 selection:bg-[var(--accent-blue)] selection:text-white content-editor`;
  };

  return (
    <div 
      className="relative flex flex-col h-full" 
      id="canvas-editor-container" 
      data-canvas-editor="true"
      data-editor="true"
    >
      <div className="flex items-center mb-4">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/placeholder.svg" alt="Your content" />
          <AvatarFallback className="bg-[var(--accent-blue)]">
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
        data-editor="true"
        data-content-editor="true"
      />
      
      {/* Content Analysis Panel - added below the editor */}
      <ContentAnalysisPanel contentAnalysis={contentAnalysis} className="mt-4" />
      
      {/* Enhanced floating toolbar that appears near text selection */}
      {renderFloatingToolbar()}
      
      {/* Legacy toolbar - can be removed once floating toolbar is fully functional */}
      {selection && (
        <ContentEditingToolbar
          onSelect={handleTextOperation}
          onFormat={applyFormat}
          style={{
            position: 'absolute',
            display: 'none', // Hide the legacy toolbar since we now use the floating toolbar
          }}
          isFloating={true}
        />
      )}
    </div>
  );
};

export default CanvasEditor;
