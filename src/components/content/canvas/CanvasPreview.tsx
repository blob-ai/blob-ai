
import React from "react";
import { Twitter, Linkedin, Facebook } from "lucide-react";
import { marked } from "marked";

interface CanvasPreviewProps {
  content: string;
  platform?: "default" | "twitter" | "linkedin" | "facebook";
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({ 
  content,
  platform = "default"
}) => {
  // Convert markdown to HTML
  const createMarkup = () => {
    return { __html: marked(content) };
  };
  
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
  
  return (
    <div className="relative">
      {/* Platform Header */}
      {platform !== "default" && (
        <div className="py-3 px-4 border border-white/10 rounded-t-lg bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {platform === "twitter" && <Twitter className="h-5 w-5 text-blue-400" />}
            {platform === "linkedin" && <Linkedin className="h-5 w-5 text-blue-600" />}
            {platform === "facebook" && <Facebook className="h-5 w-5 text-blue-500" />}
            <span className="font-medium capitalize">{platform}</span>
            <div className="h-5 w-px bg-white/10 mx-2"></div>
            <span className="text-sm text-white/60">Preview</span>
          </div>
          
          <div className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-white/60'}`}>
            {charCount}/{limit} characters
          </div>
        </div>
      )}
      
      {/* Content Preview */}
      <div 
        className={`px-6 py-4 bg-[#16181c] border border-white/10 ${platform !== "default" ? 'rounded-b-lg' : 'rounded-lg'}`}
      >
        {isOverLimit && platform !== "default" ? (
          <div>
            <div 
              className="prose prose-invert max-w-full"
              dangerouslySetInnerHTML={{ __html: marked(formattedContent) }}
            />
            <div className="mt-3 py-2 px-3 bg-red-500/10 border border-red-500/30 rounded-md text-sm">
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
              <div className="font-medium text-lg">
                <div 
                  className="prose prose-invert max-w-full"
                  dangerouslySetInnerHTML={{ __html: marked(formattedContent) }}
                />
              </div>
            ) : platform === "linkedin" ? (
              <div>
                <div 
                  className="prose prose-invert max-w-full"
                  dangerouslySetInnerHTML={{ __html: marked(formattedContent) }}
                />
              </div>
            ) : platform === "facebook" ? (
              <div>
                <div 
                  className="prose prose-invert max-w-full"
                  dangerouslySetInnerHTML={{ __html: marked(formattedContent) }}
                />
              </div>
            ) : (
              <div 
                className="prose prose-invert max-w-full"
                dangerouslySetInnerHTML={createMarkup()}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasPreview;
