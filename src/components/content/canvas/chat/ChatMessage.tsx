
import React from "react";
import { Wand, MessageSquare } from "lucide-react";
import { Message } from "../hooks/useChatMessages";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
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
        {message.sender === "ai" && (
          <div className="flex items-center mb-1">
            <Wand className="h-4 w-4 text-blue-400 mr-1" />
            <span className="text-xs text-blue-400">AI Assistant</span>
          </div>
        )}
        {message.sender === "user" && (
          <div className="flex items-center mb-1">
            <MessageSquare className="h-4 w-4 text-white/70 mr-1" />
            <span className="text-xs text-white/70">You</span>
          </div>
        )}
        <div className="mt-1">
          {message.text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < message.text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
