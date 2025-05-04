
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Save, Send, Bold, Italic, Underline, Image, ListOrdered, ListBullet, Eye } from "lucide-react";

interface ContentEditorToolbarProps {
  onPublish: () => void;
  onSaveDraft: () => void;
  onSchedule: () => void;
  showPreview: () => void;
}

const ContentEditorToolbar: React.FC<ContentEditorToolbarProps> = ({
  onPublish,
  onSaveDraft,
  onSchedule,
  showPreview,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-white/10 rounded-md h-9 w-9"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-white/10 rounded-md h-9 w-9"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-white/10 rounded-md h-9 w-9"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="border-r border-white/10 mx-2 h-6"></div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-white/10 rounded-md h-9 w-9"
        >
          <ListBullet className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-white/10 rounded-md h-9 w-9"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="border-r border-white/10 mx-2 h-6"></div>
        
        <Button 
          variant="ghost" 
          className="hover:bg-white/10 rounded-md"
        >
          <Image className="h-4 w-4 mr-2" />
          <span>Add Image</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="hover:bg-white/10 rounded-md"
          onClick={showPreview}
        >
          <Eye className="h-4 w-4 mr-2" />
          <span>Preview</span>
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline"
          size="sm"
          className="border-white/10 hover:bg-white/5 text-white/70"
          onClick={onSaveDraft}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
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
          variant="default"
          size="sm"
          className="bg-blue-600 hover:bg-blue-500"
          onClick={onPublish}
        >
          Publish
        </Button>
      </div>
    </div>
  );
};

export default ContentEditorToolbar;
