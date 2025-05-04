
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import ContentCreationOption from "./ContentCreationOption";
import { cn } from "@/lib/utils";

interface ContentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptionSelect: (option: string) => void;
}

const ContentCreationModal: React.FC<ContentCreationModalProps> = ({
  isOpen,
  onClose,
  onOptionSelect,
}) => {
  const creationOptions = [
    {
      id: "generate-text",
      title: "Generate from text",
      description: "Turn any text into a post",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
          <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: "generate-voice",
      title: "Generate from voice",
      description: "Record voice memo",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
          <path d="M12 14C13.6569 14 15 12.6569 15 11V5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5V11C9 12.6569 10.3431 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 11C19 14.866 15.866 18 12 18M12 18C8.13401 18 5 14.866 5 11M12 18V22M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: "idea-generation",
      title: "Idea generation",
      description: "Find content inspiration",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
          <path d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: "blank-canvas",
      title: "Blank Canvas",
      description: "Start a post from scratch",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: "upload-file",
      title: "Upload file to content",
      description: "Upload audio, video, or text",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
          <path d="M7 16C4.79086 16 3 14.2091 3 12C3 9.79086 4.79086 8 7 8C7.11511 8 7.22873 8.00471 7.34062 8.01391C7.75658 5.66968 9.82393 4 12.1993 4C14.6112 4 16.7072 5.7499 17.0928 8.0518C19.2772 8.1958 21 10.0277 21 12.2543C21 14.5431 19.1982 16.4121 16.9217 16.4965M12 12V21M12 21L9 18M12 21L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: "youtube-content",
      title: "YouTube to content",
      description: "Turn YouTube videos into content",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
          <path d="M22.5401 6.42C22.4213 5.94541 22.1794 5.51057 21.8387 5.15941C21.4981 4.80824 21.0708 4.55318 20.6001 4.42C18.8801 4 12.0001 4 12.0001 4C12.0001 4 5.12008 4 3.40008 4.46C2.92933 4.59318 2.50206 4.84824 2.16143 5.19941C1.8208 5.55057 1.57887 5.98541 1.46008 6.46C1.14579 8.20556 0.991716 9.97631 1.00008 11.75C0.988758 13.537 1.14285 15.3213 1.46008 17.08C1.59104 17.5398 1.83839 17.9581 2.17823 18.2945C2.51806 18.6308 2.9389 18.8738 3.40008 19C5.12008 19.46 12.0001 19.46 12.0001 19.46C12.0001 19.46 18.8801 19.46 20.6001 19C21.0708 18.8668 21.4981 18.6118 21.8387 18.2606C22.1794 17.9094 22.4213 17.4746 22.5401 17C22.8524 15.2676 23.0064 13.5103 23.0001 11.75C23.0114 9.96295 22.8573 8.1787 22.5401 6.42Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.75 15.02L15.5 11.75L9.75 8.48001V15.02Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: "content-interview",
      title: "Content interview",
      description: "Turn conversations into content",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-400">
          <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-black border border-white/10 text-white p-0 max-h-[90vh] overflow-y-auto">
        <div className="border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Choose how you want to create posts</h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-white/70 text-sm mb-3">Create one post</h3>
            <div className="space-y-2">
              {creationOptions.slice(0, 4).map((option) => (
                <ContentCreationOption
                  key={option.id}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  onClick={() => onOptionSelect(option.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white/70 text-sm mb-3">Create many posts from input</h3>
            <div className="space-y-2">
              {creationOptions.slice(4).map((option) => (
                <ContentCreationOption
                  key={option.id}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  onClick={() => onOptionSelect(option.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentCreationModal;
