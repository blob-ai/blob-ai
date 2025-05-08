
import React from "react";
import { Twitter, Linkedin, Facebook } from "lucide-react";
import { marked } from "marked";
import { cn } from "@/lib/utils";

interface CanvasPreviewProps {
  content: string;
  platform?: "default" | "twitter" | "linkedin" | "facebook";
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({ 
  content,
  platform = "default"
}) => {
  // Platform-specific character limits
  const characterLimits = {
    twitter: 280,
    linkedin: 3000,
    facebook: 63206 // FB has a very high limit, but we'll cap it for display purposes
  };
  
  // Calculate character count and limit based on platform
  const charCount = content.length;
  const limit = platform !== "default" ? characterLimits[platform] : Infinity;
  const isOverLimit = charCount > limit;
  
  // Format for platform-specific display
  const getFormattedContent = () => {
    // For default view, return the full content
    if (platform === "default") {
      return content;
    }
    
    // For Twitter, truncate to limit
    if (platform === "twitter") {
      return content.length > limit 
        ? content.substring(0, limit) + "..." 
        : content;
    }
    
    // For LinkedIn and Facebook, use the content as is (up to their limits)
    return content;
  };
  
  const formattedContent = getFormattedContent();
  
  // Platform icon components
  const getPlatformIcon = () => {
    switch(platform) {
      case "twitter":
        return <Twitter className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />;
      case "facebook":
        return <Facebook className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="relative w-full">
      {/* Platform Header */}
      {platform !== "default" && (
        <div className="py-2 px-3 md:py-3 md:px-4 border border-white/10 rounded-t-lg bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getPlatformIcon()}
            <span className="font-medium text-sm md:text-base capitalize">{platform}</span>
            <div className="h-4 md:h-5 w-px bg-white/10 mx-2"></div>
            <span className="text-xs md:text-sm text-white/60">Preview</span>
          </div>
          
          <div className={cn(
            "text-xs md:text-sm", 
            isOverLimit ? 'text-red-500' : 'text-white/60'
          )}>
            {charCount}/{limit} characters
          </div>
        </div>
      )}
      
      {/* Content Preview */}
      <div 
        className={cn(
          "px-3 py-3 md:px-6 md:py-4 bg-[#16181c] border border-white/10",
          platform !== "default" ? 'rounded-b-lg' : 'rounded-lg'
        )}
      >
        {isOverLimit && platform !== "default" ? (
          <div>
            <div 
              className="prose prose-invert max-w-full text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: marked(formattedContent) }}
            />
            <div className="mt-3 py-2 px-3 bg-red-500/10 border border-red-500/30 rounded-md text-xs md:text-sm">
              <span className="font-medium text-red-400">Character limit exceeded</span>
              <p className="text-red-300/80 mt-1">
                Your content exceeds the {platform} character limit of {limit} characters. 
                The actual post will be truncated.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Platform-specific styling */}
            {platform === "twitter" ? (
              <div>
                {/* Profile bar - simplified version */}
                <div className="flex items-center gap-2 md:gap-3 mb-3 pb-2 md:mb-4 md:pb-3 border-b border-white/10">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/20"></div>
                  <div>
                    <div className="font-medium text-sm md:text-base">User Name</div>
                    <div className="text-xs md:text-sm text-white/60">@username</div>
                  </div>
                </div>
                <div 
                  className="prose prose-invert max-w-full text-sm md:text-base"
                  dangerouslySetInnerHTML={{ __html: marked(formattedContent) }}
                />
              </div>
            ) : platform === "linkedin" ? (
              <div>
                {/* Profile bar - simplified version */}
                <div className="flex items-center gap-2 md:gap-3 mb-3 pb-2 md:mb-4 md:pb-3 border-b border-white/10">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/20"></div>
                  <div>
                    <div className="font-medium text-sm md:text-base">User Name</div>
                    <div className="text-xs md:text-sm text-white/60">Professional Title</div>
                  </div>
                </div>
                <div 
                  className="prose prose-invert max-w-full text-sm md:text-base"
                  dangerouslySetInnerHTML={{ __html: marked(formattedContent) }}
                />
              </div>
            ) : platform === "facebook" ? (
              <div>
                {/* Profile bar - simplified version */}
                <div className="flex items-center gap-2 md:gap-3 mb-3 pb-2 md:mb-4 md:pb-3 border-b border-white/10">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/20"></div>
                  <div>
                    <div className="font-medium text-sm md:text-base">User Name</div>
                    <div className="text-xs md:text-sm text-white/60">Just now</div>
                  </div>
                </div>
                <div 
                  className="prose prose-invert max-w-full text-sm md:text-base"
                  dangerouslySetInnerHTML={{ __html: marked(formattedContent) }}
                />
              </div>
            ) : (
              <div 
                className="prose prose-invert max-w-full text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: marked(content) }}
              />
            )}
            
            {/* Engagement indicators */}
            {platform !== "default" && (
              <div className="flex items-center justify-between mt-3 pt-2 md:mt-4 md:pt-3 border-t border-white/10 text-xs md:text-sm text-white/60">
                {platform === "twitter" && (
                  <>
                    <span>💬 0</span>
                    <span>🔄 0</span>
                    <span>❤️ 0</span>
                    <span>📊 0</span>
                  </>
                )}
                {platform === "linkedin" && (
                  <>
                    <span>👍 0</span>
                    <span>💭 0</span>
                    <span>🔄 0</span>
                  </>
                )}
                {platform === "facebook" && (
                  <>
                    <span>👍 0</span>
                    <span>💬 0</span>
                    <span>↗️ 0</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasPreview;
