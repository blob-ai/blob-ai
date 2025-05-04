
import React from "react";
import { Button } from "@/components/ui/button";
import { Image, Eye, Save, Calendar } from "lucide-react";
import ContentEditingToolbar from "./ContentEditingToolbar";
import { toast } from "sonner";

interface CanvasToolbarProps {
  onToggleMobileView: () => void;
  onToggleChatPanel: () => void;
  showChatPanel: boolean;
  handleAutoSave: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
  onSchedule: (content: string, date: Date) => void;
  onPublish: (content: string) => void;
  content: string;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onToggleMobileView,
  onToggleChatPanel,
  showChatPanel,
  handleAutoSave,
  isSaving,
  lastSaved,
  onSchedule,
  onPublish,
  content,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center gap-4">
        <ContentEditingToolbar
          onSelect={() => {}}
          onFormat={() => {}}
          isFloating={false}
        />
        
        <div className="h-5 border-r border-white/10"></div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white hover:bg-white/5"
          onClick={() => {
            toast.info("Image upload feature coming soon");
          }}
        >
          <Image className="h-4 w-4 mr-1" />
          <span className="text-sm">Add Image</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white hover:bg-white/5"
          onClick={onToggleMobileView}
        >
          <Eye className="h-4 w-4 mr-1" />
          <span className="text-sm">Preview</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/5"
          onClick={onToggleChatPanel}
        >
          {showChatPanel ? (
            <span className="text-sm">Hide AI</span>
          ) : (
            <span className="text-sm">Show AI</span>
          )}
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-xs text-white/50 mr-2">
          {isSaving ? (
            <span>Saving...</span>
          ) : lastSaved ? (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          ) : null}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="border-white/10 hover:bg-white/5"
          onClick={handleAutoSave}
        >
          <Save className="h-4 w-4 mr-1" />
          <span className="text-sm">Save Draft</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="border-white/10 hover:bg-white/5"
          onClick={() => {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            onSchedule(content, date);
          }}
        >
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">Schedule</span>
        </Button>
        
        <Button 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-500"
          onClick={() => onPublish(content)}
        >
          Publish
        </Button>
      </div>
    </div>
  );
};

export default CanvasToolbar;
