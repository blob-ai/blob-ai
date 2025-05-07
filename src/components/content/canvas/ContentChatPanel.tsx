
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Sparkles, ChevronDown, ChevronUp, Wand2, MessageSquare, PenTool, Lightbulb, User } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

interface ContentAnalysis {
  tone?: string;
  wordCount?: number;
  readingLevel?: string;
  improvements?: string[];
}

interface ContentChatPanelProps {
  onSendMessage: (message: string, selection?: string) => void;
  selectedText?: string;
  content?: string;
  goalType?: string;
  contentStructure?: string;
}

const ContentChatPanel: React.FC<ContentChatPanelProps> = ({ 
  onSendMessage,
  selectedText = "",
  content = "",
  goalType = "",
  contentStructure = ""
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    messages: chatMessages, 
    sendMessage, 
    isTyping, 
    currentThread, 
    createThread
  } = useChat();
  
  // Initial welcome message based on user's previous selections
  const getInitialMessage = () => {
    if (goalType && contentStructure) {
      return {
        id: "1",
        text: `Hi! I'm your AI content assistant. I see you're creating ${goalType} content with a ${contentStructure} approach. What specific topic would you like to focus on today?`,
        sender: "ai" as const,
      };
    }
    return {
      id: "1",
      text: "Hi! I'm your AI content assistant. I can help you create, edit, and improve your content. What would you like to work on today?",
      sender: "ai" as const,
    };
  };
  
  const [localMessages, setLocalMessages] = useState<Message[]>([getInitialMessage()]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "Improve my introduction",
    "Make my content more engaging",
    "Add a strong conclusion",
    "Check my grammar and style",
    "Suggest a catchy headline"
  ]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysis | null>(null);

  // Initialize a thread on component mount
  useEffect(() => {
    const initializeThread = async () => {
      if (!currentThread) {
        try {
          const threadId = await createThread("Content Assistant");
          setActiveThreadId(threadId);
        } catch (error) {
          console.error("Error initializing chat thread:", error);
        }
      } else {
        setActiveThreadId(currentThread.id);
      }
    };
    
    initializeThread();
  }, [currentThread, createThread]);

  // Analyze content when it changes or selection changes
  useEffect(() => {
    if (content) {
      analyzeContent(content, selectedText);
    }
  }, [content, selectedText]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, chatMessages, isTyping]);

  // Map ChatContext messages to local format when thread changes
  useEffect(() => {
    if (chatMessages.length > 0 && activeThreadId) {
      const mappedMessages = chatMessages.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender === "assistant" ? "ai" : "user" as "ai" | "user"
      }));
      
      if (mappedMessages.length > 0) {
        setLocalMessages(mappedMessages);
      }
    }
  }, [chatMessages, activeThreadId]);

  // Update suggested prompts based on selected text and goal type
  useEffect(() => {
    if (goalType) {
      let goalSpecificPrompts: string[] = [];
      
      switch (goalType.toLowerCase()) {
        case "growth":
          goalSpecificPrompts = [
            "How can I make this more shareable?",
            "What headline would attract new followers?",
            "Suggest ways to end with a call to follow"
          ];
          break;
        case "knowledge":
          goalSpecificPrompts = [
            "Make this explanation clearer",
            "Add helpful examples to this section",
            "Simplify this complex concept"
          ];
          break;
        case "brand":
          goalSpecificPrompts = [
            "Add a subtle product mention",
            "Make this more aligned with my brand voice",
            "End with a soft conversion prompt"
          ];
          break;
        default:
          goalSpecificPrompts = [
            "Make this more engaging",
            "Improve the flow of this section",
            "Suggest a powerful conclusion"
          ];
      }
      
      if (selectedText) {
        setSuggestedPrompts([
          "Improve this selection",
          "Make this more concise",
          "Rewrite in a professional tone",
          ...goalSpecificPrompts.slice(0, 2)
        ]);
      } else {
        setSuggestedPrompts(goalSpecificPrompts);
      }
    } else if (selectedText) {
      setSuggestedPrompts([
        "Improve this selection",
        "Make this more concise",
        "Rewrite in a professional tone",
        "Fix grammar and spelling",
        "Make this more engaging"
      ]);
    } else {
      setSuggestedPrompts([
        "Analyze my content tone",
        "Suggest improvements",
        "Help me with my conclusion",
        "Make my content more engaging",
        "Check overall readability"
      ]);
    }
  }, [selectedText, goalType]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to local state
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setLocalMessages(prev => [...prev, userMessage]);
    
    // Send message via onSendMessage prop
    onSendMessage(input, selectedText);
    
    // Send message via ChatContext if we have an active thread
    if (activeThreadId) {
      try {
        await sendMessage(input, activeThreadId, "DEFAULT");
      } catch (error) {
        console.error("Error sending message via ChatContext:", error);
        // Fallback for when ChatContext fails
        handleLocalFallback(input);
      }
    } else {
      // Local fallback if ChatContext is not available
      handleLocalFallback(input);
    }
    
    setInput("");
  };

  const handleLocalFallback = (userInput: string) => {
    // Simulate AI response (in a real app, this would come from an API)
    setTimeout(() => {
      generateLocalAIResponse(userInput);
    }, 1000);
  };

  const analyzeContent = (fullContent: string, selection: string = "") => {
    // This would ideally be done by a real AI model
    // Here we're generating mock analysis
    
    const textToAnalyze = selection || fullContent;
    const wordCount = textToAnalyze.split(/\s+/).filter(Boolean).length;
    
    let tone = "Neutral";
    if (textToAnalyze.includes("!")) tone = "Enthusiastic";
    else if (textToAnalyze.includes("?")) tone = "Inquisitive";
    else if (textToAnalyze.toLowerCase().includes("we")) tone = "Inclusive";
    
    let readingLevel = "Intermediate";
    const avgWordLength = textToAnalyze.split(/\s+/).filter(Boolean).reduce((sum, word) => sum + word.length, 0) / wordCount;
    if (avgWordLength > 6) readingLevel = "Advanced";
    else if (avgWordLength < 4) readingLevel = "Elementary";
    
    const improvements = [];
    if (wordCount < 50) improvements.push("Add more detail");
    if (!textToAnalyze.includes(",")) improvements.push("Consider using more complex sentences");
    if (textToAnalyze.split(".").length < 3) improvements.push("Break content into more paragraphs");
    if (textToAnalyze.includes("very")) improvements.push("Replace intensifiers with stronger words");
    
    setContentAnalysis({
      tone,
      wordCount,
      readingLevel,
      improvements
    });
  };

  const generateLocalAIResponse = (userInput: string) => {
    let response = "";
    
    if (userInput.toLowerCase().includes("improve") || userInput.toLowerCase().includes("better")) {
      response = "I've analyzed your content and here are some improvements:\n\n1. Your introduction could be more attention-grabbing\n2. Consider using more active voice\n3. The middle section needs more supporting evidence\n4. Your conclusion could be stronger";
      setSuggestedPrompts([
        "Show me how to improve my introduction",
        "Examples of active voice for my content",
        "How to add supporting evidence",
        "Write a stronger conclusion"
      ]);
    } else if (userInput.toLowerCase().includes("headline") || userInput.toLowerCase().includes("title")) {
      response = "Here are some headline suggestions based on your content:\n\n1. \"10 Surprising Ways to Boost Your Content Strategy\"\n2. \"The Ultimate Guide to Content That Converts\"\n3. \"How I Doubled My Engagement in Just 30 Days\"";
      setSuggestedPrompts([
        "Which headline is most clickable?",
        "Generate more headline options",
        "Make headlines more SEO-friendly",
        "Add a subtitle suggestion"
      ]);
    } else if (userInput.toLowerCase().includes("grammar") || userInput.toLowerCase().includes("fix")) {
      response = "I've checked your content for grammar issues. Here are my suggestions:\n\n1. Replace 'their' with 'there' in paragraph 2\n2. The sentence in paragraph 3 is a run-on sentence\n3. Consider breaking up some of your longer paragraphs";
      setSuggestedPrompts([
        "Fix all grammar errors automatically",
        "Simplify my complex sentences",
        "Make my tone more professional",
        "Check for consistency in tense"
      ]);
    } else if (userInput.toLowerCase().includes("tone")) {
      response = `I've analyzed your content's tone. It appears to be ${contentAnalysis?.tone || "neutral"}. To make it more persuasive, consider:\n\n1. Using more emotional language\n2. Adding rhetorical questions\n3. Incorporating personal anecdotes\n4. Addressing the reader directly with "you"`;
      setSuggestedPrompts([
        "Make the tone more professional",
        "Make the tone more conversational",
        "Make the tone more authoritative",
        "Add more emotional language"
      ]);
    } else if (userInput.toLowerCase().includes("conclusion")) {
      response = "Here's a stronger conclusion for your piece:\n\n\"With these strategies in place, you're now equipped to create content that not only resonates with your audience but drives meaningful engagement. The key is consistency and authentic value—delivering insights your readers can't find elsewhere.\"";
      setSuggestedPrompts([
        "Make the conclusion more actionable",
        "Add a call to action",
        "Tie the conclusion back to the intro",
        "Make the conclusion more memorable"
      ]);
    } else {
      response = `I'll help you with "${userInput}". Based on your content, I recommend focusing on making your key points more concise and adding more specific examples to illustrate your ideas.`;
      setSuggestedPrompts([
        "Show me how to make this more concise",
        "Generate specific examples",
        "Improve my key points",
        "Make this more engaging for my audience"
      ]);
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: "ai",
    };
    setLocalMessages(prev => [...prev, aiMessage]);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleQuickAction = (action: string) => {
    if (selectedText) {
      let actionPrompt = "";
      switch(action) {
        case "improve":
          actionPrompt = `Improve this selected text: "${selectedText}"`;
          break;
        case "tone":
          actionPrompt = `Analyze and suggest a better tone for: "${selectedText}"`;
          break;
        case "rewrite":
          actionPrompt = `Rewrite this to be more engaging: "${selectedText}"`;
          break;
      }
      setInput(actionPrompt);
    } else {
      toast.info("Please select text to use quick actions");
    }
  };

  // Determine which messages to show - ChatContext if available, otherwise local
  const displayMessages = chatMessages.length > 0 && activeThreadId ? 
    chatMessages.map(msg => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender === "assistant" ? "ai" : "user" as "ai" | "user"
    })) : 
    localMessages;

  return (
    <div className="h-full flex flex-col bg-black border-r border-white/10">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-medium flex items-center">
          <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
          AI Assistant
        </h2>
      </div>

      {contentAnalysis && (
        <div className="p-4 border-b border-white/10">
          <Accordion type="single" collapsible defaultValue="analysis">
            <AccordionItem value="analysis" className="border-none">
              <AccordionTrigger className="py-1 text-sm font-medium hover:no-underline">
                Content Analysis
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Tone:</span>
                    <Badge variant="outline" className="bg-white/5">{contentAnalysis.tone}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Words:</span>
                    <Badge variant="outline" className="bg-white/5">{contentAnalysis.wordCount}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Reading level:</span>
                    <Badge variant="outline" className="bg-white/5">{contentAnalysis.readingLevel}</Badge>
                  </div>
                  {contentAnalysis.improvements && contentAnalysis.improvements.length > 0 && (
                    <>
                      <div className="text-white/70 pt-1">Suggested improvements:</div>
                      <ul className="space-y-1">
                        {contentAnalysis.improvements.map((improvement, i) => (
                          <li key={i} className="text-xs flex items-center">
                            <span className="h-1 w-1 rounded-full bg-blue-400 mr-2"></span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[90%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {message.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[90%] rounded-lg p-3 bg-white/5 border border-white/10">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {selectedText && (
        <div className="px-4 py-2 border-t border-white/10 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-white/10 hover:bg-white/10"
            onClick={() => handleQuickAction("improve")}
          >
            <Wand2 className="h-3 w-3 mr-1" /> Improve
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-white/10 hover:bg-white/10"
            onClick={() => handleQuickAction("tone")}
          >
            <PenTool className="h-3 w-3 mr-1" /> Tone
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-white/10 hover:bg-white/10"
            onClick={() => handleQuickAction("rewrite")}
          >
            <MessageSquare className="h-3 w-3 mr-1" /> Rewrite
          </Button>
        </div>
      )}

      <div className="p-4 border-t border-white/10">
        <Accordion type="single" collapsible defaultValue="suggestions">
          <AccordionItem value="suggestions" className="border-none">
            <AccordionTrigger className="py-2 text-sm text-white/70 hover:no-underline">
              Suggestions
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex items-center gap-2 mt-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI for help..."
            className="min-h-[40px] max-h-[120px] bg-white/5 border-white/10 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            variant="default"
            size="icon"
            className="bg-blue-600 hover:bg-blue-500 rounded-full h-10 w-10"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentChatPanel;
