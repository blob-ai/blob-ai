
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

  // Format options for the toolbar
  const formatOptions = [
    { id: "bold", icon: <Bold className="h-4 w-4" /> },
    { id: "italic", icon: <Italic className="h-4 w-4" /> },
    { id: "underline", icon: <Underline className="h-4 w-4" /> },
    { id: "list", icon: <List className="h-4 w-4" /> },
  ];

  return (
    <div className="flex items-center justify-between p-3 border-b border-white/10 bg-[#0a0b0e]">
      <div className="flex items-center space-x-2">
        {/* Group 1: Text Formatting Options */}
        <div className="flex items-center">
          {formatOptions.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/5 h-8 px-2.5"
              onClick={() => onFormat(option.id)}
              title={option.id.charAt(0).toUpperCase() + option.id.slice(1)}
            >
              {option.icon}
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-white/10" />
        
        {/* Group 2: Content Operations */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white hover:bg-white/5 h-8"
          onClick={() => {
            toast.info("Image upload feature coming soon");
          }}
        >
          <Image className="h-4 w-4 mr-1" />
          <span className="text-sm">Image</span>
        </Button>
        
        {/* Platform View Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/70 hover:text-white hover:bg-white/5 h-8"
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
        
        <Separator orientation="vertical" className="h-6 mx-2 bg-white/10" />
        
        {/* Group 3: AI Assistant Toggle - More prominent */}
        <Button
          variant={showChatPanel ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-8",
            showChatPanel 
              ? "bg-blue-600 hover:bg-blue-500 text-white" 
              : "border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
          )}
          onClick={onToggleChatPanel}
        >
          {showChatPanel ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              <span className="text-sm">Hide AI</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-sm">Show AI</span>
            </>
          )}
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-2 bg-white/10" />
        
        {/* Group 4: Tools */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/5 h-8"
          onClick={onToggleHistory}
        >
          <History className="h-4 w-4 mr-1" />
          <span className="text-sm">History</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/5 h-8"
          onClick={onShowKeyboardShortcuts}
        >
          <Keyboard className="h-4 w-4 mr-1" />
          <span className="text-sm">Shortcuts</span>
        </Button>
      </div>
      
      {/* Group 5: Save, Schedule, Publish - Right Side */}
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
          className="border-white/10 hover:bg-white/5 h-8"
          icon={<Save className="h-4 w-4" />}
          label="Save Draft"
          onClick={handleAutoSave}
        />
        
        <ActionButton 
          variant="outline" 
          size="sm" 
          className="border-white/10 hover:bg-white/5 h-8"
          icon={<Calendar className="h-4 w-4" />}
          label="Schedule"
          onClick={() => onSchedule(content, new Date())}
        />
        
        <ActionButton 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-500 text-white h-8 px-5"
          label="Publish"
          onClick={() => onPublish(content)}
        />
      </div>
    </div>
  );
};

export default CanvasToolbar;
