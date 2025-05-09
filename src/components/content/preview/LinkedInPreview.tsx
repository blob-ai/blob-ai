
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Linkedin, MoreHorizontal, ThumbsUp, MessageSquare, Share } from "lucide-react";
import { PlatformPreviewProps, UserAvatar, formatContent, CharacterLimits, SeeMoreButton } from "./PlatformPreviewBase";

const LinkedInPreview: React.FC<PlatformPreviewProps> = ({
  content,
  profileInfo = {
    name: "User Name",
    title: "Professional Title",
    avatar: "",
    timestamp: "Just now"
  },
  className,
  mode = "dark",
  device = "desktop",
  mediaUrls = [],
  engagementStats = { likes: 0, comments: 0, shares: 0 }
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const characterLimit = 210; // LinkedIn shows "...see more" after about 210 chars in desktop view
  
  // Calculate if we should show the "see more" button
  const shouldShowSeeMore = content.length > characterLimit && !isExpanded;
  
  // Calculate the display content
  const displayContent = shouldShowSeeMore
    ? content.substring(0, characterLimit) 
    : content;
    
  const getDeviceSpecificClasses = () => {
    switch (device) {
      case "mobile":
        return "max-w-[320px] text-sm";
      case "tablet":
        return "max-w-[560px]";
      case "desktop":
      default:
        return "w-full";
    }
  };

  const handleSeeMoreClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cn(
      "border rounded-xl overflow-hidden",
      mode === "dark" 
        ? "bg-[#1D2226] border-[#38434F] text-white" 
        : "bg-white border-gray-200 text-[#000000]",
      getDeviceSpecificClasses(),
      className
    )}>
      {/* LinkedIn header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700/20">
        <div className="flex items-center gap-2">
          <Linkedin className="h-5 w-5 text-[#0A66C2]" />
          <span className="font-bold">LinkedIn</span>
        </div>
      </div>
      
      {/* Post content */}
      <div className="p-4">
        {/* Profile header */}
        <div className="flex gap-3 mb-3">
          <UserAvatar profileInfo={profileInfo} />
          <div>
            <div className="flex items-center">
              <span className="font-semibold">{profileInfo.name}</span>
              {profileInfo.verified && (
                <span className="ml-1 text-[#0A66C2]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.5,2h-11C1.7,2,1,2.7,1,3.5v9C1,13.3,1.7,14,2.5,14h11c0.8,0,1.5-0.7,1.5-1.5v-9C15,2.7,14.3,2,13.5,2z M11.8,6.7l-4.5,4.5c-0.2,0.2-0.4,0.3-0.7,0.3c-0.3,0-0.5-0.1-0.7-0.3L4.2,9.5C3.8,9.1,3.8,8.5,4.2,8.1s1-0.4,1.4,0l1,1l3.8-3.8c0.4-0.4,1-0.4,1.4,0S12.2,6.3,11.8,6.7z" />
                  </svg>
                </span>
              )}
            </div>
            <div className={cn(
              "text-sm",
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            )}>
              {profileInfo.title}
            </div>
            <div className={cn(
              "text-xs flex items-center gap-1",
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            )}>
              {profileInfo.timestamp} • <span className="h-1 w-1 rounded-full bg-gray-400"></span> <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 107 7 7 7 0 00-7-7zm0 12.125A5.125 5.125 0 1113.125 8 5.132 5.132 0 018 13.125zM8 5a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"></path></svg>
            </div>
          </div>
          <div className="ml-auto">
            <button className={cn(
              "hover:bg-gray-800/20 rounded-full p-1",
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            )}>
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Post text */}
        <div className={cn(
          "text-sm leading-relaxed mb-3",
          mode === "dark" ? "text-white" : "text-[#000000]"
        )}>
          {formatContent(displayContent, undefined, true)}
          {shouldShowSeeMore && <SeeMoreButton onClick={handleSeeMoreClick} />}
          {isExpanded && (
            <button 
              onClick={() => setIsExpanded(false)} 
              className="text-sm text-[#0A66C2] font-medium hover:underline mt-1 block"
            >
              Show less
            </button>
          )}
        </div>
        
        {/* Media content if available */}
        {mediaUrls.length > 0 && (
          <div className="mt-2 mb-3">
            {mediaUrls.length === 1 ? (
              <div className="rounded-lg overflow-hidden border border-gray-700/30">
                <img 
                  src={mediaUrls[0]} 
                  alt="Post media" 
                  className="w-full object-cover"
                  style={{ maxHeight: "350px" }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                {mediaUrls.slice(0, 4).map((url, idx) => (
                  <div key={idx} className={cn(
                    "overflow-hidden",
                    mediaUrls.length === 3 && idx === 0 ? "col-span-2" : ""
                  )}>
                    <img 
                      src={url} 
                      alt={`Media ${idx + 1}`}
                      className="w-full h-full object-cover"
                      style={{ height: "120px" }}
                    />
                  </div>
                ))}
                {mediaUrls.length > 4 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    +{mediaUrls.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Engagement metrics */}
        <div className="pt-2 border-t border-gray-700/20">
          {/* Like summary */}
          {engagementStats.likes > 0 && (
            <div className="flex items-center gap-1 py-1 text-xs">
              <div className="flex -space-x-1">
                <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <ThumbsUp className="h-2 w-2 text-white" />
                </div>
                <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-[8px]">✓</span>
                </div>
                <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-[8px]">♥</span>
                </div>
              </div>
              <span className={mode === "dark" ? "text-gray-300" : "text-gray-600"}>
                {engagementStats.likes}
              </span>
            </div>
          )}
          
          {/* Comments and shares count */}
          <div className={cn(
            "flex justify-between mt-1 text-xs",
            mode === "dark" ? "text-gray-400" : "text-gray-500"
          )}>
            {engagementStats.comments > 0 && (
              <span>{engagementStats.comments} comments</span>
            )}
            {engagementStats.shares > 0 && (
              <span>{engagementStats.shares} reposts</span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between mt-1 pt-1 border-t border-gray-700/20">
            <button className={cn(
              "flex items-center gap-1 py-1.5 px-2 rounded hover:bg-gray-700/20",
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            )}>
              <ThumbsUp className="h-5 w-5" />
              <span className="text-sm">Like</span>
            </button>
            
            <button className={cn(
              "flex items-center gap-1 py-1.5 px-2 rounded hover:bg-gray-700/20",
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            )}>
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm">Comment</span>
            </button>
            
            <button className={cn(
              "flex items-center gap-1 py-1.5 px-2 rounded hover:bg-gray-700/20",
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            )}>
              <Share className="h-5 w-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPreview;
