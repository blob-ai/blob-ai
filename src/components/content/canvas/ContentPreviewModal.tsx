
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Smartphone, Tablet, Monitor, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import TwitterPreview from "../preview/TwitterPreview";
import LinkedInPreview from "../preview/LinkedInPreview";
import FacebookPreview from "../preview/FacebookPreview";

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

type PlatformType = "twitter" | "linkedin" | "facebook";
type DeviceType = "mobile" | "tablet" | "desktop";
type AppearanceType = "light" | "dark";

const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("twitter");
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("desktop");
  const [appearance, setAppearance] = useState<AppearanceType>("dark");
  const isMobile = useIsMobile();
  const [layout, setLayout] = useState<"horizontal" | "vertical">("horizontal");
  
  // Mock profile info
  const profileInfo = {
    name: "John Smith",
    handle: "johnsmith",
    title: "Marketing Director at TechCorp",
    avatar: "", // Default empty will show initials
    verified: true,
    timestamp: "2h"
  };

  // Mock engagement stats
  const engagementStats = {
    likes: 24,
    comments: 5,
    shares: 3,
    views: 247
  };
  
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

  // Get device-specific width classes
  const getDevicePreviewClasses = () => {
    switch (selectedDevice) {
      case "mobile":
        return "max-w-[320px]";
      case "tablet":
        return "max-w-[600px]";
      case "desktop":
        return "w-full max-w-[100%]";
      default:
        return "w-full";
    }
  };

  // Render appropriate platform preview
  const renderPlatformPreview = () => {
    const commonProps = {
      content,
      profileInfo,
      engagementStats,
      mode: appearance,
      device: selectedDevice,
      className: getDevicePreviewClasses(),
    };

    switch (selectedPlatform) {
      case "twitter":
        return <TwitterPreview {...commonProps} />;
      case "linkedin":
        return <LinkedInPreview {...commonProps} />;
      case "facebook":
        return <FacebookPreview {...commonProps} />;
      default:
        return null;
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
        
        {/* Platform, device and mode selectors */}
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
                    ? "bg-[#3260ea] hover:bg-[#2853c6] text-white" 
                    : "bg-transparent border-white/10 hover:bg-white/5 text-white/70"
                )}
                onClick={() => setSelectedPlatform(platform)}
              >
                {platform === "twitter" && (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                )}
                {platform === "linkedin" && (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                )}
                {platform === "facebook" && (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                  </svg>
                )}
                <span className={cn(isMobile ? "text-xs" : "text-sm")}>{platformLabels[platform]}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Device selectors */}
            <Button
              variant={selectedDevice === "mobile" ? "default" : "outline"}
              size="icon"
              className={cn(
                "rounded-full", 
                selectedDevice === "mobile" 
                  ? "bg-[#3260ea] hover:bg-[#2853c6]" 
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
                  ? "bg-[#3260ea] hover:bg-[#2853c6]" 
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
                  ? "bg-[#3260ea] hover:bg-[#2853c6]" 
                  : "bg-transparent border-white/10 hover:bg-white/5"
              )}
              onClick={() => setSelectedDevice("desktop")}
              title="Desktop view"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            
            <div className="h-4 mx-1 border-r border-white/20"></div>
            
            {/* Light/Dark mode toggle */}
            <Button
              variant={appearance === "light" ? "default" : "outline"}
              size="icon"
              className={cn(
                "rounded-full", 
                appearance === "light"
                  ? "bg-[#3260ea] hover:bg-[#2853c6]" 
                  : "bg-transparent border-white/10 hover:bg-white/5"
              )}
              onClick={() => setAppearance("light")}
              title="Light mode"
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              variant={appearance === "dark" ? "default" : "outline"}
              size="icon"
              className={cn(
                "rounded-full", 
                appearance === "dark"
                  ? "bg-[#3260ea] hover:bg-[#2853c6]" 
                  : "bg-transparent border-white/10 hover:bg-white/5"
              )}
              onClick={() => setAppearance("dark")}
              title="Dark mode"
            >
              <Moon className="h-4 w-4" />
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
              <div className="mx-auto">
                {renderPlatformPreview()}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPreviewModal;
