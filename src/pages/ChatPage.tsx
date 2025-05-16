
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '@/contexts/ChatContext';
import { PageContainer } from '@/components/ui/page-container';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatPage = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const { 
    messages, 
    loadMessages, 
    sendMessage, 
    isTyping,
    currentThread,
    setCurrentThread,
    threads,
    createThread
  } = useChat();
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeChat = async () => {
      setLoading(true);
      
      // If no threadId provided, create a new thread
      if (!threadId) {
        const newThreadId = await createThread();
        window.history.pushState({}, '', `/dashboard/chat/${newThreadId}`);
        setLoading(false);
        return;
      }
      
      // Set current thread if it exists in threads
      const thread = threads.find(t => t.id === threadId);
      if (thread) {
        setCurrentThread(thread);
      }
      
      // Load messages for this thread
      await loadMessages(threadId);
      setLoading(false);
    };
    
    initializeChat();
  }, [threadId]);

  const handleSendMessage = async () => {
    if (!input.trim() || !threadId) return;
    
    await sendMessage(input, threadId, 'DEFAULT');
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <PageContainer className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-10">
                    <h2 className="text-2xl font-semibold mb-2">Welcome to Chat</h2>
                    <p className="text-white/70 max-w-md mx-auto">
                      Ask me anything about content creation, social media strategy, or how to grow your audience online.
                    </p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div 
                      className={cn(
                        "max-w-[80%] rounded-lg p-3", 
                        message.sender === "user" 
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!input.trim() || isTyping}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default ChatPage;
