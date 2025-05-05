
import React from "react";
import useContentFormatting from "./hooks/useContentFormatting";

interface CanvasEditorProps {
  content: string;
  setContent: (content: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onTextTransform: (message: string, selection?: string) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  content,
  setContent,
  onKeyDown,
  textareaRef,
  onTextTransform,
}) => {
  const { FloatingToolbar } = useContentFormatting();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleFormat = (format: string) => {
    if (format === "bold") {
      onTextTransform("Make this text bold");
    } else if (format === "italic") {
      onTextTransform("Make this text italic");
    } else if (format === "underline") {
      onTextTransform("Underline this text");
    } else if (format === "list") {
      onTextTransform("Convert this to a list");
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className="w-full min-h-[60vh] p-4 bg-transparent text-white/90 text-lg leading-relaxed outline-none resize-none border-none focus:ring-0"
        value={content}
        onChange={handleContentChange}
        onKeyDown={onKeyDown}
        placeholder="Start writing your content here..."
      />
      
      <FloatingToolbar 
        onFormat={handleFormat}
        content={content}
        setContent={setContent}
        textareaRef={textareaRef}
      />
    </div>
  );
};

export default CanvasEditor;
