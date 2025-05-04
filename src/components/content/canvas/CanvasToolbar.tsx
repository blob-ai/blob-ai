
import React from "react";
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
  Facebook
} from "lucide-react";
import ContentEditingToolbar from "./ContentEditingToolbar";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center gap-4">
        <ContentEditingToolbar
          onSelect={() => {}}
          onFormat={onFormat}
          isFloating={false}
        />
        
        <div className="h-5 border-r border-white/10"></div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white hover:bg-white/5"
          onClick={() => {
            toast.info("Image upload feature coming soon");
          }}
        >
          <Image className="h-4 w-4 mr-1" />
          <span className="text-sm">Add Image</span>
        </Button>
        
        {/* Platform View Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              {platformIcons[currentPlatformView]}
              <span className="text-sm ml-1">{platformLabels[currentPlatformView]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-[#16181c] border border-white/10 text-white">
            <DropdownMenuLabel>Select Platform View</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer hover:bg-white/5"
              onClick={() => {
                onChangePlatformView("default");
                onToggleMobileView();
              }}
            >
              <Eye className="h-4 w-4" /> Standard Preview
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer hover:bg-white/5"
              onClick={() => {
                onChangePlatformView("twitter");
                onToggleMobileView();
              }}
            >
              <Twitter className="h-4 w-4" /> Twitter
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer hover:bg-white/5"
              onClick={() => {
                onChangePlatformView("linkedin");
                onToggleMobileView();
              }}
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer hover:bg-white/5"
              onClick={() => {
                onChangePlatformView("facebook");
                onToggleMobileView();
              }}
            >
              <Facebook className="h-4 w-4" /> Facebook
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/5"
          onClick={onToggleChatPanel}
        >
          {showChatPanel ? (
            <span className="text-sm">Hide AI</span>
          ) : (
            <span className="text-sm">Show AI</span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/5"
          onClick={onToggleHistory}
        >
          <History className="h-4 w-4 mr-1" />
          <span className="text-sm">History</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/5"
          onClick={onShowKeyboardShortcuts}
        >
          <Keyboard className="h-4 w-4 mr-1" />
          <span className="text-sm">Shortcuts</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-xs text-white/50 mr-2">
          {isSaving ? (
            <span>Saving...</span>
          ) : lastSaved ? (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          ) : null}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="border-white/10 hover:bg-white/5"
          onClick={handleAutoSave}
        >
          <Save className="h-4 w-4 mr-1" />
          <span className="text-sm">Save Draft</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="border-white/10 hover:bg-white/5"
          onClick={() => onSchedule(content, new Date())}
        >
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">Schedule</span>
        </Button>
        
        <Button 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-500"
          onClick={() => onPublish(content)}
        >
          Publish
        </Button>
      </div>
    </div>
  );
};

export default CanvasToolbar;
