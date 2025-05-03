
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Save, Send } from "lucide-react";

interface ContentEditorToolbarProps {
  onPublish: () => void;
  onSaveDraft: () => void;
  onSchedule: () => void;
}

const ContentEditorToolbar: React.FC<ContentEditorToolbarProps> = ({
  onPublish,
  onSaveDraft,
  onSchedule,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <h2 className="text-xl font-semibold">Content Editor</h2>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          size="sm"
          className="border-white/10 hover:bg-white/5 text-white/70"
          onClick={onSchedule}
        >
          <Clock className="h-4 w-4 mr-2" />
          Schedule
        </Button>
        <Button 
          variant="outline"
          size="sm"
          className="border-white/10 hover:bg-white/5 text-white/70"
          onClick={onSaveDraft}
        >
          <Save className="h-4 w-4 mr-2" />
          Save draft
        </Button>
        <Button 
          variant="default"
          size="sm"
          className="bg-blue-600 hover:bg-blue-500"
          onClick={onPublish}
        >
          <Send className="h-4 w-4 mr-2" />
          Publish
        </Button>
      </div>
    </div>
  );
};

export default ContentEditorToolbar;
