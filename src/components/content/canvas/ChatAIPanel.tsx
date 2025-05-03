
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Undo, Wand2 } from "lucide-react";

interface ChatAIPanelProps {
  onApplySuggestion: (suggestion: string) => void;
}

const ChatAIPanel: React.FC<ChatAIPanelProps> = ({ onApplySuggestion }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "ai"; content: string }>>([
    { role: "ai", content: "I'm your AI assistant. How can I help improve your content?" }
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

  // Quick suggestions that can be applied to the content
  const quickSuggestions = [
    "Make it more engaging",
    "Add a strong call to action",
    "Make it more professional",
    "Add data points",
  ];

  return (
    <div className="flex flex-col h-full border-l border-white/10">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold">AI Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, index) => (
          <div 
            key={index}
            className={`${
              msg.role === "user" ? "bg-white/5 ml-4" : "bg-blue-600/20 mr-4"
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
      
      <div className="p-4 border-t border-white/10">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs bg-white/5 border-white/10 hover:bg-white/10"
              onClick={() => {
                setMessage(suggestion);
                handleSendMessage();
              }}
            >
              <Wand2 className="h-3 w-3 mr-1" />
              {suggestion}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI for suggestions..."
            className="bg-white/5 border-white/10 text-white"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-blue-600 hover:bg-blue-500"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatAIPanel;
