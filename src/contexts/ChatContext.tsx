import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { v4 as uuidv4 } from "uuid";
import { getSystemPrompt } from "@/utils/systemPrompts";
import { toast } from "@/hooks/use-toast";

// Types
export interface ChatMessage {
  id: string;
  threadId: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  icon?: React.ReactNode;
  contentPreview?: any;
  isTyping?: boolean;
  analysisResult?: boolean;
  analysisData?: any;
  preserveWhitespace?: boolean;
}

export interface AnalysisSection {
  title: string;
  items: string[];
}

export interface ChatThread {
  id: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface ContentSetup {
  id?: string;
  name: string;
  configuration: {
    goal?: string;
    format?: string;
    hook?: string;
    tone?: string;
  };
  examples: Array<{
    name: string;
    content: string;
  }>;
  isTemplate?: boolean;
}

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  threads: ChatThread[];
  setThreads: React.Dispatch<React.SetStateAction<ChatThread[]>>;
  currentThread: ChatThread | null;
  setCurrentThread: React.Dispatch<React.SetStateAction<ChatThread | null>>;
  loadingThreads: boolean;
  loadingMessages: boolean;
  isTyping: boolean;
  saveMessage: (message: ChatMessage, threadId: string) => Promise<void>;
  loadMessages: (threadId: string) => Promise<void>;
  loadThreads: () => Promise<void>;
  createThread: (title?: string) => Promise<string>;
  updateThreadTitle: (threadId: string, title: string) => Promise<void>;
  deleteThread: (threadId: string) => Promise<void>;
  saveContentSetup: (setup: ContentSetup) => Promise<string>;
  loadContentSetups: () => Promise<ContentSetup[]>;
  sendMessage: (content: string, threadId: string, promptType?: string) => Promise<void>;
  handleAnalyzeContent: (posts: any[], threadId: string) => Promise<void>;
  handleCreateContent: (contentData: any, threadId: string) => Promise<any>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  // Load user's threads on initial load
  useEffect(() => {
    if (user) {
      loadThreads();
    }
  }, [user]);

  // Load messages whenever the current thread changes
  useEffect(() => {
    if (currentThread) {
      loadMessages(currentThread.id);
    } else {
      setMessages([]);
    }
  }, [currentThread]);

// Parse OpenAI analysis response into structured format
const parseAnalysisResponse = (content: string): AnalysisSection[] => {
  try {
    const sections: AnalysisSection[] = [];
    const sectionTitles = [
      "CONTENT SNAPSHOT",
      "HOOK BREAKDOWN",
      "STRUCTURAL FORMULA",
      "ENGAGEMENT TRIGGERS",
      "REPLICATION BLUEPRINT"
    ];
    
    let currentSection: AnalysisSection | null = null;
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Check for main section headers
      const sectionMatch = sectionTitles.find(title => 
        trimmedLine.toUpperCase().includes(title)
      );
      
      if (sectionMatch) {
        // Add previous section if exists
        if (currentSection && currentSection.items.length > 0) {
          sections.push(currentSection);
        }
        // Start new section
        currentSection = {
          title: sectionMatch,
          items: []
        };
      } 
      // Handle bullet points that contain key-value pairs
      else if (trimmedLine.match(/^\s*(-|\*|\d+\.)\s*.*?:\s*/) && currentSection) {
        // Extract content after the bullet
        const bulletContent = trimmedLine.replace(/^\s*(-|\*|\d+\.)\s*/, '').trim();
        
        // Check if it's a key-value pattern with "Key:" format
        const keyValueMatch = bulletContent.match(/^([^:]+):\s*(.*)/);
        
        if (keyValueMatch) {
          const [_, key, value] = keyValueMatch;
          // Clean any existing formatting marks
          const cleanKey = key.replace(/\*\*/g, '').trim();
          // Format as clean bullet with bold key
          currentSection.items.push(`• **${cleanKey}**: ${value}`);
        } else {
          // Regular bullet point without key-value structure
          currentSection.items.push(`• ${bulletContent}`);
        }
      }
      // Handle regular bullet points
      else if (trimmedLine.match(/^\s*(-|\*|\d+\.)\s*/) && currentSection) {
        const bulletContent = trimmedLine.replace(/^\s*(-|\*|\d+\.)\s*/, '').trim();
        // Clean any existing formatting marks
        const cleanContent = bulletContent.replace(/\*\*/g, '').trim();
        currentSection.items.push(`• ${cleanContent}`);
      }
      // Handle continuation lines or non-bullet content
      else if (currentSection && currentSection.items.length > 0) {
        const lastItem = currentSection.items[currentSection.items.length - 1];
        // If this looks like a new item without a bullet, add it with a bullet
        if (trimmedLine.match(/^[A-Z].*?:/)) {
          currentSection.items.push(`• ${trimmedLine}`);
        } else {
          // Otherwise append to the last item
          currentSection.items[currentSection.items.length - 1] += ` ${trimmedLine}`;
        }
      }
    }
    
    // Add the last section if exists
    if (currentSection && currentSection.items.length > 0) {
      sections.push(currentSection);
    }
    
    return sections.length > 0 ? sections : [{
      title: "Analysis",
      items: [content.trim()]
    }];
  } catch (error) {
    console.error("Error parsing analysis response:", error);
    return [{
      title: "Analysis",
      items: [content.trim()]
    }];
  }
};

  // Save a message to the database
  const saveMessage = async (message: ChatMessage, threadId: string) => {
    if (!user) return;

    try {
      await supabase.from("chat_messages").insert({
        thread_id: threadId,
        content: message.text,
        role: message.sender,
      });
      
      // Update the thread's last_message_at time
      await supabase
        .from("chat_threads")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", threadId);
        
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  // Send a message to OpenAI
  const sendMessage = async (content: string, threadId: string, promptType: string = "DEFAULT") => {
    if (!user || !threadId) return;

    try {
      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        text: content,
        sender: "user"
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Add a typing indicator for the AI
      const typingMessageId = `ai-typing-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: typingMessageId,
        text: "",
        sender: "assistant",
        isTyping: true
      }]);
      
      setIsTyping(true);
      
      // Save user message to database
      await saveMessage(userMessage, threadId);
      
      // Call the edge function
      const response = await supabase.functions.invoke("chat-completions", {
        body: {
          threadId,
          content,
          systemPrompt: getSystemPrompt(promptType)
        }
      });

      if (response.error) {
        console.error("Error from edge function:", response.error);
        throw new Error(response.error.message || "Failed to send message");
      }

      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== typingMessageId);
        return [...filtered, {
          id: response.data.id || `ai-${Date.now()}`,
          text: response.data.content,
          sender: "assistant"
        }];
      });
      
      // If this is the first message, update the thread title
      if (messages.length <= 1) {
        const title = content.length > 30 
          ? content.substring(0, 27) + '...' 
          : content;
          
        await updateThreadTitle(threadId, title);
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Remove typing indicator and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [...filtered, {
          id: `error-${Date.now()}`,
          text: "Sorry, I encountered an error. Please try again.",
          sender: "assistant"
        }];
      });
      
      toast({
        title: "Error",
        description: "Failed to get a response from the AI assistant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Analyze content using the AI
  const handleAnalyzeContent = async (posts: any[], threadId: string) => {
    if (!user || !threadId || posts.length === 0) return;
    
    try {
      const postsContent = posts.map(post => post.content).join("\n\n---\n\n");
      const analysisPrompt = `Please analyze these posts for what makes them successful:\n\n${postsContent}`;
      
      // First, add the user prompt to UI and database
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        text: `Analyze ${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`,
        sender: "user"
      };
      
      setMessages(prev => [...prev, userMessage]);
      await saveMessage(userMessage, threadId);
      
      // Add a typing indicator for the AI
      const typingMessageId = `ai-typing-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: typingMessageId,
        text: "",
        sender: "assistant",
        isTyping: true,
        analysisResult: true
      }]);
      
      setIsTyping(true);
      
      // Call the edge function
      const response = await supabase.functions.invoke("chat-completions", {
        body: {
          threadId,
          content: analysisPrompt,
          systemPrompt: getSystemPrompt("ANALYZE_POSTS")
        }
      });

      if (response.error) {
        console.error("Error from edge function:", response.error);
        throw new Error(response.error.message || "Failed to analyze posts");
      }

      const analysisContent = response.data.content;
      const parsedAnalysis = parseAnalysisResponse(analysisContent);
      
      console.log("Parsed analysis:", parsedAnalysis);
      
      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== typingMessageId);
        return [...filtered, {
          id: response.data.id || `ai-${Date.now()}`,
          text: `I've analyzed ${posts.length} ${posts.length === 1 ? 'post' : 'posts'} and identified key patterns that drive engagement.`,
          sender: "assistant",
          analysisResult: true,
          analysisData: parsedAnalysis
        }];
      });
      
      // If this is the first message, update the thread title
      if (messages.length <= 1) {
        const title = `Analysis of ${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`;
        await updateThreadTitle(threadId, title);
      }
      
    } catch (error) {
      console.error("Error analyzing content:", error);
      
      // Remove typing indicator and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [...filtered, {
          id: `error-${Date.now()}`,
          text: "Sorry, I encountered an error analyzing the posts. Please try again.",
          sender: "assistant"
        }];
      });
      
      toast({
        title: "Error",
        description: "Failed to analyze posts. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Create content using the AI
  const handleCreateContent = async (contentData: any, threadId: string) => {
    if (!user || !threadId) return null;
    
    try {
      const { goal, format, hook, tone, examples = [], title } = contentData;
      
      let promptContent = `Create content with the following specifications:\n`;
      promptContent += `GOAL: ${goal}\n`;
      promptContent += `FORMAT: ${format}\n`;
      promptContent += `HOOK: ${hook}\n`;
      promptContent += `TONE: ${tone}\n`;
      
      if (examples && examples.length > 0) {
        promptContent += `\nEXAMPLES:\n`;
        examples.forEach((example: { name: string; content: string }, index: number) => {
          promptContent += `EXAMPLE ${index + 1} (${example.name}): ${example.content}\n\n`;
        });
      }
      
      // First, add the user prompt to UI and database
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        text: `Create a ${format} about ${goal}`,
        sender: "user"
      };
      
      setMessages(prev => [...prev, userMessage]);
      await saveMessage(userMessage, threadId);
      
      // Add a typing indicator for the AI
      const typingMessageId = `ai-typing-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: typingMessageId,
        text: "",
        sender: "assistant",
        isTyping: true,
        contentPreview: null
      }]);
      
      setIsTyping(true);
      
      // Call the edge function
      const response = await supabase.functions.invoke("chat-completions", {
        body: {
          threadId,
          content: promptContent,
          systemPrompt: getSystemPrompt("CREATE_CONTENT")
        }
      });

      if (response.error) {
        console.error("Error from edge function:", response.error);
        throw new Error(response.error.message || "Failed to create content");
      }

      const generatedContent = {
        ...contentData,
        content: response.data.content,
        title: title || "New Content"
      };

      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== typingMessageId);
        return [...filtered, {
          id: response.data.id || `ai-${Date.now()}`,
          text: `✅ Created "${generatedContent.title}"`,
          sender: "assistant",
          contentPreview: generatedContent
        }];
      });
      
      // If this is the first message, update the thread title
      if (messages.length <= 1) {
        const threadTitle = `Content: ${generatedContent.title}`;
        await updateThreadTitle(threadId, threadTitle);
      }
      
      return generatedContent;
      
    } catch (error) {
      console.error("Error creating content:", error);
      
      // Remove typing indicator and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [...filtered, {
          id: `error-${Date.now()}`,
          text: "Sorry, I encountered an error creating the content. Please try again.",
          sender: "assistant"
        }];
      });
      
      toast({
        title: "Error",
        description: "Failed to create content. Please try again later.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsTyping(false);
    }
  };

  // Load messages for a thread
  const loadMessages = async (threadId: string) => {
    if (!user) return;

    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      const formattedMessages: ChatMessage[] = data.map((msg) => {
        const message: ChatMessage = {
          id: msg.id,
          text: msg.content as string,
          sender: msg.role as "user" | "assistant",
        };

        // Check content for analysis markers
        if (message.sender === 'assistant' && message.text.includes("analyzed") && message.text.includes("posts")) {
          try {
            // This message is likely an analysis result
            message.analysisResult = true;
            
            // Try to extract structured analysis from metadata or regenerate it
            const sections = parseAnalysisResponse(message.text);
            if (sections.length > 0) {
              message.analysisData = sections;
            }
          } catch (e) {
            console.error("Error parsing analysis data:", e);
          }
        }

        // Check for content preview marker
        if (message.sender === 'assistant' && message.text.includes("Created") && message.text.includes("✅")) {
          message.contentPreview = { title: "Generated Content" };
        }

        return message;
      });

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
      toast({
        title: "Error",
        description: "Failed to load messages for this thread.",
        variant: "destructive"
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  // Load user's chat threads
  const loadThreads = async () => {
    if (!user) return;

    setLoadingThreads(true);
    try {
      const { data, error } = await supabase
        .from("chat_threads")
        .select("*")
        .eq("user_id", user.id)
        .order("last_message_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match the ChatThread interface
      const formattedThreads: ChatThread[] = data.map(thread => ({
        id: thread.id,
        title: thread.title,
        lastMessageAt: thread.last_message_at,
        createdAt: thread.created_at
      }));

      setThreads(formattedThreads);
    } catch (error) {
      console.error("Error loading threads:", error);
      setThreads([]);
      toast({
        title: "Error",
        description: "Failed to load chat threads.",
        variant: "destructive"
      });
    } finally {
      setLoadingThreads(false);
    }
  };

  // Create a new chat thread
  const createThread = async (title = "New Chat") => {
    if (!user) throw new Error("User not authenticated");

    try {
      const newThread = {
        id: uuidv4(),
        user_id: user.id,
        title,
      };

      const { error } = await supabase.from("chat_threads").insert(newThread);

      if (error) {
        throw error;
      }

      await loadThreads();
      
      const createdThread = {
        ...newThread,
        lastMessageAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      
      setCurrentThread(createdThread);
      return newThread.id;
    } catch (error) {
      console.error("Error creating thread:", error);
      toast({
        title: "Error",
        description: "Failed to create a new chat thread.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Update a thread's title
  const updateThreadTitle = async (threadId: string, title: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("chat_threads")
        .update({ title })
        .eq("id", threadId)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === threadId ? { ...thread, title } : thread
        )
      );

      if (currentThread?.id === threadId) {
        setCurrentThread((prev) => (prev ? { ...prev, title } : null));
      }
    } catch (error) {
      console.error("Error updating thread title:", error);
      toast({
        title: "Error",
        description: "Failed to update thread title.",
        variant: "destructive"
      });
    }
  };

  // Delete a thread
  const deleteThread = async (threadId: string) => {
    if (!user) return;

    try {
      // Delete the thread
      const { error } = await supabase
        .from("chat_threads")
        .delete()
        .eq("id", threadId)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      // Update the threads list
      setThreads((prev) => prev.filter((thread) => thread.id !== threadId));

      // If the current thread is deleted, set it to null
      if (currentThread?.id === threadId) {
        setCurrentThread(null);
        setMessages([]);
      }
      
      toast({
        title: "Thread Deleted",
        description: "The chat thread has been deleted successfully."
      });
    } catch (error) {
      console.error("Error deleting thread:", error);
      toast({
        title: "Error",
        description: "Failed to delete thread.",
        variant: "destructive"
      });
    }
  };

  // Save a content setup
  const saveContentSetup = async (setup: ContentSetup) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const newSetup = {
        id: setup.id || uuidv4(),
        user_id: user.id,
        name: setup.name,
        configuration: setup.configuration,
        examples: setup.examples || [],
        is_template: setup.isTemplate || false,
      };

      const { error } = await supabase.from("content_setups").upsert(newSetup);

      if (error) {
        throw error;
      }

      toast({
        title: "Setup Saved",
        description: `"${setup.name}" has been saved successfully.`
      });

      return newSetup.id;
    } catch (error) {
      console.error("Error saving content setup:", error);
      toast({
        title: "Error",
        description: "Failed to save content setup.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Load user's content setups
  const loadContentSetups = async (): Promise<ContentSetup[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from("content_setups")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data.map((setup) => {
        // Parse configuration and examples safely
        let configuration = { goal: "", format: "", hook: "", tone: "" };
        let examples: Array<{ name: string; content: string }> = [];
        
        try {
          if (setup.configuration && typeof setup.configuration === 'object') {
            const config = setup.configuration as Record<string, any>;
            configuration = {
              goal: config.goal?.toString() || "",
              format: config.format?.toString() || "",
              hook: config.hook?.toString() || "",
              tone: config.tone?.toString() || ""
            };
          }
        } catch (e) {
          console.error("Error parsing configuration:", e);
        }
        
        try {
          if (setup.examples && Array.isArray(setup.examples)) {
            examples = setup.examples.map((ex: any) => ({
              name: typeof ex.name === 'string' ? ex.name : "",
              content: typeof ex.content === 'string' ? ex.content : ""
            }));
          }
        } catch (e) {
          console.error("Error parsing examples:", e);
        }

        return {
          id: setup.id,
          name: setup.name,
          configuration,
          examples,
          isTemplate: setup.is_template,
        };
      });
    } catch (error) {
      console.error("Error loading content setups:", error);
      toast({
        title: "Error",
        description: "Failed to load content setups.",
        variant: "destructive"
      });
      return [];
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        threads,
        setThreads,
        currentThread,
        setCurrentThread,
        loadingThreads,
        loadingMessages,
        isTyping,
        saveMessage,
        loadMessages,
        loadThreads,
        createThread,
        updateThreadTitle,
        deleteThread,
        saveContentSetup,
        loadContentSetups,
        sendMessage,
        handleAnalyzeContent,
        handleCreateContent
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
