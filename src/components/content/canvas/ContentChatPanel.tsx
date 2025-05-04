
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Sparkles } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

interface ContentChatPanelProps {
  onSendMessage: (message: string) => void;
}

const ContentChatPanel: React.FC<ContentChatPanelProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI content assistant. I can help you create, edit, and improve your content. What would you like to work on today?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "Improve my introduction",
    "Make my content more engaging",
    "Add a strong conclusion",
    "Check my grammar and style",
    "Suggest a catchy headline"
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    onSendMessage(input);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (in a real app, this would come from an API)
    setTimeout(() => {
      generateAIResponse(input);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string) => {
    let response = "";
    
    if (userInput.toLowerCase().includes("improve") || userInput.toLowerCase().includes("better")) {
      response = "I've analyzed your content and here are some improvements:\n\n1. Your introduction could be more attention-grabbing\n2. Consider using more active voice\n3. The middle section needs more supporting evidence\n4. Your conclusion could be stronger";
    } else if (userInput.toLowerCase().includes("headline") || userInput.toLowerCase().includes("title")) {
      response = "Here are some headline suggestions based on your content:\n\n1. \"10 Surprising Ways to Boost Your Content Strategy\"\n2. \"The Ultimate Guide to Content That Converts\"\n3. \"How I Doubled My Engagement in Just 30 Days\"";
    } else if (userInput.toLowerCase().includes("grammar") || userInput.toLowerCase().includes("fix")) {
      response = "I've checked your content for grammar issues. Here are my suggestions:\n\n1. Replace 'their' with 'there' in paragraph 2\n2. The sentence in paragraph 3 is a run-on sentence\n3. Consider breaking up some of your longer paragraphs";
    } else if (userInput.toLowerCase().includes("conclusion")) {
      response = "Here's a stronger conclusion for your piece:\n\n\"With these strategies in place, you're now equipped to create content that not only resonates with your audience but drives meaningful engagement. The key is consistency and authentic value—delivering insights your readers can't find elsewhere.\"";
    } else {
      response = `I'll help you with "${userInput}". Based on your content, I recommend focusing on making your key points more concise and adding more specific examples to illustrate your ideas.`;
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: "ai",
    };
    setMessages((prev) => [...prev, aiMessage]);

    // Update suggested prompts based on conversation
    updateSuggestedPrompts(userInput);
  };

  const updateSuggestedPrompts = (userInput: string) => {
    // In a real implementation, this would be much more sophisticated
    if (userInput.toLowerCase().includes("headline") || userInput.toLowerCase().includes("title")) {
      setSuggestedPrompts([
        "Make my headline more catchy",
        "Generate 3 more headline options",
        "Which headline is most clickable?",
        "Add a subtitle suggestion",
      ]);
    } else if (userInput.toLowerCase().includes("grammar") || userInput.toLowerCase().includes("fix")) {
      setSuggestedPrompts([
        "Check my entire content for errors",
        "Make my tone more professional",
        "Simplify my language",
        "Make content easier to read",
      ]);
    } else {
      setSuggestedPrompts([
        "Suggest a better conclusion",
        "Help me add more evidence",
        "Make my point more clearly",
        "Add transition sentences",
      ]);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

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
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {message.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-white/5 border border-white/10">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="mb-3 space-y-2">
          <p className="text-xs text-white/50 mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                className="px-3 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI for help..."
            className="min-h-[40px] max-h-[120px] bg-white/5 border-white/10 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            variant="default"
            size="icon"
            className="bg-blue-600 hover:bg-blue-500 rounded-full h-10 w-10"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentChatPanel;
