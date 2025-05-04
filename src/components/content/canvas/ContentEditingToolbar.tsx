
import React from "react";
import { 
  Bold, 
  Italic, 
  List, 
  Underline,
  AlignLeft,
  Image,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentEditingToolbarProps {
  onSelect: (option: string) => void;
  onFormat: (format: string) => void;
  style?: React.CSSProperties;
  isFloating?: boolean;
}

const ContentEditingToolbar: React.FC<ContentEditingToolbarProps> = ({
  onSelect,
  onFormat,
  style = {},
  isFloating = false,
}) => {
  const textOptions = [
    { id: "rewrite", label: "Rewrite" },
    { id: "shorter", label: "Make shorter" },
    { id: "longer", label: "Make longer" },
    { id: "fix", label: "Fix grammar" },
  ];

  const formatOptions = [
    { id: "bold", icon: <Bold className="h-4 w-4" /> },
    { id: "italic", icon: <Italic className="h-4 w-4" /> },
    { id: "underline", icon: <Underline className="h-4 w-4" /> },
    { id: "list", icon: <List className="h-4 w-4" /> },
  ];

  return (
    <div 
      className={`flex flex-wrap bg-black border border-white/10 rounded-lg shadow-lg z-10 ${
        isFloating ? "absolute" : ""
      }`}
      style={style}
    >
      {isFloating ? (
        // Text transformation options for selection
        <div className="flex">
          {textOptions.map((option) => (
            <button
              key={option.id}
              className="px-3 py-2 text-sm text-white hover:bg-white/10 first:rounded-l-lg last:rounded-r-lg"
              onClick={() => onSelect(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : (
        // Format options for toolbar
        <div className="flex">
          {formatOptions.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/5"
              onClick={() => onFormat(option.id)}
            >
              {option.icon}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentEditingToolbar;
