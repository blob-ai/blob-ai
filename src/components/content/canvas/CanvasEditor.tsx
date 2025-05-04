
import React, { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import ContentEditingToolbar from "./ContentEditingToolbar";

interface CanvasEditorProps {
  content: string;
  setContent: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  content,
  setContent,
  onKeyDown,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selection, setSelection] = useState<{ start: number; end: number; text: string } | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

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
        break;
      case "shorter":
        newText = `${selectedText.split(" ").slice(0, Math.max(1, Math.floor(selectedText.split(" ").length / 2))).join(" ")}`;
        break;
      case "longer":
        newText = `${selectedText} with additional expanded details`;
        break;
      case "fix":
        // In a real implementation, this would call a grammar checking service
        newText = selectedText;
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

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onSelect={handleTextSelect}
        onKeyDown={onKeyDown}
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
  );
};

export default CanvasEditor;
