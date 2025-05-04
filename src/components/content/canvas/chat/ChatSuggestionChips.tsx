
import React from "react";

interface ChatSuggestionChipsProps {
  suggestedPrompts: string[];
  onPromptClick: (prompt: string) => void;
}

const ChatSuggestionChips: React.FC<ChatSuggestionChipsProps> = ({ 
  suggestedPrompts, 
  onPromptClick 
}) => {
  return (
    <div className="mb-3 space-y-2">
      <p className="text-xs text-white/50 mb-2">Suggestions</p>
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt, index) => (
          <button
            key={index}
            className="px-3 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
            onClick={() => onPromptClick(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestionChips;
