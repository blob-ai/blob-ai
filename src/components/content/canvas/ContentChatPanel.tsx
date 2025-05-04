
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Sparkles } from "lucide-react";
import { useChatMessages } from "./hooks/useChatMessages";
import ChatMessage from "./chat/ChatMessage";
import ChatSuggestionChips from "./chat/ChatSuggestionChips";
import ChatInput from "./chat/ChatInput";
import TypingIndicator from "./chat/TypingIndicator";

interface ContentChatPanelProps {
  onSendMessage: (message: string) => void;
}

const ContentChatPanel: React.FC<ContentChatPanelProps> = ({ onSendMessage }) => {
  const { 
    messages,
    input, 
    setInput, 
    isTyping, 
    suggestedPrompts,
    messagesEndRef,
    handleSend,
    handlePromptClick
  } = useChatMessages(onSendMessage);

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
          suggestedPrompts={suggestedPrompts} 
          onPromptClick={handlePromptClick} 
        />

        <ChatInput 
          input={input}
          setInput={setInput}
          handleSend={handleSend}
        />
      </div>
    </div>
  );
};

export default ContentChatPanel;
