
import React, { useState, useEffect } from "react";

interface ChatSuggestionChipsProps {
  onSelectSuggestion: (suggestion: string) => void;
  userInput: string;
}

const ChatSuggestionChips: React.FC<ChatSuggestionChipsProps> = ({ onSelectSuggestion, userInput }) => {
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "Improve my introduction",
    "Make my content more engaging",
    "Add a strong conclusion",
    "Check my grammar and style",
    "Suggest a catchy headline"
  ]);

  useEffect(() => {
    updateSuggestedPrompts(userInput);
  }, [userInput]);

  const updateSuggestedPrompts = (input: string) => {
    // Update suggestions based on conversation context
    if (input.toLowerCase().includes("headline") || input.toLowerCase().includes("title")) {
      setSuggestedPrompts([
        "Make my headline more catchy",
        "Generate 3 more headline options",
        "Which headline is most clickable?",
        "Add a subtitle suggestion",
      ]);
    } else if (input.toLowerCase().includes("grammar") || input.toLowerCase().includes("fix")) {
      setSuggestedPrompts([
        "Check my entire content for errors",
        "Make my tone more professional",
        "Simplify my language",
        "Make content easier to read",
      ]);
    } else if (input.length > 0 && !suggestedPrompts.includes("Suggest a better conclusion")) {
      setSuggestedPrompts([
        "Suggest a better conclusion",
        "Help me add more evidence",
        "Make my point more clearly",
        "Add transition sentences",
      ]);
    }
  };

  return (
    <div className="mb-3 space-y-2">
      <p className="text-xs text-white/50 mb-2">Suggestions</p>
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt, index) => (
          <button
            key={index}
            className="px-3 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
            onClick={() => onSelectSuggestion(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestionChips;
