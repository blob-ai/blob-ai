
import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";
import ChatSuggestionChips from "./components/ChatSuggestionChips";
import { useChatMessages } from "./hooks/useChatMessages";

interface ContentChatPanelProps {
  onSendMessage: (message: string) => void;
}

const ContentChatPanel: React.FC<ContentChatPanelProps> = ({ onSendMessage }) => {
  const [lastUserInput, setLastUserInput] = useState("");
  
  const initialMessage = {
    id: "1",
    text: "Hi! I'm your AI content assistant. I can help you create, edit, and improve your content. What would you like to work on today?",
    sender: "ai",
  };
  
  const { messages, isTyping, addUserMessage, messagesEndRef } = useChatMessages(initialMessage);

  const handleSendMessage = (text: string) => {
    addUserMessage(text);
    onSendMessage(text);
    setLastUserInput(text);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="w-96 bg-black border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-medium flex items-center">
          <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
          AI Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <ChatSuggestionChips 
          onSelectSuggestion={handleSuggestionSelect}
          userInput={lastUserInput}
        />

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ContentChatPanel;
