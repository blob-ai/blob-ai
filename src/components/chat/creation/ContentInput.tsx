
import React, { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X } from "lucide-react";

const emojiCategories = [
  {
    name: "Popular",
    emojis: ["✨", "🔥", "💡", "🎯", "🚀", "👀", "🤔", "😊", "😂", "🙌"],
  },
  {
    name: "Reactions",
    emojis: ["👍", "💪", "🙏", "💯", "⚡", "👏", "🎉", "💙", "❤️", "🔍"],
  },
  {
    name: "Objects",
    emojis: ["💼", "📊", "📝", "⏰", "🌟", "🏆", "💰", "📈", "💻", "📱"],
  },
];

interface ContentInputProps {
  content: string;
  setContent: (content: string) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
}

interface UploadedImage {
  name: string;
  url: string;
}

const ContentInput: React.FC<ContentInputProps> = ({ 
  content, 
  setContent, 
  showEmojiPicker,
  setShowEmojiPicker 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emoji: string) => {
    if (textareaRef.current) {
      const startPos = textareaRef.current.selectionStart || 0;
      const endPos = textareaRef.current.selectionEnd || 0;
      const newText = content.substring(0, startPos) + emoji + content.substring(endPos);
      setContent(newText);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPosition = startPos + emoji.length;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    } else {
      setContent(content + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    const newImage = { name: file.name, url: imageUrl };
    setUploadedImages(prev => [...prev, newImage]);
    setContent(content + `\n[Image: ${file.name}]\n`);
    toast.success(`Uploaded ${file.name}`);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].url);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <div className="relative font-sans">
      <Textarea
        ref={textareaRef}
        placeholder="Describe your content here"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-32 bg-[#262d3f] border-white/10 text-white placeholder:text-gray-500 text-lg resize-none focus-visible:ring-1 focus-visible:ring-[#4a72f5] focus-visible:ring-offset-0 p-3 font-sans rounded-md"
      />
      
      {uploadedImages.length > 0 && (
        <div className="mt-2 mb-4">
          <div className="grid grid-cols-3 gap-2">
            {uploadedImages.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-24 object-cover rounded-md border border-white/10"
                />
                <button 
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="text-xs text-white/70 truncate mt-1">{img.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageUpload(file);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }
        }}
      />
    </div>
  );
};

export default ContentInput;
