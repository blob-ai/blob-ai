
import React from 'react';
import { Button } from "@/components/ui/button";

interface SuggestionChipsProps {
  suggestions: { id: string; text: string }[];
  onChipClick: (text: string) => void;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, onChipClick }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          variant="outline"
          className="bg-transparent border border-white/20 hover:bg-white/10 rounded-full text-sm text-blue-400"
          onClick={() => onChipClick(suggestion.text)}
        >
          {suggestion.text}
        </Button>
      ))}
    </div>
  );
};

export default SuggestionChips;
