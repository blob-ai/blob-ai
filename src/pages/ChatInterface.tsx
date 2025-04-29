import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { useChat } from "@/contexts/ChatContext";
import { useParams } from "react-router-dom";

// Import other components used in the chat interface

const ChatInterface = () => {
  const { threadId } = useParams();
  const { messages, currentThread, loadMessages, setCurrentThread, threads } = useChat();

  // Load messages when the thread ID changes or when coming back to a thread
  useEffect(() => {
    if (threadId) {
      // Load messages for the current thread
      loadMessages(threadId);
      
      // Set the current thread from the threads array if needed
      if (!currentThread || currentThread.id !== threadId) {
        const thread = threads.find(t => t.id === threadId);
        if (thread) {
          setCurrentThread(thread);
        }
      }
    }
  }, [threadId, loadMessages, setCurrentThread, currentThread, threads]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden relative">
        <ChatSidebar visible={true} />
        {/* Rest of your chat interface */}
      </div>
    </div>
  );
};

export default ChatInterface;
