import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  File, FileText, MessageSquare, Save, Sparkles, 
  RefreshCw, X, CheckCircle, Send, Layout, Type, Lightbulb,
  ArrowLeft
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface LibraryCreateStyleProps {
  onBack?: () => void;
}

// Updated step titles to match new flow
const stepTitles = [
  "Choose what to create",
  "Choose creation method",
  "Add details",
  "Review and save"
];

// ... keep existing code (categories, tones, formats, and type definitions)
const categories = ["Tech", "Marketing", "Personal Growth", "Business", "Humor", "Education", "Other"];
const tones = ["Bold", "Thoughtful", "Casual", "Analytical", "Motivational", "Educational", "Sarcastic", "Direct", "Conversational"];
const formats = ["One-liners", "Threads", "Lists", "Stories", "Questions", "How-to guides"];

type CreationType = "style" | "template";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const LibraryCreateStyle: React.FC<LibraryCreateStyleProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [styleName, setStyleName] = useState("");
  const [creationMethod, setCreationMethod] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [creationType, setCreationType] = useState<CreationType>("style");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewExamples, setPreviewExamples] = useState<string[]>([
    "This is where your style preview will appear.",
    "Add tones or chat with AI to see examples of your style."
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const handleNext = () => {
    if (step < stepTitles.length) {
      setStep(step + 1);
      
      // Initialize chat if AI method is selected
      if (step === 2 && creationMethod === "chat") {
        // Different initial message based on creation type
        const initialMessage = creationType === "style" 
          ? "Let's build your style together! What kind of tone are you going for? Bold, reflective, funny, educational, or something else?"
          : "Let's create your content template! What type of content structure do you need? A thread format, a story structure, a job posting, or something else?";
          
        setChatMessages([
          {
            role: "assistant",
            content: initialMessage
          }
        ]);
        generatePreviewExamples();
      }
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onBack) {
      onBack();
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setCreationMethod("upload");
    }
  };
  
  const handlePasteText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPastedText(e.target.value);
    if (e.target.value) {
      setCreationMethod("paste");
    }
  };
  
  const handleToneToggle = (tone: string) => {
    if (selectedTones.includes(tone)) {
      setSelectedTones(selectedTones.filter(t => t !== tone));
    } else {
      if (selectedTones.length < 3) {
        setSelectedTones([...selectedTones, tone]);
        generatePreviewExamples();
      }
    }
  };
  
  const handleFormatToggle = (format: string) => {
    if (selectedFormats.includes(format)) {
      setSelectedFormats(selectedFormats.filter(f => f !== format));
    } else {
      if (selectedFormats.length < 2) {
        setSelectedFormats([...selectedFormats, format]);
        generatePreviewExamples();
      }
    }
  };
  
  const isNextDisabled = () => {
    if (step === 1) return false; // No requirements for first step anymore
    if (step === 2) return !creationMethod || (creationMethod === "paste" && !pastedText) || (creationMethod === "upload" && !uploadedFile);
    if (step === 3 && creationMethod !== "chat") return !selectedCategory;
    return false;
  };
  
  const sendChatMessage = () => {
    if (!currentMessage.trim()) return;
    
    const newUserMessage = { role: "user" as const, content: currentMessage };
    setChatMessages([...chatMessages, newUserMessage]);
    setCurrentMessage("");
    setIsAnalyzing(true);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      let aiResponse = "";
      
      // Different responses based on creation type
      if (creationType === "style") {
        // Style-specific AI response logic
        if (currentMessage.toLowerCase().includes("direct") || currentMessage.toLowerCase().includes("bold")) {
          aiResponse = "I notice you prefer a direct, bold tone. Would you also like your content to be brief and punchy, or more detailed with examples?";
          if (!selectedTones.includes("Bold")) {
            setSelectedTones([...selectedTones, "Bold"].slice(0, 3));
          }
          if (!selectedTones.includes("Direct")) {
            setSelectedTones([...selectedTones.filter(t => t !== "Conversational"), "Direct"].slice(0, 3));
          }
        } else if (currentMessage.toLowerCase().includes("humor") || currentMessage.toLowerCase().includes("funny")) {
          aiResponse = "Humor is a great way to engage your audience. Do you prefer subtle wit or more obvious jokes in your content?";
          if (!selectedTones.includes("Casual")) {
            setSelectedTones([...selectedTones, "Casual"].slice(0, 3));
          }
        } else {
          aiResponse = "Based on your input, I'd suggest mixing some educational content with conversational elements. How do you feel about using questions to engage your readers?";
          if (selectedTones.length === 0) {
            setSelectedTones(["Conversational"]);
          }
        }
      } else {
        // Template-specific AI response logic
        if (currentMessage.toLowerCase().includes("thread") || currentMessage.toLowerCase().includes("twitter")) {
          aiResponse = "A thread template would work well for this. Would you like numbered posts, a hook + explanation format, or a step-by-step approach?";
          if (!selectedFormats.includes("Threads")) {
            setSelectedFormats([...selectedFormats, "Threads"].slice(0, 2));
          }
        } else if (currentMessage.toLowerCase().includes("job") || currentMessage.toLowerCase().includes("hiring")) {
          aiResponse = "For a job posting template, would you prefer focusing on company culture, job responsibilities, or candidate qualifications first?";
          if (!selectedFormats.includes("Lists")) {
            setSelectedFormats([...selectedFormats, "Lists"].slice(0, 2));
          }
        } else {
          aiResponse = "I can help create a template with clear sections. Would you like headings, bullet points, or paragraph-based organization?";
          if (selectedFormats.length === 0) {
            setSelectedFormats(["How-to guides"]);
          }
        }
      }
      
      const newAiMessage = { role: "assistant" as const, content: aiResponse };
      setChatMessages(prev => [...prev, newAiMessage]);
      setIsAnalyzing(false);
      
      // Generate new examples based on the conversation
      generatePreviewExamples();
    }, 1500);
  };
  
  const generatePreviewExamples = () => {
    setIsAnalyzing(true);
    
    // Simulate generating examples based on selected tones and formats
    setTimeout(() => {
      if (creationType === "style") {
        // Generate style examples
        generateStyleExamples();
      } else {
        // Generate template examples
        generateTemplateExamples();
      }
      
      setIsAnalyzing(false);
    }, 1000);
  };

  // New function to generate style-specific examples
  const generateStyleExamples = () => {
    const styleExamples = [];
    
    if (selectedTones.includes("Bold") || chatMessages.some(m => m.content.toLowerCase().includes("bold"))) {
      styleExamples.push("Stop looking for shortcuts. The path to success is the path most people avoid.");
    }
    
    if (selectedTones.includes("Educational") || chatMessages.some(m => m.content.toLowerCase().includes("teach"))) {
      styleExamples.push("The 3 key factors for sustainable growth:\n1. Customer acquisition\n2. Retention strategy\n3. Revenue optimization");
    }
    
    if (selectedTones.includes("Conversational")) {
      styleExamples.push("Ever wonder why some products just feel right? It's not an accident. It's deep customer understanding.");
    }
    
    if (selectedTones.includes("Direct")) {
      styleExamples.push("Focus or fail. You can't be exceptional at everything.");
    }
    
    // If we have examples based on selections, use those
    if (styleExamples.length > 0) {
      setPreviewExamples(styleExamples);
    } else {
      // Otherwise use some default examples
      setPreviewExamples([
        "This is how your style might sound. The more you tell me about tone and vocabulary preferences, the better.",
        "Try adding some tones or formats to see more tailored language examples."
      ]);
    }
  };
  
  // New function to generate template-specific examples
  const generateTemplateExamples = () => {
    const templateExamples = [];
    
    if (selectedFormats.includes("Threads") || chatMessages.some(m => m.content.toLowerCase().includes("thread"))) {
      templateExamples.push("🧵 [THREAD]: {topic title}\n\n1️⃣ {intro point}\n\n2️⃣ {main point with detail}\n\n3️⃣ {supporting evidence}\n\n4️⃣ {actionable insight}\n\n5️⃣ {conclusion with CTA}");
    }
    
    if (selectedFormats.includes("Lists") || chatMessages.some(m => m.content.toLowerCase().includes("list"))) {
      templateExamples.push("📋 {Headline Title}: {Subtitle}\n\n• {First key point}\n• {Second key point with brief explanation}\n• {Third key point with example}\n• {Fourth point with action item}\n\n👉 {Call to action}");
    }
    
    if (selectedFormats.includes("How-to guides")) {
      templateExamples.push("🔎 HOW TO: {Specific goal}\n\nProblem: {Pain point description}\n\nSolution: {Overview of approach}\n\nStep 1: {First action item}\nStep 2: {Second action with details}\nStep 3: {Final step}\n\nResults: {Expected outcome}\n\n💡 Pro tip: {Insider advice}");
    }
    
    // If we have examples based on selections, use those
    if (templateExamples.length > 0) {
      setPreviewExamples(templateExamples);
    } else {
      // Otherwise use some default examples
      setPreviewExamples([
        "{Title/Headline}\n\n{Opening section}\n\n{Body with key points}\n\n{Call to action}",
        "Try selecting a format to see specific template structures."
      ]);
    }
  };
  
  useEffect(() => {
    // Scroll to bottom of chat when new messages appear
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);
  
  const refreshExamples = () => {
    generatePreviewExamples();
    toast.success("Generated new preview examples");
  };
  
  const handleSaveStyle = () => {
    if (!styleName.trim()) {
      toast.error("Please provide a name for your " + creationType);
      return;
    }
    
    toast.success(`${creationType === 'style' ? 'Style' : 'Template'} saved successfully!`);
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Back button */}
      {onBack && (
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="self-start mb-4 -ml-2 text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Styles
        </Button>
      )}
    
      {/* Step indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {stepTitles.map((title, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                idx + 1 === step ? "bg-[#3260ea]" : 
                idx + 1 < step ? "bg-[#3260ea]/50" : "bg-[#1E2431]"
              }`}>
                <span className="text-white">{idx + 1}</span>
              </div>
              <span className={`text-xs ${idx + 1 === step ? "text-white" : "text-white/50"}`}>
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content area */}
      <CardContainer className="max-w-5xl mx-auto w-full bg-[#1A202C] border-white/10 flex-grow overflow-hidden shadow-md">
        <ScrollArea className="h-full p-4">
          {/* Step 1: Choose what to create */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium mb-4 text-white">Choose what to create</h2>
              <p className="text-white/80 mb-6">
                Select the type of content assistant you want to create. Each serves a different purpose.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <CardContainer 
                  className={`transition-all p-5 cursor-pointer ${
                    creationType === "style" ? "border-[#3260ea] bg-[#151A24]" : "hover:border-white/20"
                  }`}
                  onClick={() => setCreationType("style")}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-blue-600/20 rounded-full mb-4">
                      <Type className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Style</h3>
                    <p className="text-sm text-white/70 mb-4">
                      Create a voice assistant that mimics specific tones, vocabulary, and writing patterns.
                    </p>
                    
                    <div className="w-full p-3 bg-[#1A1F2C] rounded-md text-xs text-left">
                      <p className="font-medium text-white/90 mb-1">Great for creating:</p>
                      <ul className="space-y-1 text-white/70">
                        <li>• Educational Expert Voice</li>
                        <li>• Humorous Reply Style</li>
                        <li>• Thought Leadership Tone</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <Switch 
                        checked={creationType === "style"} 
                        onCheckedChange={() => setCreationType("style")}
                      />
                    </div>
                  </div>
                </CardContainer>
                
                <CardContainer 
                  className={`transition-all p-5 cursor-pointer ${
                    creationType === "template" ? "border-[#3260ea] bg-[#151A24]" : "hover:border-white/20"
                  }`}
                  onClick={() => setCreationType("template")}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-emerald-600/20 rounded-full mb-4">
                      <Layout className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Template</h3>
                    <p className="text-sm text-white/70 mb-4">
                      Create a structure assistant that generates organized, consistent content formats.
                    </p>
                    
                    <div className="w-full p-3 bg-[#1A1F2C] rounded-md text-xs text-left">
                      <p className="font-medium text-white/90 mb-1">Great for creating:</p>
                      <ul className="space-y-1 text-white/70">
                        <li>• LinkedIn Job Postings</li>
                        <li>• Twitter Thread Format</li>
                        <li>• Educational Carousel Layout</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <Switch 
                        checked={creationType === "template"} 
                        onCheckedChange={() => setCreationType("template")}
                      />
                    </div>
                  </div>
                </CardContainer>
              </div>
              
              <div className="mt-6 p-4 bg-[#151A24] border border-white/10 rounded-lg">
                <h4 className="text-lg font-medium mb-2 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-amber-400" />
                  How will this help me?
                </h4>
                <p className="text-sm text-white/80">
                  {creationType === "style" 
                    ? "A Style assistant will help you maintain a consistent voice across all your content, mimicking specific tones and vocabulary patterns that resonate with your audience."
                    : "A Template assistant will help you create structurally consistent content more quickly, ensuring all necessary elements are included in the right order and format."}
                </p>
              </div>
            </div>
          )}
          
          {/* Step 2: Choose creation method */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium mb-4 text-white">
                How would you like to create your {creationType === "style" ? "style" : "template"}?
              </h2>
              
              <CardContainer 
                className={`style-creation-card transition-all p-4 ${
                  creationMethod === "upload" ? "border-[#3260ea] bg-[#151A24]" : "hover:border-white/20"
                }`}
                onClick={() => setCreationMethod("upload")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <FileText className="h-6 w-6 text-[#3260ea]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Upload writing samples</h3>
                    <p className="text-sm text-white/60">Upload documents or social media exports</p>
                  </div>
                </div>
                
                {creationMethod === "upload" && (
                  <div className="mt-4">
                    <Input 
                      type="file" 
                      accept=".txt,.doc,.docx,.pdf" 
                      onChange={handleFileUpload}
                      className="bg-black/30 border-white/10"
                    />
                    {uploadedFile && (
                      <p className="mt-2 text-sm text-[#3260ea]">
                        {uploadedFile.name} selected
                      </p>
                    )}
                  </div>
                )}
              </CardContainer>
              
              <CardContainer 
                className={`style-creation-card transition-all p-4 ${
                  creationMethod === "paste" ? "border-[#3260ea] bg-[#151A24]" : "hover:border-white/20"
                }`}
                onClick={() => setCreationMethod("paste")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <File className="h-6 w-6 text-[#3260ea]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Paste text directly</h3>
                    <p className="text-sm text-white/60">Paste examples of your writing</p>
                  </div>
                </div>
                
                {creationMethod === "paste" && (
                  <div className="mt-4">
                    <Textarea 
                      placeholder="Paste your writing samples here..."
                      value={pastedText}
                      onChange={handlePasteText}
                      className="bg-black/30 border-white/10 min-h-[150px]"
                    />
                  </div>
                )}
              </CardContainer>
              
              <CardContainer 
                className={`style-creation-card transition-all p-4 ${
                  creationMethod === "chat" ? "border-[#3260ea] bg-[#151A24]" : "hover:border-white/20"
                }`}
                onClick={() => setCreationMethod("chat")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-[#3260ea]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Chat with AI</h3>
                    <p className="text-sm text-white/60">Co-create your {creationType} by describing it to our AI</p>
                  </div>
                </div>
                
                {creationMethod === "chat" && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-white/80">
                      You'll be able to chat with our AI assistant to define your {creationType} after proceeding to the next step.
                    </p>
                  </div>
                )}
              </CardContainer>
            </div>
          )}
          
          {/* Step 3: AI Co-creation Interface or Manual Details */}
          {step === 3 && creationMethod === "chat" && (
            <div className="flex flex-col md:flex-row h-full gap-6">
              {/* Left Panel - Chat Interface */}
              <div className="flex-1 h-[500px] md:h-auto">
                <div className="bg-[#151A24] border border-white/10 rounded-lg p-3 h-full flex flex-col shadow-md">
                  <h3 className="font-medium text-lg mb-2 text-white">Chat with AI</h3>
                  <p className="text-sm text-white/80 mb-3">
                    Describe your ideal {creationType} and we'll help you build it
                  </p>
                  
                  {/* Chat Messages */}
                  <div className="flex-grow overflow-auto p-2 bg-[#141821] rounded-md mb-3 border border-white/5">
                    <div className="space-y-4">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div 
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.role === "user" 
                                ? "bg-[#3260ea]/20 text-white/90 border border-[#3260ea]/20" 
                                : "bg-[#1E2431] text-white/90 border border-white/10"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isAnalyzing && (
                        <div className="flex justify-start">
                          <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#1E2431] text-white/90 border border-white/10">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Thinking...</span>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef}></div>
                    </div>
                  </div>
                  
                  {/* Chat Input */}
                  <div className="flex space-x-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder={`Describe your preferred ${creationType}...`}
                      className="bg-[#1A202C] border-white/10"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendChatMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={sendChatMessage} 
                      disabled={!currentMessage.trim() || isAnalyzing}
                      className="bg-[#3260ea] hover:bg-[#2853c6] px-3"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Chat Suggestions - Updated based on creation type */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {creationType === "style" ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent border-white/20 hover:bg-white/5 text-xs"
                          onClick={() => {
                            setCurrentMessage("I want a bold, direct style for marketing");
                            setTimeout(() => sendChatMessage(), 100);
                          }}
                        >
                          Bold marketing style
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent border-white/20 hover:bg-white/5 text-xs"
                          onClick={() => {
                            setCurrentMessage("I need an educational style for technical content");
                            setTimeout(() => sendChatMessage(), 100);
                          }}
                        >
                          Educational tech style
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent border-white/20 hover:bg-white/5 text-xs"
                          onClick={() => {
                            setCurrentMessage("I want a Twitter thread template with numbered posts");
                            setTimeout(() => sendChatMessage(), 100);
                          }}
                        >
                          Twitter thread template
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent border-white/20 hover:bg-white/5 text-xs"
                          onClick={() => {
                            setCurrentMessage("I need a job posting template for LinkedIn");
                            setTimeout(() => sendChatMessage(), 100);
                          }}
                        >
                          LinkedIn job post
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right Panel - Style/Template Builder */}
              <div className="flex-1 h-[500px] md:h-auto">
                <div className="bg-[#151A24] border border-white/10 rounded-lg p-3 h-full flex flex-col shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-lg text-white">
                      {creationType === "style" ? "Style Builder" : "Template Builder"}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={refreshExamples}
                      className="h-8 w-8 p-0"
                      title="Refresh examples"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Style/Template Name */}
                  <div className="mb-4">
                    <label className="text-sm text-white/70 block mb-1">Name</label>
                    <Input 
                      value={styleName} 
                      onChange={(e) => setStyleName(e.target.value)}
                      className="bg-[#1A202C] border-white/10"
                      placeholder={`Give your ${creationType} a name`}
                    />
                  </div>
                  
                  {/* Tone Tags (for style) or Format Tags (for template) */}
                  {creationType === "style" ? (
                    <div className="mb-4">
                      <label className="text-sm text-white/70 block mb-1">Tone (select up to 3)</label>
                      <div className="flex flex-wrap gap-2">
                        {tones.map((tone) => (
                          <Badge 
                            key={tone}
                            variant={selectedTones.includes(tone) ? "default" : "outline"}
                            className={`cursor-pointer ${
                              selectedTones.includes(tone) 
                                ? "bg-[#3260ea] hover:bg-[#2853c6] text-white" 
                                : "bg-transparent hover:bg-white/10"
                            }`}
                            onClick={() => handleToneToggle(tone)}
                          >
                            {tone}
                            {selectedTones.includes(tone) && (
                              <X className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <label className="text-sm text-white/70 block mb-1">Format (select up to 2)</label>
                      <div className="flex flex-wrap gap-2">
                        {formats.map((format) => (
                          <Badge 
                            key={format}
                            variant={selectedFormats.includes(format) ? "default" : "outline"}
                            className={`cursor-pointer ${
                              selectedFormats.includes(format) 
                                ? "bg-[#3260ea]/80 hover:bg-[#3260ea] text-white" 
                                : "bg-transparent hover:bg-white/10"
                            }`}
                            onClick={() => handleFormatToggle(format)}
                          >
                            {format}
                            {selectedFormats.includes(format) && (
                              <X className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Preview Examples - Style for the specific type */}
                  <div className="flex-grow mb-4 overflow-hidden">
                    <div className="preview-examples-section p-3 bg-[#141821] border border-white/10 rounded-lg">
                      <div className="flex items-center mb-2 text-sm font-medium text-white">
                        <Lightbulb className="h-4 w-4 mr-2 text-amber-400" />
                        {creationType === "style" ? "Style Examples" : "Template Structure"}
                      </div>
                      
                      <div className="max-h-[200px] overflow-y-auto">
                        <ScrollArea className="h-full">
                          <div className="space-y-3">
                            {isAnalyzing ? (
                              <div className="flex items-center justify-center h-32 text-white/50">
                                <div className="flex flex-col items-center">
                                  <RefreshCw className="h-5 w-5 animate-spin mb-2" />
                                  <span>Generating examples...</span>
                                </div>
                              </div>
                            ) : (
                              previewExamples.map((example, idx) => (
                                <div key={idx} className="p-2 bg-[#1A1F2C] rounded border border-white/5">
                                  <p className="whitespace-pre-wrap text-sm text-white/90">{example}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                      
                      <div className="mt-4 flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={refreshExamples}
                          className="bg-transparent border-white/20 hover:bg-white/10 text-xs"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Regenerate Examples
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tone Sliders (if tones are selected) */}
                  {selectedTones.length > 0 && (
                    <div className="mb-4">
                      <label className="text-sm text-white/70 block mb-2">Tone Adjustments</label>
                      <div className="space-y-4">
                        {selectedTones.slice(0, 1).map((tone) => (
                          <div key={tone} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Less {tone}</span>
                              <span>More {tone}</span>
                            </div>
                            <Slider 
                              defaultValue={[75]} 
                              max={100} 
                              step={1} 
                              className="cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Add details (manual) */}
          {step === 3 && creationMethod !== "chat" && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium mb-4 text-white">Style details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Description (optional)
                  </label>
                  <Textarea
                    placeholder="A brief description of your style..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-[#151A24] border-white/10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Category
                  </label>
                  <Select value={selectedCategory || ""} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-[#151A24] border-white/10">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A202C] border-white/10 text-white">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Tone Tags (select up to 3)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tones.map((tone) => (
                      <Badge 
                        key={tone}
                        variant={selectedTones.includes(tone) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedTones.includes(tone) 
                            ? "bg-[#3260ea] hover:bg-[#2853c6] text-white" 
                            : "bg-transparent hover:bg-white/10"
                        }`}
                        onClick={() => handleToneToggle(tone)}
                      >
                        {tone}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Format Tags */}
                <div className="mb-4">
                  <label className="text-sm text-white/70 block mb-1">Format (select up to 2)</label>
                  <div className="flex flex-wrap gap-2">
                    {formats.map((format) => (
                      <Badge 
                        key={format}
                        variant={selectedFormats.includes(format) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedFormats.includes(format) 
                            ? "bg-[#3260ea]/80 hover:bg-[#3260ea] text-white" 
                            : "bg-transparent hover:bg-white/10"
                        }`}
                        onClick={() => handleFormatToggle(format)}
                      >
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Preview Examples Section - Enhanced for non-chat method too */}
                <div className="preview-examples-section">
                  <div className="preview-examples-heading">
                    <Lightbulb className="h-5 w-5" />
                    Preview Examples
                  </div>
                  
                  <div className="max-h-[200px] overflow-y-auto">
                    <ScrollArea className="h-full">
                      <div className="space-y-3">
                        {isAnalyzing ? (
                          <div className="flex items-center justify-center h-32 text-white/50">
                            <div className="flex flex-col items-center">
                              <RefreshCw className="h-5 w-5 animate-spin mb-2" />
                              <span>Generating examples...</span>
                            </div>
                          </div>
                        ) : (
                          previewExamples.map((example, idx) => (
                            <div key={idx} className="example-content">
                              <p className="whitespace-pre-wrap text-sm text-white/90">{example}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <button 
                      onClick={refreshExamples}
                      className="regenerate-examples-button"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Regenerate Examples
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 4: Review and save */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium mb-4 text-white">Name and save your {creationType}</h2>
              
              <div className="mb-4">
                <label className="text-sm text-white/70 block mb-1">Name your {creationType}</label>
                <Input 
                  value={styleName} 
                  onChange={(e) => setStyleName(e.target.value)}
                  className="bg-[#151A24] border-white/10 max-w-md"
                  placeholder={`My ${creationType === "style" ? "Bold Marketing" : "Twitter Thread"} ${creationType}`}
                />
              </div>
              
              <CardContainer className="bg-[#151A24] border-white/10 p-4 shadow-md">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">{styleName}</h3>
                    {description && <p className="text-white/80 text-sm mt-1">{description}</p>}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <Badge className="bg-white/10 border-none text-white/80">
                        {selectedCategory}
                      </Badge>
                    )}
                    
                    {selectedTones.map((tone) => (
                      <Badge key={tone} className="bg-[#3260ea]/20 text-blue-400 border-none">
                        {tone}
                      </Badge>
                    ))}
                    
                    {selectedFormats.map((format) => (
                      <Badge key={format} className="bg-white/10 border-none text-white/80">
                        {format}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-white/80">
                      <strong>Created by:</strong> You
                    </p>
                    <p className="text-sm text-white/80">
                      <strong>Method:</strong> {
                        creationMethod === "upload" ? `File upload (${uploadedFile?.name})` :
                        creationMethod === "paste" ? "Text samples" :
                        "AI co-creation"
                      }
                    </p>
                  </div>
                  
                  {/* Preview section for examples */}
                  {creationMethod === "chat" && previewExamples.length > 0 && (
                    <div className="mt-2 border-t border-white/10 pt-3">
                      <h4 className="text-sm font-medium mb-2 text-white/90">Example output:</h4>
                      <div className="example-content">
                        <p className="whitespace-pre-wrap text-sm text-white/90">{previewExamples[0]}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContainer>
              
              <div className="bg-gradient-to-br from-[#1E2431] to-[#1A202C] border-white/5 rounded-lg p-4 flex items-center gap-4 shadow-md">
                <div className="bg-[#3260ea]/20 p-3 rounded-full">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1 text-white">Your {creationType} is ready!</h3>
                  <p className="text-sm text-white/80">
                    Once saved, you can use this {creationType} for your posts or chat with an AI that mimics this {creationType === "style" ? "style" : "format"}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContainer>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="bg-transparent border-white/20 hover:bg-white/5"
        >
          Back
        </Button>
        
        {step < stepTitles.length ? (
          <Button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="bg-[#3260ea] hover:bg-[#2853c6]"
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={handleSaveStyle}
            className="bg-[#3260ea] hover:bg-[#2853c6]"
          >
            <Save className="h-4 w-4 mr-2" />
            Save {creationType === "style" ? "Style" : "Template"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LibraryCreateStyle;
