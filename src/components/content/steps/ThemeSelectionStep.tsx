
import React from "react";
import ThemeSelectionForm from "@/components/content/idea-generation/ThemeSelectionForm";

interface ThemeSelectionStepProps {
  onSubmit: (theme: string, categories: string[], goal: string) => void;
}

const ThemeSelectionStep: React.FC<ThemeSelectionStepProps> = ({ onSubmit }) => {
  return (
    <div 
      className="max-w-xl mx-auto p-6 bg-black border border-white/10 rounded-xl shadow-lg relative" 
      id="theme-selection-container"
      data-editor-container="true"
      data-content-editor="true"
    >
      <ThemeSelectionForm onSubmit={onSubmit} />
      
      {/* Global container for floating toolbar that works across different editor contexts */}
      <div className="global-toolbar-container" aria-hidden="true"></div>
    </div>
  );
};

export default ThemeSelectionStep;
