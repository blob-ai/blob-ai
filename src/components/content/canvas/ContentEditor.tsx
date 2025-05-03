
import React, { useState, useRef, useEffect } from "react";
import ContentEditingToolbar from "./ContentEditingToolbar";

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, onChange }) => {
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionPosition, setSelectionPosition] = useState<{ top: number; left: number } | null>(null);
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      if (editorRef.current) {
        const editorRect = editorRef.current.getBoundingClientRect();
        setSelectionPosition({
          top: rect.top - editorRect.top - 40, // Position above the selection
          left: rect.left - editorRect.left + (rect.width / 2),
        });
      }
      
      setSelectedText(selection.toString());
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  // Handle editing toolbar option selection
  const handleToolbarSelect = (option: string) => {
    // In a real implementation, this would call the AI to transform the text
    let updatedText = content;
    
    switch (option) {
      case "rewrite":
        // Mock implementation - in a real app, this would call the AI
        updatedText = content.replace(selectedText, `[Rewritten: ${selectedText}]`);
        break;
      case "shorter":
        updatedText = content.replace(selectedText, `[Shorter: ${selectedText.substring(0, selectedText.length / 2)}...]`);
        break;
      case "longer":
        updatedText = content.replace(selectedText, `[Longer: ${selectedText} with additional details...]`);
        break;
      case "fix":
        updatedText = content.replace(selectedText, `[Fixed: ${selectedText}]`);
        break;
    }
    
    onChange(updatedText);
    setShowToolbar(false);
  };

  return (
    <div className="relative h-full">
      {showToolbar && selectionPosition && (
        <ContentEditingToolbar
          onSelect={handleToolbarSelect}
          style={{
            top: `${selectionPosition.top}px`,
            left: `${selectionPosition.left}px`,
            transform: 'translateX(-50%)'
          }}
        />
      )}
      <div 
        className="h-full overflow-y-auto p-6 prose prose-invert max-w-none"
        ref={editorRef}
      >
        <div
          className="min-h-[calc(100%-2rem)] outline-none"
          contentEditable
          suppressContentEditableWarning
          onMouseUp={handleTextSelection}
          onKeyUp={handleTextSelection}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default ContentEditor;
