
import React, { useState } from "react";
import ContentCanvas from "@/components/content/canvas/ContentCanvas";

interface CanvasStepProps {
  initialContent: string;
  onPublish: (content: string) => void;
  onSaveDraft: (content: string) => void;
  onSchedule: (content: string, date: Date) => void;
  contentGoal?: string;
  selectedIdea?: {
    title: string;
    category: string;
  } | null;
  selectedStyle?: {
    id: string;
    name: string;
    source: "user" | "creator";
    tone: string[];
  } | null;
}

const CanvasStep: React.FC<CanvasStepProps> = ({
  initialContent,
  onPublish,
  onSaveDraft,
  onSchedule,
  contentGoal,
  selectedIdea,
  selectedStyle,
}) => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="w-full bg-black border border-white/10 rounded-xl shadow-lg overflow-hidden">
      <ContentCanvas
        initialContent={initialContent}
        onContentChange={setContent}
        onPublish={() => onPublish(content)}
        onSaveDraft={() => onSaveDraft(content)}
        onSchedule={(date) => onSchedule(content, date)}
        buttonColor="#3260ea" // Updated to match sidebar button blue
        contentGoal={contentGoal}
        selectedIdea={selectedIdea}
        selectedStyle={selectedStyle}
      />
    </div>
  );
};

export default CanvasStep;
