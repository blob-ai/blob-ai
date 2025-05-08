
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Smartphone, Tablet, Monitor, Twitter, Linkedin, Facebook } from "lucide-react";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

type PlatformType = "twitter" | "linkedin" | "facebook";
type DeviceType = "mobile" | "tablet" | "desktop";

const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("twitter");
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("desktop");
  const isMobile = useIsMobile();
  const [layout, setLayout] = useState<"horizontal" | "vertical">("horizontal");
  
  // Adjust layout based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayout("vertical");
      } else {
        setLayout("horizontal");
      }
    };
    
    handleResize(); // Set initial layout
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Platform-specific character limits
  const characterLimits = {
    twitter: 280,
    linkedin: 3000,
    facebook: 63206,
  };

  const charCount = content.length;
  const currentLimit = characterLimits[selectedPlatform];
  const isOverLimit = charCount > currentLimit;

  const platformLabels = {
    twitter: "Twitter / X",
    linkedin: "LinkedIn",
    facebook: "Facebook",
  };

  // Helper function to render markdown content
  const renderContent = () => {
    return { __html: marked(content) };
  };

  // Helper function to get platform icon
  const getPlatformIcon = (platform: PlatformType, active: boolean = false) => {
    const className = `h-5 w-5 ${active ? "text-white" : "text-white/60"}`;
    
    switch (platform) {
      case "twitter":
        return <Twitter className={className} />;
      case "linkedin":
        return <Linkedin className={className} />;
      case "facebook":
        return <Facebook className={className} />;
    }
  };

  // Get device-specific width classes
  const getDevicePreviewClasses = () => {
    switch (selectedDevice) {
      case "mobile":
        return "max-w-[320px] w-full";
      case "tablet":
        return "max-w-[600px] w-full";
      case "desktop":
        return "w-full max-w-[100%]";
      default:
        return "w-full";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-5xl xl:max-w-6xl p-0 bg-[#121212] border border-white/10 text-white overflow-hidden h-[90vh] max-h-[90vh]">
        <div className="border-b border-white/10 p-3 md:p-4 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold">Content Preview</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/70 hover:text-white rounded-full" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Platform and device selector */}
        <div className="border-b border-white/10 p-3 md:p-4 flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {(["twitter", "linkedin", "facebook"] as PlatformType[]).map((platform) => (
              <Button
                key={platform}
                variant={selectedPlatform === platform ? "default" : "outline"}
                size={isMobile ? "sm" : "default"}
                className={cn(
                  "flex items-center gap-1 sm:gap-2 flex-shrink-0", 
                  selectedPlatform === platform 
                    ? "bg-blue-600 hover:bg-blue-500 text-white" 
                    : "bg-transparent border-white/10 hover:bg-white/5 text-white/70"
                )}
                onClick={() => setSelectedPlatform(platform)}
              >
                {getPlatformIcon(platform, selectedPlatform === platform)}
                <span className={cn(isMobile ? "text-xs" : "text-sm")}>{platformLabels[platform]}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={selectedDevice === "mobile" ? "default" : "outline"}
              size="icon"
              className={cn(
                "rounded-full", 
                selectedDevice === "mobile" 
                  ? "bg-blue-600 hover:bg-blue-500" 
                  : "bg-transparent border-white/10 hover:bg-white/5"
              )}
              onClick={() => setSelectedDevice("mobile")}
              title="Mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={selectedDevice === "tablet" ? "default" : "outline"}
              size="icon"
              className={cn(
                "rounded-full", 
                selectedDevice === "tablet" 
                  ? "bg-blue-600 hover:bg-blue-500" 
                  : "bg-transparent border-white/10 hover:bg-white/5"
              )}
              onClick={() => setSelectedDevice("tablet")}
              title="Tablet view"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={selectedDevice === "desktop" ? "default" : "outline"}
              size="icon"
              className={cn(
                "rounded-full", 
                selectedDevice === "desktop" 
                  ? "bg-blue-600 hover:bg-blue-500" 
                  : "bg-transparent border-white/10 hover:bg-white/5"
              )}
              onClick={() => setSelectedDevice("desktop")}
              title="Desktop view"
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className={cn(
          "flex h-full overflow-hidden", 
          layout === "horizontal" ? "flex-row" : "flex-col"
        )}>
          {/* Original content */}
          <div className={cn(
            "p-4 overflow-y-auto bg-[#0a0b0e] border-white/10",
            layout === "horizontal" 
              ? "w-1/2 border-r" 
              : "w-full h-1/2 border-b"
          )}>
            <h3 className="text-base md:text-lg font-medium mb-4 text-white/80">Original Content</h3>
            <div className="whitespace-pre-wrap">{content}</div>
          </div>
          
          {/* Platform preview */}
          <div className={cn(
            "p-4 overflow-y-auto",
            layout === "horizontal" ? "w-1/2" : "w-full h-1/2"
          )}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base md:text-lg font-medium text-white/80">{platformLabels[selectedPlatform]} Preview</h3>
              <div className={`text-xs sm:text-sm ${isOverLimit ? 'text-red-500' : 'text-white/60'}`}>
                {charCount}/{currentLimit} characters
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className={cn(getDevicePreviewClasses(), "mx-auto")}>
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  {/* Platform header */}
                  <div className="py-2 px-3 md:py-3 md:px-4 border-b border-white/10 bg-black/40 flex items-center gap-2">
                    {getPlatformIcon(selectedPlatform)}
                    <span className="font-medium text-sm md:text-base">{platformLabels[selectedPlatform]}</span>
                  </div>
                  
                  {/* Profile bar - simplified version */}
                  <div className="flex items-center gap-3 p-3 md:p-4 border-b border-white/10">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/20"></div>
                    <div>
                      <div className="font-medium text-sm md:text-base">User Name</div>
                      <div className="text-xs md:text-sm text-white/60">@username</div>
                    </div>
                  </div>
                  
                  {/* Content preview */}
                  <div className="p-3 md:p-4">
                    {isOverLimit ? (
                      <div>
                        <div 
                          className="prose prose-invert max-w-full text-sm md:text-base"
                          dangerouslySetInnerHTML={{ __html: marked(content.substring(0, currentLimit)) }}
                        />
                        <div className="mt-3 py-2 px-3 bg-red-500/10 border border-red-500/30 rounded-md text-xs md:text-sm">
                          <span className="font-medium text-red-400">Character limit exceeded</span>
                          <p className="text-red-300/80 mt-1">
                            Your content exceeds the {platformLabels[selectedPlatform]} character limit of {currentLimit} characters. 
                            The actual post will be truncated.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="prose prose-invert max-w-full text-sm md:text-base"
                        dangerouslySetInnerHTML={renderContent()}
                      />
                    )}
                  </div>
                  
                  {/* Engagement indicators */}
                  <div className="flex items-center justify-between p-2 md:p-3 border-t border-white/10 text-xs md:text-sm text-white/60">
                    {selectedPlatform === "twitter" && (
                      <>
                        <span>💬 0</span>
                        <span>🔄 0</span>
                        <span>❤️ 0</span>
                        <span>📊 0</span>
                      </>
                    )}
                    {selectedPlatform === "linkedin" && (
                      <>
                        <span>👍 0</span>
                        <span>💭 0</span>
                        <span>🔄 0</span>
                      </>
                    )}
                    {selectedPlatform === "facebook" && (
                      <>
                        <span>👍 0</span>
                        <span>💬 0</span>
                        <span>↗️ 0</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPreviewModal;
