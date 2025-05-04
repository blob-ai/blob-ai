
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Wand2 } from "lucide-react";

interface ChatAIPanelProps {
  onApplySuggestion: (suggestion: string) => void;
}

const ChatAIPanel: React.FC<ChatAIPanelProps> = ({ onApplySuggestion }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "ai"; content: string }>>([
    { 
      role: "ai", 
      content: "Hi! I'm your AI content assistant. I can help you create, edit, and improve your content. What would you like to work on today?" 
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { role: "user", content: message }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        { 
          role: "ai", 
          content: `Here's a suggestion based on your request: "${message}"\n\nI've created an improved version you can use in your content.` 
        }
      ]);
    }, 1000);
    
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick actions that can be applied
  const quickActions = [
    "Edit specific sentence",
    "Rewrite the whole post",
    "Ask anything"
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold">Chat</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, index) => (
          <div 
            key={index}
            className={`${
              msg.role === "user" ? "bg-white/5 ml-4" : "bg-black/40 mr-4"
            } p-3 rounded-lg`}
          >
            <div className="text-sm">
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
            {msg.role === "ai" && index > 0 && (
              <div className="mt-2 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs border-white/10 hover:bg-white/10"
                  onClick={() => onApplySuggestion("This is a sample suggestion from the AI")}
                >
                  Apply suggestion
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 space-y-4">
        <div className="text-sm text-white/70">Quick Actions</div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs bg-black/30 border-white/10 hover:bg-white/10"
              onClick={() => {
                setMessage(action);
                handleSendMessage();
              }}
            >
              {action}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything or select..."
            className="bg-black/30 border-white/10 text-white pr-10 rounded-2xl"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="absolute right-0 top-0 bottom-0 rounded-r-2xl bg-blue-600 hover:bg-blue-500 px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatAIPanel;
