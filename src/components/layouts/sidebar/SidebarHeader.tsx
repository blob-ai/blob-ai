
import React from 'react';
import { TextShimmer } from "@/components/ui/text-shimmer";
import { PenLine, PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import ContentCreationModal from '@/components/content/ContentCreationModal';
import { toast } from 'sonner';
import { useSidebar } from "@/components/layouts/SidebarProvider";
import { Button } from "@/components/ui/button";

const SidebarHeader: React.FC = () => {
  const navigate = useNavigate();
  const [showCreationModal, setShowCreationModal] = React.useState(false);
  const { toggleSidebar } = useSidebar();

  const handleOptionSelect = (option: string) => {
    setShowCreationModal(false);
    
    if (option === "idea-generation") {
      navigate('/dashboard/content?step=theme');
    } else if (option === "blank-canvas") {
      navigate('/dashboard/content?step=canvas');
    } else {
      // Handle other options by showing a notification for demo
      toast.info(`${option} option selected. This feature is coming soon!`);
    }
  };

  return (
    <div className="flex flex-col px-4 pt-5 pb-1">
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-lg font-bold px-1">
          <TextShimmer 
            duration={5}
            className="[--base-color:theme(colors.primary.600)] [--base-gradient-color:theme(colors.primary.400)]"
          >
            inspire.me
          </TextShimmer>
        </h2>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 rounded-full"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <PanelLeftClose className="h-5 w-5" />
        </Button>
      </div>

      <button
        className={cn(
          "group relative flex items-center justify-center gap-2.5 w-full",
          "h-10 py-2 px-4 rounded-full",
          "bg-[#3260ea] hover:bg-[#5078F3]",
          "text-[15px] font-medium text-white",
          "transition-all duration-150",
          "focus:outline-none focus:ring-1 focus:ring-blue-300"
        )}
        onClick={() => setShowCreationModal(true)}
        aria-label="Create new post"
      >
        <span className="inline-flex items-center justify-center text-white">
          <PenLine className="h-[18px] w-[18px]" />
        </span>
        <span>Create posts</span>
      </button>

      <ContentCreationModal
        isOpen={showCreationModal}
        onClose={() => setShowCreationModal(false)}
        onOptionSelect={handleOptionSelect}
      />
    </div>
  );
};

export default SidebarHeader;
