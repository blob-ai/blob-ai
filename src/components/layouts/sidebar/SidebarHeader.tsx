import React from 'react';
import { TextShimmer } from "@/components/ui/text-shimmer";
import { PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarHeader: React.FC = () => {
  return (
    <div className="flex flex-col px-4 pt-5 pb-1">
      <h2 className="text-lg font-bold px-1 mb-7">
        <TextShimmer 
          duration={5}
          className="[--base-color:theme(colors.primary.600)] [--base-gradient-color:theme(colors.primary.400)]"
        >
          inspire.me
        </TextShimmer>
      </h2>

      <button
        className={cn(
          "group relative flex items-center justify-center gap-2.5 w-full",
          "h-10 py-2 px-4 rounded-full",
          "bg-[#3260ea] hover:bg-[#5078F3]",
          "text-[15px] font-medium text-white",
          "transition-all duration-150",
          "focus:outline-none focus:ring-1 focus:ring-blue-300"
        )}
        aria-label="Create new post"
      >
        <span className="inline-flex items-center justify-center text-white">
          <PenLine className="h-[18px] w-[18px]" />
        </span>
        <span>Create posts</span>
      </button>
    </div>
  );
};

export default SidebarHeader;
