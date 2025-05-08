
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

interface QuickSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (style: any) => void;
}

const QuickSaveModal: React.FC<QuickSaveModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  // State for the form
  const [urlInput, setUrlInput] = useState("");
  const [comment, setComment] = useState("");
  const [content, setContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");

  // Mock function to simulate fetching content from URL
  const fetchContentFromURL = async (url: string) => {
    setIsAnalyzing(true);
    // In a real app, this would call an API to fetch the content
    // For now, we'll simulate a delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock content based on URL
    const mockContent = url.includes("twitter") || url.includes("x.com")
      ? "The 3 types of leverage:\n\n1. Money\n2. People\n3. Technology"
      : "If you aren't willing to be mocked, you'll never be original enough.";
    
    setContent(mockContent);
    
    // Generate mock title and tags based on content
    const mockTitle = url.includes("twitter") || url.includes("x.com")
      ? "Business Growth Tactics from Alex Hormozi"
      : "Naval's Wisdom on Originality";
    
    setTitle(mockTitle);
    
    const mockTags = url.includes("twitter") || url.includes("x.com")
      ? ["Bold", "Listicle", "Strategic"]
      : ["Thoughtful", "Direct", "Philosophical"];
    
    setSuggestedTags(mockTags);
    setIsAnalyzing(false);
  };

  // Handle file upload for OCR
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setIsAnalyzing(true);
      
      // In a real app, this would send the file to an OCR service
      // For now, we'll simulate a delay and return mock data
      setTimeout(() => {
        setContent("Tech isn't just about features, it's about how those features change our lives.");
        setTitle("Tech Commentary on User Experience");
        setSuggestedTags(["Analytical", "Clear", "Opinionated"]);
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  // Save the inspiration
  const handleSave = () => {
    const newInspiration = {
      id: uuidv4(),
      name: title || "Untitled Inspiration",
      creatorName: "Unknown Creator",
      creatorHandle: "",
      creatorAvatar: "",
      description: comment || "Saved inspiration",
      tone: suggestedTags,
      example: content,
      date: new Date().toISOString().split('T')[0],
      isFavorite: false,
      isPinned: false,
      folder: "Inspirations",
      isTemplate: false,
      source: "user" as const,
      isSavedInspiration: true
    };
    
    onSave(newInspiration);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setUrlInput("");
    setComment("");
    setContent("");
    setUploadedFile(null);
    setSuggestedTags([]);
    setTitle("");
  };

  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
  };

  const handleFetchContent = () => {
    if (urlInput.trim()) {
      fetchContentFromURL(urlInput);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSuggestedTags(suggestedTags.filter(t => t !== tag));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      if (!suggestedTags.includes(e.currentTarget.value.trim()) && suggestedTags.length < 5) {
        setSuggestedTags([...suggestedTags, e.currentTarget.value.trim()]);
        e.currentTarget.value = '';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-[#1A1F2C] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Save Inspiration</DialogTitle>
          <DialogDescription className="text-white/70">
            Quickly save writing that inspires you for future reference.
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
          
          {isAnalyzing && (
            <div className="p-3 bg-white/5 rounded-lg flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary-400" />
              <span className="text-white/70">Analyzing content...</span>
            </div>
          )}
          
          {content && !isAnalyzing && (
            <CardContainer className="bg-black/30 border-white/10 p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-white/70 mb-1 block">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-black/20 border-white/10"
                  placeholder="Give this inspiration a title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-white/70 mb-1 block">Content Preview</label>
                <ScrollArea className="h-24 w-full rounded-md border border-white/10 p-3 bg-black/20">
                  <div className="whitespace-pre-wrap">{content}</div>
                </ScrollArea>
              </div>
              
              <div>
                <label className="text-sm font-medium text-white/70 mb-1 block">Tags (up to 5)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {suggestedTags.map((tag) => (
                    <Badge 
                      key={tag}
                      className="bg-primary-500/20 text-primary-400 border-none flex items-center"
                    >
                      {tag}
                      <X 
                        className="ml-1 h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <Input
                  className="bg-black/20 border-white/10"
                  placeholder="Type and press Enter to add tags"
                  onKeyDown={handleAddTag}
                  disabled={suggestedTags.length >= 5}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-white/70 mb-1 block">Why did you save this? (optional)</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
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
            disabled={!content || isAnalyzing}
            onClick={handleSave}
            className={`bg-primary-500 hover:bg-primary-600 ${
              !content || isAnalyzing ? "opacity-50" : ""
            }`}
          >
            Save Inspiration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSaveModal;
