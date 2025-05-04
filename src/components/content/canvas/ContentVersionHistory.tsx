
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History, Clock, Undo, Redo } from "lucide-react";
import { toast } from "sonner";

export interface ContentVersion {
  id: string;
  content: string;
  timestamp: Date;
  change: string;
}

interface ContentVersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  versions: ContentVersion[];
  currentVersion: string;
  onRevert: (version: ContentVersion) => void;
}

const ContentVersionHistory: React.FC<ContentVersionHistoryProps> = ({
  isOpen,
  onClose,
  versions,
  currentVersion,
  onRevert,
}) => {
  // Calculate the relative time from now
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[380px] sm:w-[540px] bg-[#12141A] border-l border-white/10 text-white">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          {versions.length === 0 ? (
            <div className="text-white/60 text-center py-8">
              No version history available yet.
              <p className="text-sm mt-2">Changes will appear here as you edit.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {versions.map((version, index) => {
                const isCurrent = version.id === currentVersion;
                
                return (
                  <div 
                    key={version.id}
                    className={`p-3 rounded-md transition-colors ${
                      isCurrent 
                        ? "bg-blue-600/20 border border-blue-500/40" 
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {index === 0 ? "Current Version" : `Version ${versions.length - index}`}
                        </div>
                        <div className="text-sm text-white/60 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" /> 
                          {getRelativeTime(version.timestamp)}
                        </div>
                        <div className="mt-2 text-sm text-white/80">{version.change}</div>
                      </div>
                      
                      {!isCurrent && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-white/10 hover:bg-white/5"
                          onClick={() => {
                            onRevert(version);
                            toast.success("Reverted to previous version");
                          }}
                        >
                          <Undo className="h-3 w-3 mr-1" />
                          Revert
                        </Button>
                      )}
                    </div>
                    
                    <div className="mt-2 text-xs bg-black/20 border border-white/10 rounded p-2 max-h-20 overflow-y-auto">
                      {version.content.length > 150 
                        ? version.content.substring(0, 150) + "..." 
                        : version.content}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ContentVersionHistory;
