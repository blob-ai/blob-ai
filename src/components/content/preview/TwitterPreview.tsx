
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Twitter, MoreHorizontal, MessageCircle, Repeat2, Heart, BarChart2 } from "lucide-react";
import { PlatformPreviewProps, UserAvatar, formatContent, CharacterLimits } from "./PlatformPreviewBase";

const TwitterPreview: React.FC<PlatformPreviewProps> = ({
  content,
  profileInfo = {
    name: "User Name",
    handle: "username",
    avatar: "",
    verified: false,
    timestamp: "Just now"
  },
  className,
  mode = "dark",
  device = "desktop",
  engagementStats = { likes: 0, comments: 0, shares: 0, views: 0 }
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const characterLimit = CharacterLimits.twitter;
  const isOverLimit = content.length > characterLimit;
  
  // Determine if content should be truncated
  const shouldTruncate = content.length > characterLimit && !isExpanded;
  
  // Calculate the display content
  const displayContent = shouldTruncate 
    ? content.substring(0, characterLimit - 20) 
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
        ? "bg-[#15202b] border-[#2f3336] text-white" 
        : "bg-white border-gray-200 text-[#0f1419]",
      getDeviceSpecificClasses(),
      className
    )}>
      {/* Twitter header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700/20">
        <div className="flex items-center gap-2">
          <Twitter className="h-5 w-5 text-[#1DA1F2]" />
          <span className="font-bold">Twitter</span>
        </div>
      </div>
      
      {/* Post content */}
      <div className="p-4">
        {/* Profile header */}
        <div className="flex gap-3">
          <UserAvatar profileInfo={profileInfo} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <span className="font-bold">{profileInfo.name}</span>
                  {profileInfo.verified && (
                    <span className="ml-0.5 flex items-center justify-center bg-[#1DA1F2] rounded-full h-4 w-4">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className={cn(
                  "text-sm",
                  mode === "dark" ? "text-gray-400" : "text-gray-500"
                )}>
                  @{profileInfo.handle}
                </div>
              </div>
              <button className={cn(
                "hover:bg-gray-800/20 rounded-full p-1",
                mode === "dark" ? "text-gray-400" : "text-gray-500"
              )}>
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            
            {/* Post text */}
            <div className={cn(
              "mt-1",
              mode === "dark" ? "text-white" : "text-[#0f1419]"
            )}>
              {formatContent(displayContent)}
              {!isExpanded && isOverLimit && (
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="text-[#1DA1F2] hover:underline"
                >
                  Show more
                </button>
              )}
              {isExpanded && isOverLimit && (
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="text-[#1DA1F2] hover:underline"
                >
                  Show less
                </button>
              )}
            </div>
            
            {/* Timestamp */}
            <div className={cn(
              "text-sm mt-2",
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            )}>
              {profileInfo.timestamp}
            </div>
            
            {/* Engagement metrics */}
            <div className="flex justify-between mt-4 pt-3 border-t border-gray-700/20 text-sm">
              <button className="flex items-center gap-1 group">
                <div className={cn(
                  "p-1.5 rounded-full",
                  mode === "dark" 
                    ? "group-hover:bg-[#1DA1F2]/10 text-gray-400 group-hover:text-[#1DA1F2]" 
                    : "group-hover:bg-[#1DA1F2]/10 text-gray-500 group-hover:text-[#1DA1F2]"
                )}>
                  <MessageCircle className="h-4 w-4" />
                </div>
                <span>{engagementStats.comments}</span>
              </button>
              
              <button className="flex items-center gap-1 group">
                <div className={cn(
                  "p-1.5 rounded-full",
                  mode === "dark" 
                    ? "group-hover:bg-green-500/10 text-gray-400 group-hover:text-green-500" 
                    : "group-hover:bg-green-500/10 text-gray-500 group-hover:text-green-500"
                )}>
                  <Repeat2 className="h-4 w-4" />
                </div>
                <span>{engagementStats.shares}</span>
              </button>
              
              <button className="flex items-center gap-1 group">
                <div className={cn(
                  "p-1.5 rounded-full",
                  mode === "dark" 
                    ? "group-hover:bg-pink-500/10 text-gray-400 group-hover:text-pink-500" 
                    : "group-hover:bg-pink-500/10 text-gray-500 group-hover:text-pink-500"
                )}>
                  <Heart className="h-4 w-4" />
                </div>
                <span>{engagementStats.likes}</span>
              </button>
              
              <button className="flex items-center gap-1 group">
                <div className={cn(
                  "p-1.5 rounded-full",
                  mode === "dark" 
                    ? "group-hover:bg-[#1DA1F2]/10 text-gray-400 group-hover:text-[#1DA1F2]" 
                    : "group-hover:bg-[#1DA1F2]/10 text-gray-500 group-hover:text-[#1DA1F2]"
                )}>
                  <BarChart2 className="h-4 w-4" />
                </div>
                <span>{engagementStats.views}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterPreview;
