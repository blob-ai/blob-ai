
import React from "react";
import { cn } from "@/lib/utils";
import TwitterPreview from "../preview/TwitterPreview";
import LinkedInPreview from "../preview/LinkedInPreview";
import FacebookPreview from "../preview/FacebookPreview";
import { sanitizeForPlatform } from "@/lib/formatting";

interface CanvasPreviewProps {
  content: string;
  platform?: "default" | "twitter" | "linkedin" | "facebook";
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({ 
  content,
  platform = "default"
}) => {
  // Default profile info
  const profileInfo = {
    name: "Your Name",
    handle: "yourname",
    title: "Your Title",
    timestamp: "Just now"
  };

  // Process content based on platform
  const processedContent = platform !== "default" 
    ? sanitizeForPlatform(content, platform)
    : content;

  // If default view, render simple content
  if (platform === "default") {
    return (
      <div className="prose prose-invert max-w-full text-sm md:text-base p-4 bg-[#16181c] border border-white/10 rounded-lg">
        <div className="whitespace-pre-wrap">{processedContent}</div>
      </div>
    );
  }

  // For platform-specific views, use our specialized components
  return (
    <div className="w-full">
      {platform === "twitter" && (
        <TwitterPreview 
          content={processedContent} 
          profileInfo={profileInfo}
        />
      )}
      
      {platform === "linkedin" && (
        <LinkedInPreview 
          content={processedContent} 
          profileInfo={profileInfo}
        />
      )}
      
      {platform === "facebook" && (
        <FacebookPreview 
          content={processedContent} 
          profileInfo={profileInfo}
        />
      )}
    </div>
  );
};

export default CanvasPreview;
