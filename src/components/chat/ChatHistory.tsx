
import React from 'react';
import { MessageSquare, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatThread } from '@/hooks/use-chat-history';

interface ChatHistoryProps {
  threads: ChatThread[];
  isLoading: boolean;
  currentThreadId: string | null;
  onSelectThread: (thread: ChatThread) => void;
  onStartNewChat: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  threads,
  isLoading,
  currentThreadId,
  onSelectThread,
  onStartNewChat
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group threads by date
  const groupedThreads = threads.reduce<Record<string, ChatThread[]>>((groups, thread) => {
    const date = formatDate(thread.lastMessageAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(thread);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full bg-black/80 border-r border-white/10">
      <div className="p-3">
        <Button 
          onClick={onStartNewChat}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500"
        >
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {isLoading ? (
            <div className="text-white/50 text-sm flex justify-center p-4">
              Loading chats...
            </div>
          ) : threads.length === 0 ? (
            <div className="text-white/50 text-sm flex flex-col items-center justify-center p-4 text-center">
              <MessageSquare className="h-8 w-8 text-white/30 mb-2" />
              <p>No chat history found</p>
            </div>
          ) : (
            Object.entries(groupedThreads).map(([date, dateThreads]) => (
              <div key={date} className="mb-3">
                <div className="text-xs font-medium text-white/40 uppercase px-2 mb-1">
                  {date}
                </div>
                {dateThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                      thread.id === currentThreadId ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                    onClick={() => onSelectThread(thread)}
                  >
                    <MessageSquare className="h-4 w-4 text-white/50" />
                    <div className="overflow-hidden text-sm text-white/80">
                      <div className="truncate">{thread.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistory;
