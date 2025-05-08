import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Image, 
  Eye, 
  Save, 
  Calendar, 
  History, 
  Keyboard,
  Twitter,
  Linkedin,
  Facebook,
  Bold,
  Italic,
  Underline,
  List,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ActionButton } from "@/components/ui/action-button";
import { Separator } from "@/components/ui/separator";
import ContentPreviewModal from "./ContentPreviewModal";
import { useIsMobile } from "@/hooks/use-mobile";

interface CanvasToolbarProps {
  onToggleMobileView: () => void;
  onToggleChatPanel: () => void;
  showChatPanel: boolean;
  handleAutoSave: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
  onSchedule: (content: string, date: Date) => void;
  onPublish: (content: string) => void;
  content: string;
  onFormat: (format: string) => void;
  onToggleHistory: () => void;
  onShowKeyboardShortcuts: () => void;
  onChangePlatformView: (platform: "default" | "twitter" | "linkedin" | "facebook") => void;
  currentPlatformView: "default" | "twitter" | "linkedin" | "facebook";
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onToggleMobileView,
  onToggleChatPanel,
  showChatPanel,
  handleAutoSave,
  isSaving,
  lastSaved,
  onSchedule,
  onPublish,
  content,
  onFormat,
  onToggleHistory,
  onShowKeyboardShortcuts,
  onChangePlatformView,
  currentPlatformView
}) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const isMobile = useIsMobile();
  
  const platformIcons = {
    default: <Eye className="h-4 w-4" />,
    twitter: <Twitter className="h-4 w-4" />,
    linkedin: <Linkedin className="h-4 w-4" />,
    facebook: <Facebook className="h-4 w-4" />
  };
  
  const platformLabels = {
    default: "Preview",
    twitter: "Twitter",
    linkedin: "LinkedIn",
    facebook: "Facebook"
  };

  // Format options for the toolbar
  const formatOptions = [
    { id: "bold", icon: <Bold className="h-4 w-4" /> },
    { id: "italic", icon: <Italic className="h-4 w-4" /> },
    { id: "underline", icon: <Underline className="h-4 w-4" /> },
    { id: "list", icon: <List className="h-4 w-4" /> },
  ];

  return (
    <div className="flex items-center justify-between p-2 sm:p-3 border-b border-white/10 bg-[#0a0b0e] flex-wrap gap-2">
      <div className="flex items-center flex-wrap gap-1 sm:gap-2">
        {/* Group 1: Text Formatting Options */}
        <div className="flex items-center">
          {formatOptions.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/5 h-8 px-2"
              onClick={() => onFormat(option.id)}
              title={option.id.charAt(0).toUpperCase() + option.id.slice(1)}
            >
              {option.icon}
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 sm:mx-2 bg-white/10 hidden sm:block" />
        
        {/* Group 2: Content Operations */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white hover:bg-white/5 h-8 px-2 sm:px-2.5"
          onClick={() => {
            toast.info("Image upload feature coming soon");
          }}
        >
          <Image className="h-4 w-4 sm:mr-1" />
          <span className="text-xs sm:text-sm hidden sm:inline">Image</span>
        </Button>
        
        {/* Preview Button - now opens the modal */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white hover:bg-white/5 h-8 px-2 sm:px-2.5"
          onClick={() => setShowPreviewModal(true)}
        >
          <Eye className="h-4 w-4 sm:mr-1" />
          <span className="text-xs sm:text-sm hidden sm:inline">Preview</span>
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1 sm:mx-2 bg-white/10 hidden sm:block" />
        
        {/* Group 3: AI Assistant Toggle - More prominent */}
        <Button
          variant={showChatPanel ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-8 px-2 sm:px-2.5",
            showChatPanel 
              ? "bg-blue-600 hover:bg-blue-500 text-white" 
              : "border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
          )}
          onClick={onToggleChatPanel}
        >
          {showChatPanel ? (
            <>
              <EyeOff className="h-4 w-4 sm:mr-1" />
              <span className="text-xs sm:text-sm hidden sm:inline">Hide AI</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 sm:mr-1" />
              <span className="text-xs sm:text-sm hidden sm:inline">Show AI</span>
            </>
          )}
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1 sm:mx-2 bg-white/10 hidden sm:block" />
        
        {/* Group 4: Tools */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/5 h-8 px-2 sm:px-2.5"
          onClick={onToggleHistory}
        >
          <History className="h-4 w-4 sm:mr-1" />
          <span className="text-xs sm:text-sm hidden sm:inline">History</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/5 h-8 px-2 sm:px-2.5"
          onClick={onShowKeyboardShortcuts}
        >
          <Keyboard className="h-4 w-4 sm:mr-1" />
          <span className="text-xs sm:text-sm hidden sm:inline">Shortcuts</span>
        </Button>
      </div>
      
      {/* Group 5: Save, Schedule, Publish - Right Side */}
      <div className="flex items-center gap-1 sm:gap-3">
        <div className="text-xs text-white/50 mr-0 sm:mr-1 hidden sm:block">
          {isSaving ? (
            <span>Saving...</span>
          ) : lastSaved ? (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          ) : null}
        </div>

        <ActionButton 
          variant="outline" 
          size="sm" 
          className="border-white/10 hover:bg-white/5 h-8"
          icon={<Save className="h-4 w-4" />}
          label={isMobile ? "Save" : "Save Draft"}
          onClick={handleAutoSave}
        />
        
        <ActionButton 
          variant="outline" 
          size="sm" 
          className="border-white/10 hover:bg-white/5 h-8"
          icon={<Calendar className="h-4 w-4" />}
          label={isMobile ? "Schedule" : "Schedule"}
          onClick={() => onSchedule(content, new Date())}
        />
        
        <ActionButton 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-500 text-white h-8 px-3 sm:px-5"
          label="Publish"
          onClick={() => onPublish(content)}
        />
      </div>

      {/* Preview Modal */}
      <ContentPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        content={content}
      />
    </div>
  );
};

export default CanvasToolbar;
