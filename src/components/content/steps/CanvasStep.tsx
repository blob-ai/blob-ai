
import React from "react";
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
  return (
    <div className="h-[calc(100vh-64px)] bg-black border border-white/10 rounded-xl shadow-lg overflow-hidden">
      <ContentCanvas
        initialContent={initialContent}
        onPublish={onPublish}
        onSaveDraft={onSaveDraft}
        onSchedule={onSchedule}
      />
    </div>
  );
};

export default CanvasStep;
