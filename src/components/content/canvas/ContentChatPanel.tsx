
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

interface ContentChatPanelProps {
  onSendMessage: (message: string) => void;
}

const ContentChatPanel: React.FC<ContentChatPanelProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI content assistant. I can help you create, edit, and improve your content. What would you like to work on today?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    onSendMessage(input);
    setInput("");

    // Simulate AI response (in a real app, this would come from an API)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'll help you with "${input}". Let me suggest some improvements to your content.`,
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const quickActions = [
    { id: "edit", label: "Edit specific sentence" },
    { id: "rewrite", label: "Rewrite the whole post" },
    { id: "ask", label: "Ask anything" },
  ];

  return (
    <div className="w-96 bg-black border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-medium">Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
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
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="mb-3 space-y-2">
          <p className="text-xs text-white/50 mb-2">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                className="px-3 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                onClick={() => {
                  setInput(action.label);
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything or select..."
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
