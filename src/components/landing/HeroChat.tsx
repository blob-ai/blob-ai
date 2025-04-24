import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SendHorizontal, AtSign, FileText, Circle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";

// Updated initial message from AI
const initialMessage = "Hi there! I can help you analyze top-performing accounts, create standout content, and build your brand strategy. What would you like to do?";

// Chat message types
type MessageType = "ai" | "user";

interface Message {
  id: string;
  content: string;
  type: MessageType;
}

interface ActionButton {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface SuggestionChip {
  id: string;
  label: string;
}

export const HeroChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [actionButtons, setActionButtons] = useState<ActionButton[]>([]);
  const [suggestionChips, setSuggestionChips] = useState<SuggestionChip[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize chat with AI greeting
  useEffect(() => {
    const initChat = async () => {
      // Wait a moment before showing the initial message
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add the initial AI message with typing animation
      const messageId = Date.now().toString();
      setMessages([{ id: messageId, content: "", type: "ai" }]);
      setTypingMessageId(messageId);
      
      // Simulate typing effect
      let i = 0;
      const typingInterval = setInterval(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: initialMessage.substring(0, i) } 
              : msg
          )
        );
        
        i++;
        if (i > initialMessage.length) {
          clearInterval(typingInterval);
          setTypingMessageId(null);
          
          // Show action buttons after message is fully typed
          setActionButtons([
            {
              icon: <AtSign className="w-4 h-4" />,
              label: "Analyze an account",
              onClick: () => handleAnalyzeAccount()
            },
            {
              icon: <FileText className="w-4 h-4" />,
              label: "Create content",
              onClick: () => handleCreateContent()
            }
          ]);
        }
      }, 30);
      
      return () => clearInterval(typingInterval);
    };
    
    initChat();
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Handle analyzing an account
  const handleAnalyzeAccount = () => {
    // Add user message
    const userMessageId = `user-${Date.now()}`;
    const userMessage = "Analyze this account for me: @elonmusk";
    
    setMessages(prev => [
      ...prev, 
      { id: userMessageId, content: userMessage, type: "user" }
    ]);
    
    // Clear action buttons
    setActionButtons([]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponseId = `ai-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        { id: aiResponseId, content: "", type: "ai" }
      ]);
      setTypingMessageId(aiResponseId);
      
      const response = "I'll analyze that for you. Looking at the patterns, style, and engagement factors...";
      let i = 0;
      
      const typingInterval = setInterval(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiResponseId 
              ? { ...msg, content: response.substring(0, i) } 
              : msg
          )
        );
        
        i++;
        if (i > response.length) {
          clearInterval(typingInterval);
          setTypingMessageId(null);
          
          // Add typing indicator for a moment
          setTimeout(() => {
            // Add final analysis message that starts typing but transitions to login prompt
            const finalAnalysisId = `ai-${Date.now()}`;
            setMessages(prev => [
              ...prev,
              { id: finalAnalysisId, content: "", type: "ai" }
            ]);
            setTypingMessageId(finalAnalysisId);
            
            const analysisStart = "Based on my analysis, I've found some interesting patterns: ";
            const firstWord = "user";
            let analysisIndex = 0;
            let isTypingFirstWord = false;
            
            const analysisInterval = setInterval(() => {
              if (analysisIndex < analysisStart.length) {
                // Type out the initial part
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === finalAnalysisId 
                      ? { ...msg, content: analysisStart.substring(0, analysisIndex) } 
                      : msg
                  )
                );
                analysisIndex++;
              } else if (!isTypingFirstWord) {
                // Start typing the first word
                isTypingFirstWord = true;
                
                // Wait a brief moment then replace with login prompt
                setTimeout(() => {
                  clearInterval(analysisInterval);
                  setTypingMessageId(null);
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === finalAnalysisId 
                        ? { ...msg, content: analysisStart + "<em class='text-white/60'>log in to view</em>" } 
                        : msg
                    )
                  );
                  
                  // Add suggestion chips
                  setSuggestionChips([
                    { id: "chip-1", label: "Generate similar content ideas" },
                    { id: "chip-2", label: "Analyze content topics" },
                    { id: "chip-3", label: "Analyze language and tone" }
                  ]);
                }, 500);
              }
            }, 30);
            
          }, 600);
        }
      }, 30);
    }, 500);
  };
  
  // Handle creating content
  const handleCreateContent = () => {
    setShowLoginPrompt(true);
  };
  
  // Handle suggestion chip click
  const handleChipClick = () => {
    setShowLoginPrompt(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setShowLoginPrompt(true);
      setInputValue("");
    }
  };
  
  // Handle login navigation
  const handleLoginClick = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="chat-container w-[80%] mx-auto ai-message-glow">
      <div className="chat-header">
        <div className="w-8"></div> {/* Spacer for centering */}
        <div className="text-sm text-white/60">inspire.me chat</div>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>
      
      <div className="p-5 min-h-[280px] flex flex-col" ref={chatContainerRef}>
        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.8733 3.44469C12.2502 2.7947 13.1766 3.0615 13.225 3.8143L13.266 4.48217C13.3007 5.0447 13.8251 5.43853 14.3728 5.27853L15.0029 5.0908C15.7296 4.8818 16.2772 5.67372 15.8518 6.28105L15.4896 6.8076C15.1722 7.25702 15.3061 7.8576 15.7849 8.12964L16.3621 8.45305C17.0037 8.8261 16.847 9.77126 16.1236 9.90459L15.4661 10.0252C14.9161 10.1272 14.5498 10.655 14.6542 11.2044L14.7747 11.8448C14.9119 12.5676 14.0696 13.0772 13.4908 12.6591L12.9687 12.2824C12.5185 11.9543 11.8982 12.056 11.5826 12.5267L11.2173 13.0725C10.8098 13.6802 9.84862 13.4133 9.80021 12.6605L9.75925 11.9926C9.72448 11.4301 9.20013 11.0363 8.65242 11.1963L8.02232 11.384C7.29561 11.593 6.74799 10.8011 7.17337 10.1938L7.53559 9.66722C7.85302 9.21781 7.71911 8.61723 7.24025 8.34519L6.66311 8.02178C6.02152 7.64873 6.17818 6.70356 6.90158 6.57023L7.55908 6.44962C8.10911 6.34757 8.47538 5.81983 8.37098 5.27038L8.25047 4.62998C8.11325 3.90717 8.95554 3.39761 9.53432 3.81569L10.0564 4.19245C10.5066 4.52055 11.127 4.41887 11.4426 3.94816L11.8733 3.44469Z" fill="#4169E1" />
                      <path d="M14.9177 15.56C15.1577 15.1817 15.7253 15.339 15.7563 15.7868L15.7833 16.1799C15.8065 16.516 16.1197 16.757 16.4471 16.6583L16.8351 16.5386C17.2529 16.4105 17.5938 16.8972 17.3276 17.255L17.1082 17.5485C16.904 17.83 16.9864 18.2142 17.2877 18.3814L17.647 18.5846C18.0496 18.8158 17.9528 19.3916 17.4898 19.4716L17.1049 19.543C16.7705 19.6067 16.5384 19.9232 16.6039 20.2571L16.682 20.6411C16.7687 21.104 16.2496 21.4182 15.8956 21.1706L15.5846 20.9583C15.3002 20.7662 14.9227 20.8286 14.7237 21.101L14.4915 21.4141C14.2314 21.7762 13.6638 21.6189 13.6328 21.1711L13.6058 20.778C13.5826 20.4419 13.2694 20.2009 12.942 20.2996L12.554 20.4193C12.1362 20.5474 11.7953 20.0607 12.0615 19.7029L12.2809 19.4094C12.4851 19.1279 12.4027 18.7437 12.1014 18.5765L11.7422 18.3733C11.3395 18.1421 11.4363 17.5663 11.8993 17.4863L12.2842 17.4149C12.6186 17.3512 12.8508 17.0347 12.7852 16.7008L12.7072 16.3168C12.6204 15.8539 13.1395 15.5397 13.4936 15.7873L13.8045 15.9996C14.0889 16.1917 14.4664 16.1293 14.6654 15.8569L14.9177 15.56Z" fill="#4169E1" />
                      <path d="M6.79117 14.9556C6.97559 14.7712 7.24199 14.8282 7.35464 15.0471L7.45405 15.2386C7.53693 15.3997 7.74171 15.4578 7.90235 15.3688L8.09388 15.2582C8.31229 15.1369 8.56254 15.303 8.52053 15.5398L8.48331 15.7467C8.45203 15.9266 8.56468 16.1064 8.74425 16.1622L8.95933 16.2303C9.19159 16.3037 9.22875 16.6155 9.01517 16.7259L8.82846 16.8254C8.66741 16.9092 8.58937 17.1132 8.64285 17.2743L8.70118 17.4552C8.77232 17.6727 8.53722 17.8698 8.31397 17.7741L8.12726 17.6918C7.95097 17.6171 7.75104 17.6903 7.65649 17.8566L7.54736 18.0432C7.42526 18.2556 7.15404 18.1987 7.04139 17.9798L6.94198 17.7882C6.85911 17.6271 6.65433 17.569 6.49368 17.6581L6.30215 17.7687C6.08374 17.89 5.83349 17.7238 5.8755 17.4871L5.91273 17.2801C5.944 17.1003 5.83136 16.9205 5.65178 16.8647L5.4367 16.7966C5.20444 16.7232 5.16728 16.4113 5.38086 16.301L5.56758 16.2015C5.72862 16.1177 5.80667 15.9137 5.75318 15.7526L5.69485 15.5716C5.62371 15.3542 5.85881 15.1571 6.08207 15.2528L6.26878 15.3351C6.44506 15.4098 6.64499 15.3366 6.73954 15.1703L6.79117 14.9556Z" fill="#4169E1" />
                    </svg>
                  </div>
                </div>
              )}
              
              <div 
                className={`chat-message ${
                  message.type === 'user' 
                    ? 'chat-message-user' 
                    : 'chat-message-ai'
                }`}
              >
                {message.content ? (
                  <div dangerouslySetInnerHTML={{ __html: message.content }} />
                ) : (
                  typingMessageId === message.id && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-white/70">typing</span>
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {typingMessageId && (
            <div className="flex items-center text-xs text-white/50 mt-2">
              <div className="flex ml-11 items-center space-x-1">
                <div className="text-xs">AI is typing</div>
              </div>
            </div>
          )}
          
          {/* Suggestion chips */}
          {suggestionChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {suggestionChips.map((chip) => (
                <Button
                  key={chip.id}
                  variant="outline"
                  className="suggestion-chip"
                  onClick={handleChipClick}
                >
                  {chip.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Action buttons and chat input */}
      <div className="p-3 border-t border-white/10">
        {/* Action buttons */}
        {actionButtons.length > 0 && (
          <div className="flex flex-wrap justify-start gap-2 mb-3">
            {actionButtons.map((button, index) => (
              <Button
                key={index}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 gap-2 rounded-xl"
                onClick={button.onClick}
              >
                {button.icon}
                {button.label}
              </Button>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              className="chat-input w-full"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <Button 
            type="submit"
            size="icon"
            className="bg-primary-600 hover:bg-primary-500 text-white h-10 w-10 rounded-xl"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
      
      {/* Login prompt dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>
              To use inspire.me, you'll need to be logged in. Once you're logged in, I can help you analyze accounts, generate content and much more!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              className="bg-primary-600 hover:bg-primary-500 text-white w-full sm:w-auto rounded-xl"
              onClick={handleLoginClick}
            >
              Sign in
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto rounded-xl"
              onClick={handleLoginClick}
            >
              Sign up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
