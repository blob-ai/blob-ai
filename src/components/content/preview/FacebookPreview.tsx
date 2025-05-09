
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Facebook, MoreHorizontal, ThumbsUp, MessageSquare, Share } from "lucide-react";
import { PlatformPreviewProps, UserAvatar, formatContent, SeeMoreButton } from "./PlatformPreviewBase";

const FacebookPreview: React.FC<PlatformPreviewProps> = ({
  content,
  profileInfo = {
    name: "User Name",
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
  const characterLimit = 400; // Facebook shows "See more" after a few lines
  
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

  return (
    <div className={cn(
      "border rounded-xl overflow-hidden",
      mode === "dark" 
        ? "bg-[#242526] border-[#3E4042] text-white" 
        : "bg-white border-gray-300 text-[#050505]",
      getDeviceSpecificClasses(),
      className
    )}>
      {/* Facebook header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700/20">
        <div className="flex items-center gap-2">
          <Facebook className="h-5 w-5 text-[#1877F2]" />
          <span className="font-bold">Facebook</span>
        </div>
      </div>
      
      {/* Post content */}
      <div className="p-4">
        {/* Profile header */}
        <div className="flex justify-between">
          <div className="flex gap-2">
            <UserAvatar profileInfo={profileInfo} />
            <div>
              <div className="font-semibold">{profileInfo.name}</div>
              <div className={cn(
                "text-xs flex items-center",
                mode === "dark" ? "text-gray-400" : "text-gray-500"
              )}>
                {profileInfo.timestamp} • 
                <svg className="h-3 w-3 ml-1" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8.002 0a8.002 8.002 0 100 16.004 8.002 8.002 0 000-16.004zm0 14.004a6.001 6.001 0 110-12.002 6.001 6.001 0 010 12.002zM8 3l-1 2.99H3.997L5.999 8l-1 3.01L8 9l3 2.01-1-3.01L12 6.01H9.01L8 3z" />
                </svg>
              </div>
            </div>
          </div>
          <button className={cn(
            "hover:bg-gray-700/20 rounded-full p-1 h-8 w-8 flex items-center justify-center",
            mode === "dark" ? "text-gray-300" : "text-gray-700"
          )}>
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        
        {/* Post text */}
        <div className={cn(
          "mt-3 text-sm leading-relaxed",
          mode === "dark" ? "text-[#E4E6EB]" : "text-[#050505]"
        )}>
          {formatContent(displayContent)}
          {shouldShowSeeMore && (
            <SeeMoreButton 
              onClick={() => setIsExpanded(true)}
              className={cn(
                mode === "dark" ? "text-gray-300" : "text-gray-600",
                "hover:underline"
              )}
            />
          )}
          {isExpanded && (
            <button 
              onClick={() => setIsExpanded(false)}
              className={cn(
                mode === "dark" ? "text-gray-300" : "text-gray-600",
                "text-sm hover:underline block mt-1"
              )}
            >
              See less
            </button>
          )}
        </div>
        
        {/* Media content if available */}
        {mediaUrls.length > 0 && (
          <div className="mt-3">
            {mediaUrls.length === 1 ? (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={mediaUrls[0]} 
                  alt="Post media" 
                  className="w-full object-cover"
                />
              </div>
            ) : (
              <div className={cn(
                "grid gap-1 rounded-lg overflow-hidden",
                mediaUrls.length === 2 ? "grid-cols-2" : 
                mediaUrls.length === 3 ? "grid-cols-2" :
                "grid-cols-2"
              )}>
                {mediaUrls.slice(0, 4).map((url, idx) => (
                  <div key={idx} className={cn(
                    "overflow-hidden",
                    mediaUrls.length === 3 && idx === 0 ? "col-span-2 row-span-2" : ""
                  )}>
                    <img 
                      src={url} 
                      alt={`Media ${idx + 1}`}
                      className="w-full h-full object-cover"
                      style={{ height: idx === 0 && mediaUrls.length === 3 ? "240px" : "120px" }}
                    />
                  </div>
                ))}
                {mediaUrls.length > 4 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    +{mediaUrls.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Engagement metrics */}
        <div className="mt-3">
          {/* Like and comment counts */}
          {(engagementStats.likes > 0 || engagementStats.comments > 0 || engagementStats.shares > 0) && (
            <div className="flex justify-between py-1 border-t border-b border-gray-700/20">
              {engagementStats.likes > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center h-5 w-5 rounded-full bg-[#1877F2]">
                    <ThumbsUp className="h-3 w-3 text-white" />
                  </div>
                  <span className={cn(
                    "text-sm",
                    mode === "dark" ? "text-gray-300" : "text-gray-600"
                  )}>
                    {engagementStats.likes}
                  </span>
                </div>
              )}
              
              <div className={cn(
                "text-sm flex gap-2",
                mode === "dark" ? "text-gray-400" : "text-gray-500"
              )}>
                {engagementStats.comments > 0 && (
                  <span>{engagementStats.comments} comments</span>
                )}
                {engagementStats.shares > 0 && (
                  <span>{engagementStats.shares} shares</span>
                )}
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-around mt-1 pt-1">
            <button className={cn(
              "flex items-center justify-center gap-2 py-1.5 px-2 rounded-md hover:bg-gray-700/10 flex-1",
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            )}>
              <ThumbsUp className="h-5 w-5" />
              <span className="text-sm">Like</span>
            </button>
            
            <button className={cn(
              "flex items-center justify-center gap-2 py-1.5 px-2 rounded-md hover:bg-gray-700/10 flex-1",
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            )}>
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm">Comment</span>
            </button>
            
            <button className={cn(
              "flex items-center justify-center gap-2 py-1.5 px-2 rounded-md hover:bg-gray-700/10 flex-1",
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

export default FacebookPreview;
