
import React, { useState } from "react";
import ContentEditorToolbar from "./ContentEditorToolbar";
import ContentEditor from "./ContentEditor";
import ChatAIPanel from "./ChatAIPanel";
import ContentPreview from "./ContentPreview";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ContentCanvasProps {
  initialContent: string;
  onPublish: (content: string) => void;
  onSaveDraft: (content: string) => void;
  onSchedule: (content: string, date?: Date) => void;
}

const ContentCanvas: React.FC<ContentCanvasProps> = ({
  initialContent,
  onPublish,
  onSaveDraft,
  onSchedule,
}) => {
  const [content, setContent] = useState(initialContent);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [showPreview, setShowPreview] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleApplySuggestion = (suggestion: string) => {
    // In a real implementation, this would insert the suggestion at cursor position
    setContent(content + "\n\n" + suggestion);
  };

  // Desktop layout similar to Image #2
  const desktopLayout = (
    <div className="flex h-full">
      {/* Left panel for chat */}
      <div className="w-1/3 border-r border-white/10 flex flex-col">
        <ChatAIPanel onApplySuggestion={handleApplySuggestion} />
      </div>
      
      {/* Right panel for editor */}
      <div className="w-2/3 flex flex-col h-full">
        <ContentEditor
          content={content}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );

  // Mobile layout with tabs
  const mobileLayout = (
    <div className="flex flex-col w-full h-full">
      <div className="flex border-b border-white/10">
        <button
          className={`flex-1 p-3 text-center ${!showPreview ? "text-primary-400 border-b-2 border-primary-400" : "text-white/70"}`}
          onClick={() => setShowPreview(false)}
        >
          Editor
        </button>
        <button
          className={`flex-1 p-3 text-center ${showPreview ? "text-primary-400 border-b-2 border-primary-400" : "text-white/70"}`}
          onClick={() => setShowPreview(true)}
        >
          Preview
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {showPreview ? (
          <ContentPreview
            content={content}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        ) : (
          <div className="flex flex-col h-full">
            <ContentEditor
              content={content}
              onChange={handleContentChange}
            />
            <div className="h-80 border-t border-white/10">
              <ChatAIPanel onApplySuggestion={handleApplySuggestion} />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <ContentEditorToolbar
        onPublish={() => onPublish(content)}
        onSaveDraft={() => onSaveDraft(content)}
        onSchedule={() => onSchedule(content)}
        showPreview={() => setShowPreview(true)}
      />
      
      <div className="flex-1 overflow-hidden">
        {isMobile ? mobileLayout : desktopLayout}
      </div>
    </div>
  );
};

export default ContentCanvas;
