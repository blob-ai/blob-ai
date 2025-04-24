
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SetupModalProps } from "@/types/setup";
import { BookmarkCheck } from "lucide-react";

export function SaveSetupModal({ isOpen, onClose, onSave, defaultValue = "" }: SetupModalProps) {
  const [name, setName] = useState(defaultValue);

  const handleSave = () => {
    const trimmedName = name.trim() || `Setup ${new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })}`;
    
    onSave(trimmedName);
    setName("");
    onClose(); // Always close the modal after saving
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E2732] border-[#374151] font-sans sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle className="font-sans flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5 text-blue-400" />
            Save Setup
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            autoFocus
            placeholder="Name this strategy for future use..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-12 bg-[#1F2937] border-[#374151] focus:border-[#3B82F6] font-sans"
          />
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-[#D1D5DB] hover:text-white font-sans"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-sans"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
