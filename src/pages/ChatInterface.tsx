
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { CardContainer } from "@/components/ui/card-container";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Sparkles, PanelLeftOpen } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useChatHistory } from "@/hooks/use-chat-history";
import SuggestionChips from "@/components/chat/SuggestionChips";
import UserMessageContent from "@/components/chat/UserMessageContent";
import AssistantMessageContent from '@/components/chat/AssistantMessageContent';
import { getSystemPrompt } from "@/utils/systemPrompts";

const ChatInterface = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { threadId } = useParams<{ threadId?: string }>();
  const {
    threads,
    isLoadingThreads,
    currentThread,
    messages,
    isLoadingMessages,
    createThread,
    saveMessage,
    selectThread,
    startNewThread
  } = useChatHistory();
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if we're in an empty state
  useEffect(() => {
    if (messages && messages.length > 0) {
      setShowEmptyState(false);
    } else {
      setShowEmptyState(true);
    }
  }, [messages]);

  // Handle thread navigation
  useEffect(() => {
    if (threadId && threads.length > 0) {
      const thread = threads.find(t => t.id === threadId);
      if (thread) {
        selectThread(thread);
      } else {
        // Thread not found, navigate to main chat page
        navigate('/dashboard/chat');
        startNewThread();
      }
    } else if (!threadId) {
      // No thread ID in URL, start a new chat
      startNewThread();
    }
  }, [threadId, threads]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive"
      });
      return;
    }

    let activeThreadId = currentThread?.id;
    let activeThread = currentThread;

    // Create new thread if we don't have one
    if (!activeThreadId) {
      activeThread = await createThread();
      if (activeThread) {
        activeThreadId = activeThread.id;
        navigate(`/dashboard/chat/${activeThreadId}`);
      } else {
        return;
      }
    }

    const userContent = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Save user message
    await saveMessage(userContent, 'user', activeThreadId);

    try {
      // Call the OpenAI API through our Supabase Edge Function
      const response = await supabase.functions.invoke("chat-completions", {
        body: {
          threadId: activeThreadId,
          content: userContent,
          systemPrompt: getSystemPrompt("DEFAULT")
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to get AI response");
      }

      // Save AI response
      await saveMessage(response.data.content, 'assistant', activeThreadId);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get response from the AI assistant",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (text: string) => {
    let activeThreadId = currentThread?.id;
    let activeThread = currentThread;
    
    if (!activeThreadId) {
      activeThread = await createThread(text);
      if (activeThread) {
        activeThreadId = activeThread.id;
        navigate(`/dashboard/chat/${activeThreadId}`);
      } else {
        return;
      }
    }

    setIsTyping(true);
    
    // Save user message
    await saveMessage(text, 'user', activeThreadId);
    
    try {
      const response = await supabase.functions.invoke("chat-completions", {
        body: {
          threadId: activeThreadId,
          content: text,
          systemPrompt: getSystemPrompt("DEFAULT")
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to get AI response");
      }

      // Save AI response
      await saveMessage(response.data.content, 'assistant', activeThreadId);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from the AI",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <PageContainer className="flex-1 flex flex-col h-full animate-fade-in">
      <CardContainer className="flex-1 flex flex-col p-0 overflow-hidden" transparent>
        {showEmptyState ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-blue-400 mb-6">
              <Sparkles className="h-14 w-14 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Let's create standout content.</h2>
            <p className="text-base text-white/70 max-w-lg mb-8">Start a new conversation with our AI assistant.</p>
            
            <div className="w-full max-w-lg mb-8">
              <SuggestionChips
                suggestions={[
                  { id: 'analyze', text: 'Analyze some viral posts' },
                  { id: 'create', text: 'Create a content draft' },
                  { id: 'template', text: 'Help me with a template' }
                ]}
                onChipClick={handleQuickAction}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1">
              <div className="p-4">
                <div className="max-w-3xl mx-auto">
                  {isLoadingMessages ? (
                    <div className="flex justify-center p-4">
                      <div className="text-sm text-white/50">Loading messages...</div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className={`mb-6 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.role === 'assistant' && (
                          <Avatar className="h-9 w-9 mr-3 flex-shrink-0">
                            <div className="w-9 h-9 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.8733 3.44469C12.2502 2.7947 13.1766 3.0615 13.225 3.8143L13.266 4.48217C13.3007 5.0447 13.8251 5.43853 14.3728 5.27853L15.0029 5.0908C15.7296 4.8818 16.2772 5.67372 15.8518 6.28105L15.4896 6.8076C15.1722 7.25702 15.3061 7.8576 15.7849 8.12964L16.3621 8.45305C17.0037 8.8261 16.847 9.77126 16.1236 9.90459L15.4661 10.0252C14.9161 10.1272 14.5498 10.655 14.6542 11.2044L14.7747 11.8448C14.9119 12.5676 14.0696 13.0772 13.4908 12.6591L12.9687 12.2824C12.5185 11.9543 11.8982 12.056 11.5826 12.5267L11.2173 13.0725C10.8098 13.6802 9.84862 13.4133 9.80021 12.6605L9.75925 11.9926C9.72448 11.4301 9.20013 11.0363 8.65242 11.1963L8.02232 11.384C7.29561 11.593 6.74799 10.8011 7.17337 10.1938L7.53559 9.66722C7.85302 9.21781 7.71911 8.61723 7.24025 8.34519L6.66311 8.02178C6.02152 7.64873 6.17818 6.70356 6.90158 6.57023L7.55908 6.44962C8.10911 6.34757 8.47538 5.81983 8.37098 5.27038L8.25047 4.62998C8.11325 3.90717 8.95554 3.39761 9.53432 3.81569L10.0564 4.19245C10.5066 4.52055 11.127 4.41887 11.4426 3.94816L11.8733 3.44469Z" fill="#3B82F6" />
                                <path d="M14.9177 15.56C15.1577 15.1817 15.7253 15.339 15.7563 15.7868L15.7833 16.1799C15.8065 16.516 16.1197 16.757 16.4471 16.6583L16.8351 16.5386C17.2529 16.4105 17.5938 16.8972 17.3276 17.255L17.1082 17.5485C16.904 17.83 16.9864 18.2142 17.2877 18.3814L17.647 18.5846C18.0496 18.8158 17.9528 19.3916 17.4898 19.4716L17.1049 19.543C16.7705 19.6067 16.5384 19.9232 16.6039 20.2571L16.682 20.6411C16.7687 21.104 16.2496 21.4182 15.8956 21.1706L15.5846 20.9583C15.3002 20.7662 14.9227 20.8286 14.7237 21.101L14.4915 21.4141C14.2314 21.7762 13.6638 21.6189 13.6328 21.1711L13.6058 20.778C13.5826 20.4419 13.2694 20.2009 12.942 20.2996L12.554 20.4193C12.1362 20.5474 11.7953 20.0607 12.0615 19.7029L12.2809 19.4094C12.4851 19.1279 12.4027 18.7437 12.1014 18.5765L11.7422 18.3733C11.3395 18.1421 11.4363 17.5663 11.8993 17.4863L12.2842 17.4149C12.6186 17.3512 12.8508 17.0347 12.7852 16.7008L12.7072 16.3168C12.6204 15.8539 13.1395 15.5397 13.4936 15.7873L13.8045 15.9996C14.0889 16.1917 14.4664 16.1293 14.6654 15.8569L14.9177 15.56Z" fill="#3B82F6" />
                                <path d="M6.79117 14.9556C6.97559 14.7712 7.24199 14.8282 7.35464 15.0471L7.45405 15.2386C7.53693 15.3997 7.74171 15.4578 7.90235 15.3688L8.09388 15.2582C8.31229 15.1369 8.56254 15.303 8.52053 15.5398L8.48331 15.7467C8.45203 15.9266 8.56468 16.1064 8.74425 16.1622L8.95933 16.2303C9.19159 16.3037 9.22875 16.6155 9.01517 16.7259L8.82846 16.8254C8.66741 16.9092 8.58937 17.1132 8.64285 17.2743L8.70118 17.4552C8.77232 17.6727 8.53722 17.8698 8.31397 17.7741L8.12726 17.6918C7.95097 17.6171 7.75104 17.6903 7.65649 17.8566L7.54736 18.0432C7.42526 18.2556 7.15404 18.1987 7.04139 17.9798L6.94198 17.7882C6.85911 17.6271 6.65433 17.569 6.49368 17.6581L6.30215 17.7687C6.08374 17.89 5.83349 17.7238 5.8755 17.4871L5.91273 17.2801C5.944 17.1003 5.83136 16.9205 5.65178 16.8647L5.4367 16.7966C5.20444 16.7232 5.16728 16.4113 5.38086 16.301L5.56758 16.2015C5.72862 16.1177 5.80667 15.9137 5.75318 15.7526L5.69485 15.5716C5.62371 15.3542 5.85881 15.1571 6.08207 15.2528L6.26878 15.3351C6.44506 15.4098 6.64499 15.3366 6.73954 15.1703L6.79117 14.9556Z" fill="#3B82F6" />
                              </svg>
                            </div>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[80%] rounded-xl p-4 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#1A1F2C] text-white/90 border border-white/10'}`}>
                          {message.role === 'user' ? (
                            <UserMessageContent content={message.content} />
                          ) : (
                            <AssistantMessageContent content={message.content} />
                          )}
                        </div>

                        {message.role === 'user' && (
                          <Avatar className="h-9 w-9 ml-3 flex-shrink-0">
                            <div className="bg-gray-700 h-full w-full rounded-full flex items-center justify-center text-white">
                              {user?.email?.charAt(0).toUpperCase() || "U"}
                            </div>
                          </Avatar>
                        )}
                      </div>
                    ))
                  )}
                  
                  {isTyping && (
                    <div className="flex mb-6">
                      <Avatar className="h-9 w-9 mr-3 flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.8733 3.44469C12.2502 2.7947 13.1766 3.0615 13.225 3.8143L13.266 4.48217C13.3007 5.0447 13.8251 5.43853 14.3728 5.27853L15.0029 5.0908C15.7296 4.8818 16.2772 5.67372 15.8518 6.28105L15.4896 6.8076C15.1722 7.25702 15.3061 7.8576 15.7849 8.12964L16.3621 8.45305C17.0037 8.8261 16.847 9.77126 16.1236 9.90459L15.4661 10.0252C14.9161 10.1272 14.5498 10.655 14.6542 11.2044L14.7747 11.8448C14.9119 12.5676 14.0696 13.0772 13.4908 12.6591L12.9687 12.2824C12.5185 11.9543 11.8982 12.056 11.5826 12.5267L11.2173 13.0725C10.8098 13.6802 9.84862 13.4133 9.80021 12.6605L9.75925 11.9926C9.72448 11.4301 9.20013 11.0363 8.65242 11.1963L8.02232 11.384C7.29561 11.593 6.74799 10.8011 7.17337 10.1938L7.53559 9.66722C7.85302 9.21781 7.71911 8.61723 7.24025 8.34519L6.66311 8.02178C6.02152 7.64873 6.17818 6.70356 6.90158 6.57023L7.55908 6.44962C8.10911 6.34757 8.47538 5.81983 8.37098 5.27038L8.25047 4.62998C8.11325 3.90717 8.95554 3.39761 9.53432 3.81569L10.0564 4.19245C10.5066 4.52055 11.127 4.41887 11.4426 3.94816L11.8733 3.44469Z" fill="#3B82F6" />
                            <path d="M14.9177 15.56C15.1577 15.1817 15.7253 15.339 15.7563 15.7868L15.7833 16.1799C15.8065 16.516 16.1197 16.757 16.4471 16.6583L16.8351 16.5386C17.2529 16.4105 17.5938 16.8972 17.3276 17.255L17.1082 17.5485C16.904 17.83 16.9864 18.2142 17.2877 18.3814L17.647 18.5846C18.0496 18.8158 17.9528 19.3916 17.4898 19.4716L17.1049 19.543C16.7705 19.6067 16.5384 19.9232 16.6039 20.2571L16.682 20.6411C16.7687 21.104 16.2496 21.4182 15.8956 21.1706L15.5846 20.9583C15.3002 20.7662 14.9227 20.8286 14.7237 21.101L14.4915 21.4141C14.2314 21.7762 13.6638 21.6189 13.6328 21.1711L13.6058 20.778C13.5826 20.4419 13.2694 20.2009 12.942 20.2996L12.554 20.4193C12.1362 20.5474 11.7953 20.0607 12.0615 19.7029L12.2809 19.4094C12.4851 19.1279 12.4027 18.7437 12.1014 18.5765L11.7422 18.3733C11.3395 18.1421 11.4363 17.5663 11.8993 17.4863L12.2842 17.4149C12.6186 17.3512 12.8508 17.0347 12.7852 16.7008L12.7072 16.3168C12.6204 15.8539 13.1395 15.5397 13.4936 15.7873L13.8045 15.9996C14.0889 16.1917 14.4664 16.1293 14.6654 15.8569L14.9177 15.56Z" fill="#3B82F6" />
                            <path d="M6.79117 14.9556C6.97559 14.7712 7.24199 14.8282 7.35464 15.0471L7.45405 15.2386C7.53693 15.3997 7.74171 15.4578 7.90235 15.3688L8.09388 15.2582C8.31229 15.1369 8.56254 15.303 8.52053 15.5398L8.48331 15.7467C8.45203 15.9266 8.56468 16.1064 8.74425 16.1622L8.95933 16.2303C9.19159 16.3037 9.22875 16.6155 9.01517 16.7259L8.82846 16.8254C8.66741 16.9092 8.58937 17.1132 8.64285 17.2743L8.70118 17.4552C8.77232 17.6727 8.53722 17.8698 8.31397 17.7741L8.12726 17.6918C7.95097 17.6171 7.75104 17.6903 7.65649 17.8566L7.54736 18.0432C7.42526 18.2556 7.15404 18.1987 7.04139 17.9798L6.94198 17.7882C6.85911 17.6271 6.65433 17.569 6.49368 17.6581L6.30215 17.7687C6.08374 17.89 5.83349 17.7238 5.8755 17.4871L5.91273 17.2801C5.944 17.1003 5.83136 16.9205 5.65178 16.8647L5.4367 16.7966C5.20444 16.7232 5.16728 16.4113 5.38086 16.301L5.56758 16.2015C5.72862 16.1177 5.80667 15.9137 5.75318 15.7526L5.69485 15.5716C5.62371 15.3542 5.85881 15.1571 6.08207 15.2528L6.26878 15.3351C6.44506 15.4098 6.64499 15.3366 6.73954 15.1703L6.79117 14.9556Z" fill="#3B82F6" />
                          </svg>
                        </div>
                      </Avatar>
                      <div className="bg-[#1A1F2C] text-white/90 border border-white/10 p-4 rounded-xl max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ScrollArea>

            <div className="p-4">
              <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
                <div className="relative flex flex-col rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <Textarea 
                    className="bg-transparent text-white pl-5 pr-5 py-4 min-h-[52px] resize-none w-full max-h-[160px] overflow-y-auto border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[16px]"
                    placeholder="Type your message..." 
                    value={inputValue} 
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (inputValue.trim()) {
                          handleSendMessage(e);
                        }
                      }
                    }}
                  />
                  <div className="h-12 flex justify-end items-center px-3">
                    <Button 
                      type="submit" 
                      className="h-9 w-9 p-0 rounded-full bg-blue-600 hover:bg-blue-500" 
                      size="icon"
                      disabled={!inputValue.trim() || isTyping}
                    >
                      <SendHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </CardContainer>
    </PageContainer>
  );
};

export default ChatInterface;
