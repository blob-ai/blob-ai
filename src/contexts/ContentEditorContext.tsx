
import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Types for content editor AI interactions
export interface ContentEditorMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  selectionContext?: string;
}

export interface ContentAnalysisSuggestion {
  type: string;
  text: string;
  applied?: boolean;
}

export interface ContentAnalysisResult {
  tone: string;
  readability: string;
  suggestions: ContentAnalysisSuggestion[];
  wordCount: number;
}

export interface ContentEditorContextType {
  messages: ContentEditorMessage[];
  isTyping: boolean;
  analysis: ContentAnalysisResult | null;
  sendMessage: (text: string, selection?: string) => Promise<void>;
  analyzeContent: (content: string, selection?: string) => Promise<void>;
  applyFormatting: (selection: string, format: string) => Promise<string>;
  clearMessages: () => void;
}

const defaultAnalysis: ContentAnalysisResult = {
  tone: "Neutral",
  readability: "Intermediate",
  suggestions: [],
  wordCount: 0
};

// Create context with default values
const ContentEditorContext = createContext<ContentEditorContextType>({
  messages: [],
  isTyping: false,
  analysis: null,
  sendMessage: async () => {},
  analyzeContent: async () => {},
  applyFormatting: async () => "",
  clearMessages: () => {},
});

export const useContentEditor = () => useContext(ContentEditorContext);

export const ContentEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ContentEditorMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState<ContentAnalysisResult | null>(null);

  // Mock response for now - would be connected to an edge function in production
  const getAIResponse = async (prompt: string, selectionContext?: string): Promise<string> => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fullPrompt = selectionContext 
      ? `${prompt}\n\nSelected content: "${selectionContext}"`
      : prompt;

    // Simple response patterns based on the prompt
    if (prompt.toLowerCase().includes('improve')) {
      return "I've analyzed your content and here are some improvements:\n- Use more active voice\n- Add descriptive headings\n- Include a stronger call-to-action";
    } else if (prompt.toLowerCase().includes('tone')) {
      return "Your content has a neutral tone. To make it more engaging, try using more emotional language and rhetorical questions.";
    } else if (prompt.toLowerCase().includes('rewrite')) {
      return selectionContext 
        ? `Here's a rewritten version: "${selectionContext.replace(/\b(good|nice|great)\b/g, 'exceptional')}"` 
        : "Please select the text you'd like me to rewrite.";
    } else {
      return `I'll help you with your content. What specific aspect are you looking to improve?`;
    }
  };

  // Function to send a message to the AI assistant
  const sendMessage = async (text: string, selection?: string): Promise<void> => {
    try {
      // Add user message to state
      const userMessage: ContentEditorMessage = {
        id: uuidv4(),
        text,
        sender: 'user',
        timestamp: Date.now(),
        selectionContext: selection
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      
      // Get AI response (this would call an edge function in production)
      const response = await getAIResponse(text, selection);
      
      // Add AI response to state
      setMessages(prev => [...prev, {
        id: uuidv4(),
        text: response,
        sender: 'assistant',
        timestamp: Date.now()
      }]);
      
    } catch (error) {
      console.error("Error sending message to content editor AI:", error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  // Analyze content and provide suggestions
  const analyzeContent = async (content: string, selection?: string): Promise<void> => {
    try {
      setIsTyping(true);
      
      // This would be an actual API call in production
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const textToAnalyze = selection || content;
      const wordCount = textToAnalyze.split(/\s+/).filter(Boolean).length;
      
      // Simple mock analysis
      let tone = "Neutral";
      if (textToAnalyze.includes("!")) tone = "Enthusiastic";
      else if (textToAnalyze.includes("?")) tone = "Inquisitive";
      
      let readability = "Intermediate";
      const avgWordLength = textToAnalyze.split(/\s+/).filter(Boolean).reduce((sum, word) => sum + word.length, 0) / wordCount || 0;
      if (avgWordLength > 6) readability = "Advanced";
      else if (avgWordLength < 4) readability = "Elementary";
      
      // Generate some suggestions
      const suggestions = [];
      if (wordCount < 50) suggestions.push({ type: "length", text: "Add more detail to strengthen your message" });
      if (!textToAnalyze.includes(",")) suggestions.push({ type: "structure", text: "Consider using more complex sentences" });
      if (textToAnalyze.includes("very")) suggestions.push({ type: "word-choice", text: "Replace intensifiers with stronger words" });
      
      setAnalysis({
        tone,
        readability,
        suggestions,
        wordCount
      });
      
    } catch (error) {
      console.error("Error analyzing content:", error);
      toast.error("Failed to analyze content. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  // Apply formatting to selected text
  const applyFormatting = async (selection: string, format: string): Promise<string> => {
    try {
      // This would call an AI service in production
      switch (format) {
        case 'improve':
          return selection.replace(/\b(good|great|nice)\b/g, 'excellent');
        case 'tone-professional':
          return selection
            .replace(/\b(I think|perhaps|maybe)\b/g, '')
            .replace(/\b(great|awesome|cool)\b/g, 'excellent')
            .replace(/\b(thing|stuff)\b/g, 'element');
        case 'tone-casual':
          return selection
            .replace(/\b(therefore|thus|hence)\b/g, 'so')
            .replace(/\b(utilize|employ)\b/g, 'use')
            .replace(/\b(communicate)\b/g, 'talk');
        case 'shorten':
          return selection.split(" ").slice(0, Math.ceil(selection.split(" ").length / 2)).join(" ");
        case 'expand':
          return selection + " with additional supporting details and context";
        default:
          return selection;
      }
    } catch (error) {
      console.error("Error applying formatting:", error);
      toast.error("Failed to format text. Please try again.");
      return selection;
    }
  };

  // Clear all messages
  const clearMessages = () => {
    setMessages([]);
    setAnalysis(null);
  };

  return (
    <ContentEditorContext.Provider
      value={{
        messages,
        isTyping,
        analysis,
        sendMessage,
        analyzeContent,
        applyFormatting,
        clearMessages
      }}
    >
      {children}
    </ContentEditorContext.Provider>
  );
};
