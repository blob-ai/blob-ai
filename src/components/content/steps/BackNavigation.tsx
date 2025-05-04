
import React from "react";
import { Button } from "@/components/ui/button";
import { CreationStep } from "@/hooks/useContentCreation";

interface BackNavigationProps {
  currentStep: CreationStep;
  onBack: (step: CreationStep) => void;
  onStartOver: () => void;
}

const BackNavigation: React.FC<BackNavigationProps> = ({
  currentStep,
  onBack,
  onStartOver,
}) => {
  if (currentStep === CreationStep.START || currentStep === CreationStep.CONTENT_CANVAS) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        variant="ghost"
        onClick={() => {
          if (currentStep > CreationStep.START) {
            const prevStep = Math.max(CreationStep.START, currentStep - 1);
            onBack(prevStep);
          }
        }}
        className="text-white/70 hover:text-white"
      >
        ← Back
      </Button>
      <Button
        variant="ghost"
        onClick={onStartOver}
        className="text-white/70 hover:text-white"
      >
        Start over
      </Button>
    </div>
  );
};

export default BackNavigation;
