
import React from "react";

interface ContentEditingToolbarProps {
  onSelect: (option: string) => void;
  style?: React.CSSProperties;
}

const ContentEditingToolbar: React.FC<ContentEditingToolbarProps> = ({
  onSelect,
  style = {},
}) => {
  const options = [
    { id: "rewrite", label: "Rewrite" },
    { id: "shorter", label: "Make shorter" },
    { id: "longer", label: "Make longer" },
    { id: "fix", label: "Fix grammar" },
  ];

  return (
    <div 
      className="absolute z-10 flex bg-black border border-white/10 rounded-lg shadow-lg"
      style={style}
    >
      {options.map((option) => (
        <button
          key={option.id}
          className="px-3 py-2 text-sm text-white hover:bg-white/10 first:rounded-l-lg last:rounded-r-lg"
          onClick={() => onSelect(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ContentEditingToolbar;
