
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ChevronDown, ChevronUp, Pencil, BookmarkCheck } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { SaveSetupModal } from "./creation/SaveSetupModal";
import { toast } from "@/hooks/use-toast";

interface ContentPreviewCardProps {
  title: string;
  content: string;
  examples?: { name: string; content: string }[];
  goal?: string;
  format?: string;
  hook?: string;
  tone?: string;
  onEdit: () => void;
  onSaveSetup?: (name: string) => void;
}

const ContentPreviewCard: React.FC<ContentPreviewCardProps> = ({
  title,
  content,
  examples = [],
  goal,
  format,
  hook,
  tone,
  onEdit,
  onSaveSetup,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to clipboard",
    });
  };

  const handleSaveSetup = () => {
    setIsSaveModalOpen(true);
  };

  const handleSaveComplete = (name: string) => {
    if (onSaveSetup) {
      onSaveSetup(name);
      toast({
        title: "Setup Saved",
        description: `"${name}" has been saved to your setups`,
      });
    }
  };

  return (
    <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-white/5 mb-2">
      <div className="p-4 bg-[#121212] space-y-4">
        {/* User profile and content */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-8 w-8">
            <div className="bg-gray-700 h-full w-full rounded-full flex items-center justify-center text-white">
              U
            </div>
          </Avatar>
          <span className="font-medium font-sans">User</span>
        </div>

        <div className="text-white whitespace-pre-wrap font-sans">{content}</div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="p-4 bg-[#0F0F0F] space-y-4 border-t border-white/5">
          {examples && examples.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 font-sans">Examples:</p>
              {examples.map((example, index) => (
                <div key={index} className="mb-2 p-3 bg-[#1A1A1A] rounded-md">
                  <p className="text-sm text-white/70 font-sans">{example.name}</p>
                  <p className="text-sm font-sans">{example.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {goal && (
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm mr-2 font-sans">Goal:</span>
                <span className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded font-sans">
                  {goal}
                </span>
              </div>
            )}

            {format && (
              <div className="flex items-center">
                <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-sm mr-2 font-sans">Format:</span>
                <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-sans">
                  {format}
                </span>
              </div>
            )}
            
            {hook && (
              <div className="flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm mr-2 font-sans">Hook:</span>
                <span className="text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded font-sans">
                  {hook}
                </span>
              </div>
            )}
            
            {tone && (
              <div className="flex items-center">
                <div className="h-2 w-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm mr-2 font-sans">Tone:</span>
                <span className="text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded font-sans">
                  {tone}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-3 border-t border-white/5 bg-[#0F0F0F] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-transparent"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-transparent"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-[#60a5fa] hover:text-[#60a5fa]/80 hover:bg-transparent font-sans"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            View Setup {isExpanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </Button>

          {isExpanded && onSaveSetup && (
            <Button
              variant="outline"
              className="text-[#60a5fa] border-[#4169E1]/20 hover:bg-[#4169E1]/10 font-sans flex items-center gap-1"
              onClick={handleSaveSetup}
            >
              <BookmarkCheck className="h-4 w-4" />
              Save Setup
            </Button>
          )}
        </div>
      </div>

      {/* Save Setup Modal */}
      <SaveSetupModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveComplete}
        defaultValue={title}
      />
    </div>
  );
};

export default ContentPreviewCard;
