
import React from "react";
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
        {message.text.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < message.text.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessage;
