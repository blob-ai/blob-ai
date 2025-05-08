
import React, { useState, useEffect } from "react";
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
  isLeftPanelCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const ResizablePanelsWrapper: React.FC<ResizablePanelsWrapperProps> = ({
  leftPanel,
  rightPanel,
  initialLeftSize = 25,
  initialRightSize = 75,
  collapsible = true,
  isLeftPanelCollapsed,
  onCollapseChange
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [leftPanelSize, setLeftPanelSize] = useState(initialLeftSize);
  
  // Use either controlled or uncontrolled collapse state
  const collapsed = isLeftPanelCollapsed !== undefined ? isLeftPanelCollapsed : internalCollapsed;
  
  const toggleLeftPanel = () => {
    const newState = !collapsed;
    setInternalCollapsed(newState);
    if (onCollapseChange) {
      onCollapseChange(newState);
    }
  };

  const handleResizeEnd = (sizes: number[]) => {
    setLeftPanelSize(sizes[0]);
  };
  
  // Ensure panel visibility changes are animated
  useEffect(() => {
    // Add transition class when collapse state changes
    const container = document.querySelector('.left-panel-container');
    if (container) {
      container.classList.add('transition-all', 'duration-300');
    }
  }, [collapsed]);

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      {collapsed ? (
        // Render only the right panel in full width when collapsed
        <div className="flex-1 h-full w-full transition-all duration-300 ease-in-out">
          {rightPanel}
        </div>
      ) : (
        // Use resizable panels when expanded
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full rounded-lg"
          onLayout={handleResizeEnd}
        >
          <ResizablePanel 
            defaultSize={initialLeftSize} 
            minSize={15}
            maxSize={50}
            className="left-panel-container transition-all duration-300 ease-in-out"
          >
            {leftPanel}
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={initialRightSize}>
            {rightPanel}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
      
      {collapsible && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-white/10 bg-black shadow-md hover:bg-black/80"
          onClick={toggleLeftPanel}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
};

export default ResizablePanelsWrapper;
