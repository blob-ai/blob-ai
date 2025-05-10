
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Link, Image, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContainer } from "@/components/ui/card-container";
import { v4 as uuidv4 } from "uuid";
import { Bookmark, BookmarkType } from "@/types/bookmark";

interface QuickSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookmark: Omit<Bookmark, "id" | "user_id" | "created_at" | "updated_at">) => void;
}

const QuickSaveModal: React.FC<QuickSaveModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  // State for the form
  const [urlInput, setUrlInput] = useState("");
  const [notes, setNotes] = useState("");
  const [content, setContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [title, setTitle] = useState("");
  const [bookmarkType, setBookmarkType] = useState<BookmarkType>("link");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Mock function to simulate fetching content from URL
  const fetchContentFromURL = async (url: string) => {
    setIsAnalyzing(true);
    setBookmarkType("link");
    
    // In a real app, this would call an API to fetch the content
    // For now, we'll simulate a delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock content based on URL
    const mockContent = url.includes("twitter") || url.includes("x.com")
      ? "The 3 types of leverage:\n\n1. Money\n2. People\n3. Technology"
      : "If you aren't willing to be mocked, you'll never be original enough.";
    
    setContent(mockContent);
    
    // Generate mock title based on content
    const mockTitle = url.includes("twitter") || url.includes("x.com")
      ? "Business Growth Tactics from Alex Hormozi"
      : "Naval's Wisdom on Originality";
    
    setTitle(mockTitle);
    setIsAnalyzing(false);
  };

  // Handle file upload for OCR
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setBookmarkType("screenshot");
      setIsAnalyzing(true);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // In a real app, this would send the file to an OCR service
      setTimeout(() => {
        setTitle("Tech Commentary on User Experience");
        setIsAnalyzing(false);
      }, 1500);
    }
  };

  // Handle direct text entry
  const handleTextInput = (text: string) => {
    if (text.trim()) {
      setContent(text);
      setBookmarkType("text");
    }
  };

  // Save the bookmark
  const handleSave = () => {
    const newBookmark: Omit<Bookmark, "id" | "user_id" | "created_at" | "updated_at"> = {
      title: title || "Untitled Bookmark",
      content: content,
      type: bookmarkType,
      notes: notes,
      source_url: bookmarkType === "link" ? urlInput : undefined,
      image_url: imagePreview || undefined,
      updated_at: new Date().toISOString()
    };
    
    onSave(newBookmark);
    resetForm();
  };

  const resetForm = () => {
    setUrlInput("");
    setNotes("");
    setContent("");
    setUploadedFile(null);
    setImagePreview(null);
    setTitle("");
    setBookmarkType("link");
    setIsAnalyzing(false);
  };

  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
  };

  const handleFetchContent = () => {
    if (urlInput.trim()) {
      fetchContentFromURL(urlInput);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-[#1A1F2C] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Save Bookmark</DialogTitle>
          <DialogDescription className="text-white/70">
            Quickly bookmark content that inspires you for future reference.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Paste a link to content</label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Paste a tweet or post URL"
                  className="pl-10 bg-black/20 border-white/10"
                  value={urlInput}
                  onChange={handleURLChange}
                />
              </div>
              <Button
                onClick={handleFetchContent}
                variant="outline"
                className="bg-transparent border-white/20"
              >
                Fetch
              </Button>
            </div>
          </div>
          
          {/* Upload Screenshot */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Or upload a screenshot</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center bg-black/20">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="screenshot-upload"
              />
              <label
                htmlFor="screenshot-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <Image className="h-8 w-8 text-white/50" />
                <span className="text-sm text-white/50">
                  Drop image or click to upload
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/20"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Screenshot
                </Button>
              </label>
              {uploadedFile && (
                <div className="mt-2 text-sm text-primary-400">
                  {uploadedFile.name} uploaded
                </div>
              )}
            </div>
          </div>
          
          {/* Or enter text directly */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Or directly enter text</label>
            <Textarea
              placeholder="Type or paste content here..."
              className="bg-black/20 border-white/10 min-h-[100px]"
              value={content}
              onChange={(e) => {
                handleTextInput(e.target.value);
                setContent(e.target.value);
              }}
            />
          </div>
          
          {isAnalyzing && (
            <div className="p-3 bg-white/5 rounded-lg flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary-400" />
              <span className="text-white/70">Analyzing content...</span>
            </div>
          )}
          
          {(content || imagePreview) && !isAnalyzing && (
            <CardContainer className="bg-black/30 border-white/10 p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-white/70 mb-1 block">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-black/20 border-white/10"
                  placeholder="Give this bookmark a title"
                />
              </div>
              
              {imagePreview && (
                <div className="relative">
                  <label className="text-sm font-medium text-white/70 mb-1 block">Preview</label>
                  <div className="h-48 overflow-hidden rounded-md">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-white/70 mb-1 block">Notes (optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add a note about why this inspired you..."
                  className="bg-black/20 border-white/10 min-h-[80px]"
                />
              </div>
            </CardContainer>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent border-white/20"
          >
            Cancel
          </Button>
          <Button
            disabled={(!content && !imagePreview) || isAnalyzing}
            onClick={handleSave}
            className={`bg-primary-500 hover:bg-primary-600 ${
              (!content && !imagePreview) || isAnalyzing ? "opacity-50" : ""
            }`}
          >
            Save Bookmark
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSaveModal;
