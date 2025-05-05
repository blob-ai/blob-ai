
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ActionButton } from "@/components/ui/action-button";
import { 
  Image, 
  Eye,
  EyeOff, 
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
  List
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
    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#16181c]">
      {/* Left side: Formatting and Content Tools */}
      <div className="flex items-center gap-2">
        {/* Group 1: Basic Formatting */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/5 px-2"
            onClick={() => onFormat('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/5 px-2"
            onClick={() => onFormat('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/5 px-2"
            onClick={() => onFormat('underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/5 px-2"
            onClick={() => onFormat('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-2" />
        
        {/* Group 2: Content Operations */}
        <div className="flex items-center gap-2">
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
        </div>
        
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-2" />
        
        {/* Group 3: AI Toggle */}
        <Button
          variant="outline"
          size="sm"
          className="border-white/10 hover:bg-white/5 flex items-center gap-1.5"
          onClick={onToggleChatPanel}
        >
          {showChatPanel ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span className="text-sm">Hide AI</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span className="text-sm">Show AI</span>
            </>
          )}
        </Button>
        
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-2" />
        
        {/* Group 4: Tools */}
        <div className="flex items-center gap-2">
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
      </div>
      
      {/* Right side: Saving and Publishing */}
      <div className="flex items-center gap-3">
        <div className="text-xs text-white/50 mr-1">
          {isSaving ? (
            <span>Saving...</span>
          ) : lastSaved ? (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          ) : null}
        </div>

        <ActionButton 
          variant="outline"
          size="sm" 
          icon={<Save className="h-4 w-4" />}
          label="Save Draft"
          className="border-white/10 hover:bg-white/5"
          onClick={handleAutoSave}
        />
        
        <ActionButton 
          variant="outline"
          size="sm"
          icon={<Calendar className="h-4 w-4" />}
          label="Schedule"
          className="border-white/10 hover:bg-white/5"
          onClick={() => onSchedule(content, new Date())}
        />
        
        <Button 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-500 px-4"
          onClick={() => onPublish(content)}
        >
          Publish
        </Button>
      </div>
    </div>
  );
};

export default CanvasToolbar;
