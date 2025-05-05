
import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResizablePanelsWrapperProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialLeftSize?: number;
  initialRightSize?: number;
  collapsible?: boolean;
}

const ResizablePanelsWrapper: React.FC<ResizablePanelsWrapperProps> = ({
  leftPanel,
  rightPanel,
  initialLeftSize = 25,
  initialRightSize = 75,
  collapsible = true,
}) => {
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [leftPanelSize, setLeftPanelSize] = useState(initialLeftSize);
  
  const toggleLeftPanel = () => {
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
  };

  const handleResizeEnd = (sizes: number[]) => {
    setLeftPanelSize(sizes[0]);
  };

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full rounded-lg"
        onLayout={handleResizeEnd}
      >
        <ResizablePanel 
          defaultSize={initialLeftSize} 
          minSize={15}
          maxSize={50}
          className={cn(
            "transition-all duration-300 ease-in-out",
            isLeftPanelCollapsed ? "w-0 p-0 m-0 overflow-hidden" : ""
          )}
        >
          {leftPanel}
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={initialRightSize}>
          {rightPanel}
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {collapsible && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-white/10 bg-black shadow-md hover:bg-black/80"
          onClick={toggleLeftPanel}
        >
          {isLeftPanelCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
};

export default ResizablePanelsWrapper;
