
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { Save, X } from "lucide-react";
import { Bookmark, BookmarkType } from "@/types/bookmark";

interface QuickSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookmark: Omit<Bookmark, "id" | "user_id" | "created_at" | "updated_at">) => void;
}

const QuickSaveModal: React.FC<QuickSaveModalProps> = ({ isOpen, onClose, onSave }) => {
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [source, setSource] = useState("twitter");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNameField, setShowNameField] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Generate a default name based on content if no name is provided
    const bookmarkName = name.trim() || `Bookmark ${new Date().toLocaleDateString()}`;
    
    const bookmark = {
      title: bookmarkName,
      name: bookmarkName,
      content,
      source,
      folder: "Inspiration",
      type: "text" as BookmarkType
    };
    
    onSave(bookmark);
    
    // Reset form
    setContent("");
    setName("");
    setSource("twitter");
    setShowNameField(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#1A202C] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-[#3260ea]" />
            Save Post Inspiration
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="content" className="text-white/80">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-32 bg-[#121720] border-white/10 resize-none"
                placeholder="Paste the content you want to save..."
                required
              />
            </div>

            <div>
              <Label htmlFor="source" className="text-white/80">Source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger id="source" className="bg-[#121720] border-white/10">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A202C] border-white/10 text-white">
                  <SelectItem value="twitter">Twitter / X</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {showNameField ? (
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="name" className="text-white/80">Name</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs hover:bg-white/5"
                    onClick={() => setShowNameField(false)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Hide
                  </Button>
                </div>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#121720] border-white/10"
                  placeholder="Add a name to your bookmark..."
                />
              </div>
            ) : (
              <Button 
                type="button" 
                variant="ghost" 
                className="text-xs px-0 hover:bg-transparent hover:underline text-white/70"
                onClick={() => setShowNameField(true)}
              >
                + Add custom name (optional)
              </Button>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#3260ea] hover:bg-[#2853c6]"
              disabled={!content.trim() || isSubmitting}
            >
              Save Bookmark
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSaveModal;
