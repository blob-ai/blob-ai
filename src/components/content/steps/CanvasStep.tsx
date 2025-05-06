
import React, { useState } from "react";
import ContentCanvas from "@/components/content/canvas/ContentCanvas";

interface CanvasStepProps {
  initialContent: string;
  onPublish: (content: string) => void;
  onSaveDraft: (content: string) => void;
  onSchedule: (content: string, date: Date) => void;
}

const CanvasStep: React.FC<CanvasStepProps> = ({
  initialContent,
  onPublish,
  onSaveDraft,
  onSchedule,
}) => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="w-full bg-black border border-white/10 rounded-xl shadow-lg overflow-hidden">
      <ContentCanvas
        initialContent={initialContent}
        onContentChange={setContent}
        onPublish={() => onPublish(content)}
        onSaveDraft={() => onSaveDraft(content)}
        onSchedule={(date: Date) => onSchedule(content, date)}
        buttonColor="#3260ea" // Updated to match sidebar button blue
      />
    </div>
  );
};

export default CanvasStep;
