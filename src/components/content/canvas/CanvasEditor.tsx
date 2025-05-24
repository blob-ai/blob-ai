
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import ContentEditingToolbar from "./ContentEditingToolbar";
import FloatingQuickActions from "./FloatingQuickActions";
import useContentFormatting from "./hooks/useContentFormatting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { FormattingType } from "@/lib/formatting";
import ContentAnalysisPanel, { ContentAnalysis } from "./ContentAnalysisPanel";

interface CanvasEditorProps {
  content: string;
  setContent: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onTextTransform: (operation: string, selectedText: string) => void;
  contentAnalysis: ContentAnalysis | null;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  content,
  setContent,
  onKeyDown,
  textareaRef,
  onTextTransform,
  contentAnalysis
}) => {
  const [selection, setSelection] = useState<{ start: number; end: number; text: string } | null>(null);
  const [quickActionsPosition, setQuickActionsPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [showQuickActions, setShowQuickActions] = useState(false);
  const { handleFormatting, renderFloatingToolbar } = useContentFormatting();

  // Simplified position calculation
  const calculateQuickActionsPosition = (textarea: HTMLTextAreaElement, selectionStart: number, selectionEnd: number) => {
    const rect = textarea.getBoundingClientRect();
    
    // Position the toolbar above the textarea, centered
    const top = rect.top - 50; // 50px above the textarea
    const left = rect.left + (rect.width / 2); // Center horizontally
    
    return {
      top: Math.max(10, top), // Don't go above viewport
      left: Math.max(10, Math.min(window.innerWidth - 200, left)) // Stay within viewport
    };
  };

  const handleTextSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    console.log("Selection event triggered:", { start, end });
    
    if (start !== end && start !== undefined && end !== undefined) {
      const selectedText = content.substring(start, end);
      console.log("Text selected:", selectedText);
      
      if (selectedText.trim()) {
        const position = calculateQuickActionsPosition(textarea, start, end);
        console.log("Calculated position:", position);
        
        setSelection({ start, end, text: selectedText });
        setQuickActionsPosition(position);
        setShowQuickActions(true);
      }
    } else {
      console.log("No text selected, hiding actions");
      setSelection(null);
      setShowQuickActions(false);
    }
  };

  // Also handle mouse up events for better selection detection
  const handleMouseUp = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    setTimeout(() => {
      handleTextSelect(e as any);
    }, 10); // Small delay to ensure selection is registered
  };

  const handleQuickAction = (action: 'improve' | 'tone' | 'rewrite') => {
    if (!selection) {
      console.log("No selection available for action:", action);
      return;
    }
    
    console.log("Quick action triggered:", action, "for text:", selection.text);
    
    // Map actions to the expected operation strings
    const actionMap = {
      'improve': 'improve',
      'tone': 'tone',
      'rewrite': 'rewrite'
    };
    
    onTextTransform(actionMap[action], selection.text);
    
    // Hide quick actions after action is taken
    setShowQuickActions(false);
    setSelection(null);
  };

  const handleTextOperation = (operation: string) => {
    if (!selection) return;
    onTextTransform(operation, selection.text);
  };

  // Apply formatting from the toolbar
  const applyFormat = (format: string) => {
    handleFormatting(format as FormattingType, content, setContent, textareaRef);
  };

  // Listen for custom formatting event from the floating toolbar
  useEffect(() => {
    const handleCustomFormatEvent = (e: CustomEvent) => {
      const { format, context } = e.detail;
      // Only handle events specifically for the content editor
      if (format && context === 'content-editor' && textareaRef.current) {
        handleFormatting(format as FormattingType, content, setContent, textareaRef);
      }
    };
    
    const handleAIActionEvent = (e: CustomEvent) => {
      const { action, text, range, context } = e.detail;
      // Only handle events specifically for the content editor
      if (action && text && context === 'content-editor') {
        onTextTransform(action, text);
      }
    };
    
    document.addEventListener('applyFormatting', handleCustomFormatEvent as EventListener);
    document.addEventListener('applyAIAction', handleAIActionEvent as EventListener);
    
    return () => {
      document.removeEventListener('applyFormatting', handleCustomFormatEvent as EventListener);
      document.removeEventListener('applyAIAction', handleAIActionEvent as EventListener);
    };
  }, [content, handleFormatting, setContent, textareaRef, onTextTransform]);

  // Hide quick actions when clicking outside or when content changes
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(e.target as Node)) {
        setShowQuickActions(false);
        setSelection(null);
      }
    };

    const handleScroll = () => {
      if (showQuickActions) {
        setShowQuickActions(false);
        setSelection(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showQuickActions, textareaRef]);

  // For textarea styling to help show markdown formatting
  const getTextareaClassName = () => {
    return `min-h-[calc(100vh-300px)] bg-transparent resize-none text-white border-none p-0 text-lg leading-relaxed focus-visible:ring-0 focus-visible:outline-none markdown-textarea selection:bg-opacity-15 selection:bg-[var(--accent-blue)] selection:text-white content-editor`;
  };

  console.log("Render state:", { showQuickActions, selection, quickActionsPosition });

  return (
    <div 
      className="relative flex flex-col h-full" 
      id="canvas-editor-container" 
      data-canvas-editor="true"
      data-editor="true"
    >
      <div className="flex items-center mb-4">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/placeholder.svg" alt="Your content" />
          <AvatarFallback className="bg-[var(--accent-blue)]">
            <UserRound className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="text-sm text-white/70">Your post</div>
      </div>
      
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onSelect={handleTextSelect}
          onMouseUp={handleMouseUp}
          onKeyDown={onKeyDown}
          className={getTextareaClassName()}
          placeholder="Start writing your content here..."
          spellCheck={true}
          data-editor="true"
          data-content-editor="true"
        />
        
        {/* Floating Quick Actions - positioned relative to selected text */}
        <FloatingQuickActions
          selectedText={selection?.text || ""}
          onAction={handleQuickAction}
          position={quickActionsPosition}
          isVisible={showQuickActions}
        />
      </div>
      
      {/* Content Analysis Panel - added below the editor */}
      <ContentAnalysisPanel contentAnalysis={contentAnalysis} className="mt-4" />
      
      {/* Contextual floating toolbar that appears only for textarea selections */}
      {renderFloatingToolbar()}
      
      {/* Legacy toolbar - hidden since we now use the floating toolbar */}
      {selection && (
        <ContentEditingToolbar
          onSelect={handleTextOperation}
          onFormat={applyFormat}
          style={{
            position: 'absolute',
            display: 'none', // Hide the legacy toolbar since we now use the floating toolbar
          }}
          isFloating={true}
        />
      )}
    </div>
  );
};

export default CanvasEditor;
