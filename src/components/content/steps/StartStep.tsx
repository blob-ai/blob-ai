
import React from "react";
import { Button } from "@/components/ui/button";

interface StartStepProps {
  onCreateClick: () => void;
}

const StartStep: React.FC<StartStepProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center max-w-xl mx-auto">
      <div className="text-blue-400 mb-8">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-4">Create amazing content</h1>
      <p className="text-white/70 mb-8">
        Generate high-quality posts for social media, blogs, or any platform. Choose from
        multiple creation methods to get started.
      </p>
      <Button 
        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-6 rounded-xl text-lg"
        onClick={onCreateClick}
      >
        Create posts
      </Button>
    </div>
  );
};

export default StartStep;
