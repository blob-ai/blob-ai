import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Plus, Search, Trash2, Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  visible: boolean;
}

export function ChatSidebar({ visible }: ChatSidebarProps) {
  const {
    threads,
    loadingThreads,
    currentThread,
    setCurrentThread,
    createThread,
    updateThreadTitle,
    deleteThread,
  } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingThread, setEditingThread] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const navigate = useNavigate();

  // Filter threads based on search query
  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNewChat = async () => {
    try {
      const threadId = await createThread();
      navigate(`/dashboard/chat/${threadId}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleSelectThread = (threadId: string) => {
    const thread = threads.find((t) => t.id === threadId);
    if (thread) {
      setCurrentThread(thread);
      navigate(`/dashboard/chat/${threadId}`);
    }
  };

  const handleStartEdit = (threadId: string, title: string) => {
    setEditingThread(threadId);
    setEditedTitle(title);
  };

  const handleSaveEdit = async (threadId: string) => {
    if (editedTitle.trim() === "") return;
    
    await updateThreadTitle(threadId, editedTitle);
    setEditingThread(null);
  };

  const handleCancelEdit = () => {
    setEditingThread(null);
  };

  const handleDeleteThread = async (threadId: string) => {
    await deleteThread(threadId);
    if (threads.length > 1) {
      // If there are other threads, navigate to the first one that's not the deleted one
      const nextThread = threads.find((t) => t.id !== threadId);
      if (nextThread) {
        navigate(`/dashboard/chat/${nextThread.id}`);
      }
    } else {
      // If this was the last thread, create a new one
      handleCreateNewChat();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return "Today";
    }
    
    // Check if it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    // Otherwise show the date in a readable format
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group threads by date
  const groupedThreads = filteredThreads.reduce<Record<string, typeof filteredThreads>>(
    (groups, thread) => {
      const date = formatDate(thread.lastMessageAt || thread.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(thread);
      return groups;
    },
    {}
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-black border-r border-white/10 z-20 transition-all duration-300 ease-in-out overflow-hidden",
        visible ? "w-64" : "w-0 md:w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4">
          <Button
            onClick={handleCreateNewChat}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="pl-8 bg-white/5 border-white/10 focus-visible:ring-primary-400 text-sm"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-2 py-2">
            {loadingThreads ? (
              <div className="flex items-center justify-center p-4">
                <div className="text-sm text-white/50">Loading chats...</div>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <MessageSquare className="h-8 w-8 text-white/30 mb-2" />
                <div className="text-sm text-white/50">No chats found</div>
                {searchQuery && (
                  <Button
                    variant="link"
                    className="text-primary-400 mt-2 text-xs"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              Object.entries(groupedThreads).map(([date, dateThreads]) => (
                <div key={date} className="mb-4">
                  <div className="text-xs font-medium text-white/40 uppercase px-2 py-1">
                    {date}
                  </div>
                  {dateThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className={cn(
                        "flex items-center justify-between group rounded-lg mb-1 transition-colors",
                        currentThread?.id === thread.id
                          ? "bg-white/10"
                          : "hover:bg-white/5"
                      )}
                    >
                      {editingThread === thread.id ? (
                        <div className="flex flex-1 items-center p-1 pl-2">
                          <Input
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="h-8 flex-1 bg-white/5 border-white/10"
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 mr-1 text-green-500"
                            onClick={() => handleSaveEdit(thread.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <button
                            className="py-2 px-3 text-sm text-white/80 hover:text-white flex-1 text-left truncate"
                            onClick={() => handleSelectThread(thread.id)}
                          >
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 text-white/50" />
                              <span className="truncate">{thread.title}</span>
                            </div>
                          </button>
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-white/50 hover:text-white"
                              onClick={() => handleStartEdit(thread.id, thread.title)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-white/50 hover:text-red-500"
                              onClick={() => handleDeleteThread(thread.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
