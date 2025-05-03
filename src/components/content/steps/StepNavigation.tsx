
import React from "react";
import { Button } from "@/components/ui/button";
import { CreationStep } from "@/hooks/use-content-creation";

interface StepNavigationProps {
  currentStep: CreationStep;
  onBack: () => void;
  onStartOver: () => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  currentStep, 
  onBack, 
  onStartOver 
}) => {
  if (currentStep === CreationStep.START || currentStep === CreationStep.CONTENT_CANVAS) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        variant="ghost"
        onClick={onBack}
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

export default StepNavigation;
