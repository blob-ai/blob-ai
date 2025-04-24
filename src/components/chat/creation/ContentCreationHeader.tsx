
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Pencil } from "lucide-react";
import { QuickSetupMenu } from "./QuickSetupMenu";
import { ContentSetup } from "@/types/setup";

interface ContentCreationHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  onClose: () => void;
  savedSetups: ContentSetup[];
  onSelectSetup: (setup: ContentSetup) => void;
}

const ContentCreationHeader: React.FC<ContentCreationHeaderProps> = ({
  title,
  setTitle,
  onClose,
  savedSetups,
  onSelectSetup,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleTitleChange = () => {
    setTitle(tempTitle);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleChange();
    }
  };

  return (
    <div className="p-4 flex items-center justify-between border-b border-white/5 bg-[#0F0F0F] font-sans">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleChange}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-white text-xl font-medium focus:outline-none w-full font-sans"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-1">
            <h2 className="text-white text-xl font-medium font-sans">{title}</h2>
            <button 
              className="text-[#60a5fa] hover:text-[#60a5fa]/80"
              onClick={() => {
                setTempTitle(title);
                setIsEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <QuickSetupMenu savedSetups={savedSetups} onSelectSetup={onSelectSetup} />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white/70 hover:text-white hover:bg-transparent"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ContentCreationHeader;
