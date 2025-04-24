
import React from "react";
import { Button } from "@/components/ui/button";
import { Image, Smile, ChevronUp, ChevronDown, BookmarkPlus } from "lucide-react";

interface ContentCreationFooterProps {
  showAdvancedOptions: boolean;
  setShowAdvancedOptions: React.Dispatch<React.SetStateAction<boolean>>;
  handleGenerate: () => void;
  isEditing: boolean;
  onImageClick: () => void;
  onEmojiClick: () => void;
  onSaveSetup: () => void;
}

const ContentCreationFooter: React.FC<ContentCreationFooterProps> = ({
  showAdvancedOptions,
  setShowAdvancedOptions,
  handleGenerate,
  isEditing,
  onImageClick,
  onEmojiClick,
  onSaveSetup,
}) => {
  return (
    <div className="p-4 border-t border-white/5 bg-[#0F0F0F] flex items-center justify-between">
      <div className="flex items-center gap-4 ml-3">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-[#60a5fa] hover:bg-transparent hover:text-[#60a5fa]/80 p-2"
          onClick={onImageClick}
        >
          <Image className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-[#60a5fa] hover:bg-transparent hover:text-[#60a5fa]/80 p-2"
          onClick={onEmojiClick}
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          className="text-[#60a5fa] hover:bg-transparent hover:text-[#60a5fa]/80 flex items-center font-sans text-sm ml-2"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
          More options {showAdvancedOptions ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
        </Button>
        <Button
          variant="ghost"
          className="text-[#60a5fa] hover:bg-transparent hover:text-[#60a5fa]/80 font-sans text-sm flex items-center gap-1"
          onClick={onSaveSetup}
        >
          <BookmarkPlus className="h-4 w-4" />
          Save Setup
        </Button>
      </div>
      <Button 
        onClick={handleGenerate} 
        className="bg-[#2563eb] hover:bg-[#2563eb]/90 text-white rounded-full px-6 font-sans"
      >
        {isEditing ? "Update" : "Generate"}
      </Button>
    </div>
  );
};

export default ContentCreationFooter;
