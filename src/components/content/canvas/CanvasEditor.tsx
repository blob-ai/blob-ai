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

  // Calculate position for floating quick actions
  const calculateQuickActionsPosition = (textarea: HTMLTextAreaElement, selectionStart: number, selectionEnd: number) => {
    const textBeforeSelection = textarea.value.substring(0, selectionStart);
    const lines = textBeforeSelection.split('\n');
    const currentLine = lines.length - 1;
    const currentCol = lines[lines.length - 1].length;
    
    // Get textarea's bounding box
    const rect = textarea.getBoundingClientRect();
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24;
    const fontSize = parseInt(getComputedStyle(textarea).fontSize) || 16;
    
    // Estimate position based on line and column
    const top = rect.top + (currentLine * lineHeight) - 40; // 40px above the line
    const left = rect.left + (currentCol * (fontSize * 0.6)) + (rect.width / 2); // Approximate character width
    
    // Keep within viewport bounds
    const viewportTop = Math.max(50, top);
    const viewportLeft = Math.max(50, Math.min(window.innerWidth - 200, left));
    
    return {
      top: viewportTop,
      left: viewportLeft
    };
  };

  const handleTextSelect = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      if (start !== end) {
        const selectedText = content.substring(start, end);
        const position = calculateQuickActionsPosition(textareaRef.current, start, end);
        
        setSelection({ start, end, text: selectedText });
        setQuickActionsPosition(position);
        setShowQuickActions(true);
      } else {
        setSelection(null);
        setShowQuickActions(false);
      }
    }
  };

  const handleQuickAction = (action: 'improve' | 'tone' | 'rewrite') => {
    if (!selection) return;
    
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
    const handleClickOutside = () => {
      setShowQuickActions(false);
      setSelection(null);
    };

    const handleScroll = () => {
      if (showQuickActions) {
        setShowQuickActions(false);
        setSelection(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showQuickActions]);

  // For textarea styling to help show markdown formatting
  const getTextareaClassName = () => {
    return `min-h-[calc(100vh-300px)] bg-transparent resize-none text-white border-none p-0 text-lg leading-relaxed focus-visible:ring-0 focus-visible:outline-none markdown-textarea selection:bg-opacity-15 selection:bg-[var(--accent-blue)] selection:text-white content-editor`;
  };

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
      
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onSelect={handleTextSelect}
        onKeyDown={onKeyDown}
        className={getTextareaClassName()}
        placeholder="Start writing your content here..."
        spellCheck={true}
        data-editor="true"
        data-content-editor="true"
      />
      
      {/* Content Analysis Panel - added below the editor */}
      <ContentAnalysisPanel contentAnalysis={contentAnalysis} className="mt-4" />
      
      {/* Floating Quick Actions - positioned relative to selected text */}
      <FloatingQuickActions
        selectedText={selection?.text || ""}
        onAction={handleQuickAction}
        position={quickActionsPosition}
        isVisible={showQuickActions}
      />
      
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
