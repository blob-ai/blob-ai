
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import ContentEditingToolbar from "./ContentEditingToolbar";
import useContentFormatting from "./hooks/useContentFormatting";
import { User } from "lucide-react";

interface CanvasEditorProps {
  content: string;
  setContent: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onTextTransform: (operation: string, selectedText: string) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  content,
  setContent,
  onKeyDown,
  textareaRef,
  onTextTransform
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

  // Listen for custom formatting event from the floating toolbar
  useEffect(() => {
    const handleCustomFormatEvent = (e: CustomEvent) => {
      const { format } = e.detail;
      if (format && textareaRef.current) {
        handleFormatting(format, content, setContent, textareaRef);
      }
    };
    
    document.addEventListener('applyFormatting', handleCustomFormatEvent as EventListener);
    
    return () => {
      document.removeEventListener('applyFormatting', handleCustomFormatEvent as EventListener);
    };
  }, [content, handleFormatting, setContent, textareaRef]);

  return (
    <div className="relative">
      {/* User indicator at the top of the editor */}
      <div className="flex items-center gap-2 mb-4 px-2 py-1 bg-white/5 rounded-lg w-fit">
        <User className="h-4 w-4 text-white/70" />
        <span className="text-sm font-medium text-white/80">Your content</span>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onSelect={handleTextSelect}
        onKeyDown={onKeyDown}
        className="min-h-[calc(100vh-240px)] bg-transparent resize-none text-white border-none p-0 text-lg leading-relaxed focus-visible:ring-0 focus-visible:outline-none"
        placeholder="Start writing your content here..."
      />
      
      {/* Modern floating toolbar that appears near text selection */}
      {renderFloatingToolbar()}
      
      {/* Legacy toolbar - can be removed once floating toolbar is fully functional */}
      {selection && (
        <ContentEditingToolbar
          onSelect={handleTextOperation}
          onFormat={() => {}}
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
