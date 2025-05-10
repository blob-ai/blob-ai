
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Sparkles, MessageSquare, PenTool, Wand2, Lightbulb } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

interface ContentChatPanelProps {
  onSendMessage: (message: string, selection?: string) => void;
  selectedText?: string;
  content?: string;
  contentGoal?: string;
  selectedIdea?: {
    title: string;
    category: string;
  } | null;
}

const ContentChatPanel: React.FC<ContentChatPanelProps> = ({ 
  onSendMessage,
  selectedText = "",
  content = "",
  contentGoal = "",
  selectedIdea = null
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
  
  // Generate a more relevant welcome message based on the content goal and selected idea
  const getInitialMessage = () => {
    if (selectedIdea) {
      return `Hi! I'm your AI content assistant. I see you're working on a post about "${selectedIdea.title}" in the "${selectedIdea.category}" category. How can I help you develop this content?`;
    } else if (contentGoal) {
      return `Hi! I'm your AI content assistant. I see you're creating content with a focus on "${contentGoal}". What would you like to write about today?`;
    } else {
      return "Hi! I'm your AI content assistant. I can help you create, edit, and improve your content. What would you like to work on today?";
    }
  };
  
  const [localMessages, setLocalMessages] = useState<Message[]>([
    {
      id: "1",
      text: getInitialMessage(),
      sender: "ai",
    },
  ]);
  
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  
  // Generate more relevant suggested prompts based on the content goal and selected idea
  const getContextualPrompts = () => {
    if (selectedIdea) {
      return [
        `Help me develop an outline for "${selectedIdea.title}"`,
        `What key points should I include in this ${selectedIdea.category} post?`,
        `Suggest a strong introduction for this content`,
        `What data or statistics would support this topic?`,
        `How should I conclude this piece?`
      ];
    } else if (contentGoal === "knowledge") {
      return [
        "Help me explain this concept clearly",
        "What examples would make this more educational?",
        "How can I make this content more informative?",
        "What research should I cite to support this?",
        "How can I simplify complex ideas in this post?"
      ];
    } else if (contentGoal === "community") {
      return [
        "How can I make this post more engaging for my community?",
        "What questions should I ask to encourage discussion?",
        "How can I make this content more relatable?",
        "What stories would connect with my audience?",
        "How can I invite more participation with this content?"
      ];
    } else if (contentGoal === "growth") {
      return [
        "What actionable steps should I include?",
        "How can I make this content more valuable for skill development?",
        "What challenges should I address in this post?",
        "How can I structure this for maximum learning impact?",
        "What exercises or practices should I recommend?"
      ];
    } else {
      return [
        "Help me develop my main points",
        "How can I make my content more engaging?",
        "Suggest a powerful conclusion",
        "What examples would strengthen my message?",
        "How can I improve the overall flow?"
      ];
    }
  };
  
  const [suggestedPrompts, setSuggestedPrompts] = useState(getContextualPrompts());
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);

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

  // Update suggested prompts based on selected text
  useEffect(() => {
    if (selectedText) {
      setSuggestedPrompts([
        "Improve this selection",
        "Make this more concise",
        "Rewrite in a professional tone",
        "Fix grammar and spelling",
        "Make this more engaging"
      ]);
    } else {
      setSuggestedPrompts(getContextualPrompts());
    }
  }, [selectedText, contentGoal, selectedIdea]);

  // Update the initial message when props change
  useEffect(() => {
    setLocalMessages(prevMessages => {
      // Only update the first message if it's from the AI
      if (prevMessages.length > 0 && prevMessages[0].sender === "ai") {
        return [
          {
            id: prevMessages[0].id,
            text: getInitialMessage(),
            sender: "ai"
          },
          ...prevMessages.slice(1)
        ];
      }
      return prevMessages;
    });
  }, [contentGoal, selectedIdea]);

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

  const generateLocalAIResponse = (userInput: string) => {
    let response = "";
    
    // Customize response based on content goal if available
    if (contentGoal && selectedIdea) {
      response = `I'll help you with "${userInput}" for your ${selectedIdea.category} post about "${selectedIdea.title}". Let's make sure it aligns with your ${contentGoal} goal.\n\n`;
    }
    
    if (userInput.toLowerCase().includes("improve") || userInput.toLowerCase().includes("better")) {
      response += "I've analyzed your content and here are some improvements:\n\n1. Your introduction could be more attention-grabbing\n2. Consider using more active voice\n3. The middle section needs more supporting evidence\n4. Your conclusion could be stronger";
      setSuggestedPrompts([
        "Show me how to improve my introduction",
        "Examples of active voice for my content",
        "How to add supporting evidence",
        "Write a stronger conclusion"
      ]);
    } else if (userInput.toLowerCase().includes("headline") || userInput.toLowerCase().includes("title")) {
      response += "Here are some headline suggestions based on your content:\n\n1. \"10 Surprising Ways to Boost Your Content Strategy\"\n2. \"The Ultimate Guide to Content That Converts\"\n3. \"How I Doubled My Engagement in Just 30 Days\"";
      setSuggestedPrompts([
        "Which headline is most clickable?",
        "Generate more headline options",
        "Make headlines more SEO-friendly",
        "Add a subtitle suggestion"
      ]);
    } else if (userInput.toLowerCase().includes("grammar") || userInput.toLowerCase().includes("fix")) {
      response += "I've checked your content for grammar issues. Here are my suggestions:\n\n1. Replace 'their' with 'there' in paragraph 2\n2. The sentence in paragraph 3 is a run-on sentence\n3. Consider breaking up some of your longer paragraphs";
      setSuggestedPrompts([
        "Fix all grammar errors automatically",
        "Simplify my complex sentences",
        "Make my tone more professional",
        "Check for consistency in tense"
      ]);
    } else if (userInput.toLowerCase().includes("tone")) {
      response += `I've analyzed your content's tone. To make it more persuasive, consider:\n\n1. Using more emotional language\n2. Adding rhetorical questions\n3. Incorporating personal anecdotes\n4. Addressing the reader directly with "you"`;
      setSuggestedPrompts([
        "Make the tone more professional",
        "Make the tone more conversational",
        "Make the tone more authoritative",
        "Add more emotional language"
      ]);
    } else if (userInput.toLowerCase().includes("conclusion")) {
      response += "Here's a stronger conclusion for your piece:\n\n\"With these strategies in place, you're now equipped to create content that not only resonates with your audience but drives meaningful engagement. The key is consistency and authentic value—delivering insights your readers can't find elsewhere.\"";
      setSuggestedPrompts([
        "Make the conclusion more actionable",
        "Add a call to action",
        "Tie the conclusion back to the intro",
        "Make the conclusion more memorable"
      ]);
    } else {
      response += `I'll help you with "${userInput}". Based on your content, I recommend focusing on making your key points more concise and adding more specific examples to illustrate your ideas.`;
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
    <div className="h-full flex flex-col bg-black border-r border-white/10 no-selection-toolbar" data-chat-panel="content-chat">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-medium flex items-center">
          <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
          Content Editor Assistant
        </h2>
        
        {selectedIdea && (
          <div className="mt-2 text-sm text-white/70">
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-blue-500/20 text-blue-300">
                {contentGoal || "Content"}
              </Badge>
              <span>•</span>
              <Badge variant="outline" className="bg-white/10">
                {selectedIdea.category}
              </Badge>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-selection-toolbar">
        {displayMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } no-selection-toolbar`}
          >
            <div
              className={`max-w-[90%] rounded-lg p-3 no-selection-toolbar ${
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
          <div className="flex justify-start no-selection-toolbar">
            <div className="max-w-[90%] rounded-lg p-3 bg-white/5 border border-white/10 no-selection-toolbar">
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
        <div className="px-4 py-2 border-t border-white/10 flex space-x-2 no-selection-toolbar">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-white/10 hover:bg-white/10 no-selection-toolbar"
            onClick={() => handleQuickAction("improve")}
          >
            <Wand2 className="h-3 w-3 mr-1" /> Improve
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-white/10 hover:bg-white/10 no-selection-toolbar"
            onClick={() => handleQuickAction("tone")}
          >
            <PenTool className="h-3 w-3 mr-1" /> Tone
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-white/10 hover:bg-white/10 no-selection-toolbar"
            onClick={() => handleQuickAction("rewrite")}
          >
            <MessageSquare className="h-3 w-3 mr-1" /> Rewrite
          </Button>
        </div>
      )}

      <div className="p-4 border-t border-white/10 no-selection-toolbar">
        <Accordion type="single" collapsible defaultValue="suggestions" className="no-selection-toolbar">
          <AccordionItem value="suggestions" className="border-none no-selection-toolbar">
            <AccordionTrigger className="py-2 text-sm text-white/70 hover:no-underline no-selection-toolbar">
              Suggestions
            </AccordionTrigger>
            <AccordionContent className="no-selection-toolbar">
              <div className="flex flex-wrap gap-2 mb-3 no-selection-toolbar">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 no-selection-toolbar"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex items-center gap-2 mt-2 no-selection-toolbar">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI for help..."
            className="min-h-[40px] max-h-[120px] bg-white/5 border-white/10 resize-none no-selection-toolbar"
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
            className="bg-blue-600 hover:bg-blue-500 rounded-full h-10 w-10 no-selection-toolbar"
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
