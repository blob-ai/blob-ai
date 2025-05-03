
import React from "react";
import { cn } from "@/lib/utils";

interface ContentCreationOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const ContentCreationOption: React.FC<ContentCreationOptionProps> = ({
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <button
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left border border-transparent hover:border-white/10"
      onClick={onClick}
    >
      <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg">
        {icon}
      </div>
      <div>
        <h4 className="text-base font-medium">{title}</h4>
        <p className="text-sm text-white/60">{description}</p>
      </div>
    </button>
  );
};

export default ContentCreationOption;
