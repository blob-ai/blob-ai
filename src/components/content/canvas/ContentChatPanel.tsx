
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Sparkles } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

interface ContentChatPanelProps {
  onSendMessage: (message: string) => void;
}

const ContentChatPanel: React.FC<ContentChatPanelProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    messages: chatMessages, 
    sendMessage, 
    isTyping, 
    currentThread, 
    createThread
  } = useChat();
  const [localMessages, setLocalMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI content assistant. I can help you create, edit, and improve your content. What would you like to work on today?",
      sender: "ai",
    },
  ]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "Improve my introduction",
    "Make my content more engaging",
    "Add a strong conclusion",
    "Check my grammar and style",
    "Suggest a catchy headline"
  ]);

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
        sender: msg.sender === "assistant" ? "ai" : "user"
      }));
      
      if (mappedMessages.length > 0) {
        setLocalMessages(mappedMessages);
      }
    }
  }, [chatMessages, activeThreadId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to local state
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setLocalMessages(prev => [...prev, userMessage]);
    onSendMessage(input);
    
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

  // Determine which messages to show - ChatContext if available, otherwise local
  const displayMessages = chatMessages.length > 0 && activeThreadId ? 
    chatMessages.map(msg => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender === "assistant" ? "ai" : "user"
    })) : 
    localMessages;

  return (
    <div className="w-96 bg-black border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-medium flex items-center">
          <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
          AI Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
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
            <div className="max-w-[80%] rounded-lg p-3 bg-white/5 border border-white/10">
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

      <div className="p-4 border-t border-white/10">
        <div className="mb-3 space-y-2">
          <p className="text-xs text-white/50 mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
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
        </div>

        <div className="flex items-center gap-2">
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
