
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
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
  );
};

export default ChatInput;
