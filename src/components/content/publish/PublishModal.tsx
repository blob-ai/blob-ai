
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Calendar, Clock } from "lucide-react";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onPublish: () => void;
  onConnectPlatform: (platform: string) => void;
}

const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  content,
  onPublish,
  onConnectPlatform,
}) => {
  // Mock data
  const previewData = {
    author: {
      name: "Your Name",
      credential: "Your Credentials",
      avatar: "/placeholder.svg",
    },
    engagement: {
      comments: 47,
      likes: 251,
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-black border border-white/10 text-white p-0 max-h-[90vh] overflow-y-auto">
        <div className="border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Publish post</h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white rounded-full p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-700">
              <img 
                src={previewData.author.avatar} 
                alt={previewData.author.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{previewData.author.name}</div>
              <div className="text-xs text-white/60">{previewData.author.credential}</div>
              <div className="text-xs text-white/60">23 minutes ago</div>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none text-sm">
            {content.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            
            {content.length > 280 && (
              <button className="text-white/60 hover:text-white/80 text-sm">
                ... show less
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-white/60 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1">
              <span>🔥</span>
              <span>Max Müller and {previewData.engagement.likes} other people</span>
            </div>
            <div>{previewData.engagement.comments} Comments</div>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-500 py-6 flex gap-2 items-center justify-center"
            onClick={() => onConnectPlatform('linkedin')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Connect Scripe with LinkedIn to post
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 bg-transparent border-white/10 hover:bg-white/5 py-5 flex gap-2 items-center justify-center"
            >
              <Calendar className="h-4 w-4" />
              Schedule date
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 bg-transparent border-white/10 hover:bg-white/5 py-5 flex gap-2 items-center justify-center"
            >
              <Clock className="h-4 w-4" />
              Set time
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishModal;
