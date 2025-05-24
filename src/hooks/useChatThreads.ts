
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useChat } from '@/contexts/ChatContext';

interface ChatThread {
  id: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
  isActive?: boolean;
}

export const useChatThreads = (currentThreadId?: string) => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { updateThreadTitle, deleteThread } = useChat();

  const fetchThreads = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_threads')
        .select('*')
        .order('last_message_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching chat threads:', error);
        return;
      }

      const formattedThreads: ChatThread[] = data.map(thread => ({
        id: thread.id,
        title: thread.title,
        lastMessageAt: thread.last_message_at || thread.created_at,
        createdAt: thread.created_at,
        isActive: thread.id === currentThreadId
      }));

      setThreads(formattedThreads);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThreadRename = async (threadId: string, newTitle: string) => {
    try {
      await updateThreadTitle(threadId, newTitle);
      setThreads(prev => 
        prev.map(thread => 
          thread.id === threadId 
            ? { ...thread, title: newTitle }
            : thread
        )
      );
    } catch (error) {
      console.error('Error renaming thread:', error);
    }
  };

  const handleThreadDelete = async (threadId: string) => {
    try {
      await deleteThread(threadId);
      setThreads(prev => prev.filter(thread => thread.id !== threadId));
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  // Update active thread when currentThreadId changes
  useEffect(() => {
    setThreads(prev => 
      prev.map(thread => ({
        ...thread,
        isActive: thread.id === currentThreadId
      }))
    );
  }, [currentThreadId]);

  return {
    threads,
    isLoading,
    handleThreadRename,
    handleThreadDelete,
    refetchThreads: fetchThreads
  };
};
