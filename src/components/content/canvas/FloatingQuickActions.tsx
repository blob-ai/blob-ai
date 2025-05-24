
import React from "react";
import { Button } from "@/components/ui/button";
import { Wand2, PenTool, MessageSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FloatingQuickActionsProps {
  selectedText: string;
  onAction: (action: 'improve' | 'tone' | 'rewrite') => void;
  position: { top: number; left: number };
  isVisible: boolean;
}

const FloatingQuickActions: React.FC<FloatingQuickActionsProps> = ({
  selectedText,
  onAction,
  position,
  isVisible
}) => {
  console.log("FloatingQuickActions render:", { selectedText, isVisible, position });

  if (!isVisible || !selectedText.trim()) {
    console.log("Not rendering - isVisible:", isVisible, "selectedText:", selectedText);
    return null;
  }

  const quickActions = [
    { 
      id: 'improve' as const, 
      icon: <Wand2 className="h-3.5 w-3.5" />, 
      label: "Improve" 
    },
    { 
      id: 'tone' as const, 
      icon: <PenTool className="h-3.5 w-3.5" />, 
      label: "Tone" 
    },
    { 
      id: 'rewrite' as const, 
      icon: <MessageSquare className="h-3.5 w-3.5" />, 
      label: "Rewrite" 
    }
  ];

  return (
    <TooltipProvider>
      <div
        className="fixed z-[9999] bg-black/90 border border-white/10 rounded-lg px-2 py-1 shadow-xl animate-fade-in"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)',
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
          pointerEvents: 'auto'
        }}
        data-testid="floating-quick-actions"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-1">
          {quickActions.map((action) => (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Action clicked:", action.id);
                    onAction(action.id);
                  }}
                >
                  {action.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-[#16181c] text-white text-xs">
                {action.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default FloatingQuickActions;
