
import React from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor } from "lucide-react";

interface ContentPreviewProps {
  content: string;
  viewMode: "desktop" | "mobile";
  onViewModeChange: (mode: "desktop" | "mobile") => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  content,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-sm font-medium">Preview</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 ${viewMode === "desktop" ? "bg-white/10" : ""}`}
            onClick={() => onViewModeChange("desktop")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 ${viewMode === "mobile" ? "bg-white/10" : ""}`}
            onClick={() => onViewModeChange("mobile")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div 
          className={`bg-white/5 rounded-lg mx-auto p-4 prose prose-invert max-w-none ${
            viewMode === "mobile" ? "max-w-[375px]" : "max-w-[700px]"
          }`}
        >
          <div dangerouslySetInnerHTML={{ __html: content }} />
          
          {viewMode === "mobile" && content.length > 280 && (
            <div className="text-primary-400 text-sm mt-2 cursor-pointer">
              ... see more
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;
