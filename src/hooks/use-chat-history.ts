
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface ChatThread {
  id: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

export function useChatHistory() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { user } = useAuth();

  // Load initial threads when the component mounts
  useEffect(() => {
    if (user) {
      loadThreads();
    }
  }, [user]);

  // Load messages when current thread changes
  useEffect(() => {
    if (currentThread) {
      loadMessages(currentThread.id);
    } else {
      setMessages([]);
    }
  }, [currentThread]);

  const loadThreads = async (limit = 7) => {
    if (!user) return;
    
    setIsLoadingThreads(true);
    try {
      const { data, error } = await supabase
        .from("chat_threads")
        .select("*")
        .eq("user_id", user.id)
        .order("last_message_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      const formattedThreads = data.map(thread => ({
        id: thread.id,
        title: thread.title,
        lastMessageAt: thread.last_message_at,
        createdAt: thread.created_at
      }));

      setThreads(formattedThreads);
    } catch (error) {
      console.error("Error loading threads:", error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive"
      });
    } finally {
      setIsLoadingThreads(false);
    }
  };

  const loadMessages = async (threadId: string) => {
    if (!user || !threadId) return;
    
    setIsLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const formattedMessages = data.map(msg => ({
        id: msg.id,
        threadId: msg.thread_id,
        content: msg.content,
        role: msg.role as 'user' | 'assistant', // Cast the role to the correct type
        createdAt: msg.created_at
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error",
        description: "Failed to load chat messages",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const createThread = async (title = "New Chat") => {
    if (!user) return null;

    try {
      const newThread = {
        title,
        user_id: user.id,
        last_message_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("chat_threads")
        .insert(newThread)
        .select()
        .single();

      if (error) throw error;
      
      // Add the new thread to the list
      const formattedThread = {
        id: data.id,
        title: data.title,
        lastMessageAt: data.last_message_at,
        createdAt: data.created_at
      };
      
      setThreads(prev => [formattedThread, ...prev]);
      setCurrentThread(formattedThread);
      setMessages([]);
      
      return formattedThread;
    } catch (error) {
      console.error("Error creating thread:", error);
      toast({
        title: "Error",
        description: "Failed to create new chat",
        variant: "destructive"
      });
      return null;
    }
  };

  const saveMessage = async (content: string, role: 'user' | 'assistant', threadId: string) => {
    if (!user || !threadId) return null;

    try {
      const newMessage = {
        thread_id: threadId,
        content,
        role
      };

      const { data, error } = await supabase
        .from("chat_messages")
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;

      // Update thread's last_message_at
      await supabase
        .from("chat_threads")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", threadId);

      // If this is the first message, update thread title
      if (role === 'user' && messages.length === 0) {
        const truncatedContent = content.length > 15 
          ? content.substring(0, 15) + "..."
          : content;
        
        await supabase
          .from("chat_threads")
          .update({ title: truncatedContent })
          .eq("id", threadId);
          
        if (currentThread) {
          setCurrentThread({
            ...currentThread,
            title: truncatedContent,
            lastMessageAt: new Date().toISOString()
          });
          
          // Update thread in the threads list
          setThreads(prev => prev.map(thread => 
            thread.id === threadId 
              ? { ...thread, title: truncatedContent, lastMessageAt: new Date().toISOString() } 
              : thread
          ));
        }
      }

      const formattedMessage: ChatMessage = {
        id: data.id,
        threadId: data.thread_id,
        content: data.content,
        role: data.role as 'user' | 'assistant', // Cast the role to the correct type
        createdAt: data.created_at
      };

      setMessages(prev => [...prev, formattedMessage]);
      return formattedMessage;
    } catch (error) {
      console.error("Error saving message:", error);
      return null;
    }
  };

  const selectThread = (thread: ChatThread) => {
    setCurrentThread(thread);
  };

  const startNewThread = () => {
    setCurrentThread(null);
    setMessages([]);
  };

  return {
    threads,
    isLoadingThreads,
    currentThread,
    messages,
    isLoadingMessages,
    loadThreads,
    loadMessages,
    createThread,
    saveMessage,
    selectThread,
    startNewThread
  };
}
