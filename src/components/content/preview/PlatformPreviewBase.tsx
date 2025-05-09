
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { markdownToHtml } from "@/lib/formatting";

export interface ProfileInfo {
  name: string;
  handle?: string;
  title?: string;
  avatar?: string;
  verified?: boolean;
  timestamp?: string;
}

export interface PlatformPreviewProps {
  content: string;
  profileInfo?: ProfileInfo;
  className?: string;
  mode?: "light" | "dark";
  device?: "mobile" | "tablet" | "desktop";
  characterLimit?: number;
  mediaUrls?: string[];
  engagementStats?: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
}

export const UserAvatar: React.FC<{ profileInfo: ProfileInfo; size?: "sm" | "md" | "lg" }> = ({ 
  profileInfo, 
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <Avatar className={cn("border border-white/10", sizeClasses[size])}>
      {profileInfo.avatar ? (
        <AvatarImage src={profileInfo.avatar} alt={profileInfo.name} />
      ) : (
        <AvatarFallback className="bg-blue-800/30 text-blue-200">
          {profileInfo.name.charAt(0)}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export const formatContent = (content: string, limit?: number, linkifyHashtags = false): React.ReactNode => {
  if (!content) return null;
  
  // If there's a limit, truncate the content
  const displayContent = limit && content.length > limit 
    ? `${content.substring(0, limit)}...` 
    : content;
  
  // Split text into paragraphs
  return displayContent.split("\n\n").map((paragraph, idx) => {
    // Convert markdown to HTML
    let processedParagraph = markdownToHtml(paragraph);
    
    // Process hashtags if needed
    if (linkifyHashtags) {
      processedParagraph = processedParagraph.replace(
        /#(\w+)/g, 
        '<span class="text-blue-500">#$1</span>'
      );
    }
    
    return (
      <p 
        key={idx} 
        className={idx > 0 ? "mt-3" : ""} 
        dangerouslySetInnerHTML={{ __html: processedParagraph }}
      />
    );
  });
};

export const SeeMoreButton: React.FC<{ onClick?: () => void; className?: string }> = ({ 
  onClick, 
  className 
}) => (
  <button 
    onClick={onClick}
    className={cn("text-blue-500 hover:underline text-sm font-medium", className)}
  >
    ...see more
  </button>
);

export const CharacterLimits = {
  twitter: 280,
  linkedin: 3000,
  facebook: 63206,
};
