
import React from "react";
import ThemeSelectionForm from "@/components/content/idea-generation/ThemeSelectionForm";

interface ThemeSelectionStepProps {
  onSubmit: (theme: string, categories: string[], goal: string) => void;
}

const ThemeSelectionStep: React.FC<ThemeSelectionStepProps> = ({ onSubmit }) => {
  return (
    <div className="max-w-xl mx-auto p-6 bg-black border border-white/10 rounded-xl shadow-lg">
      <ThemeSelectionForm onSubmit={onSubmit} />
    </div>
  );
};

export default ThemeSelectionStep;
