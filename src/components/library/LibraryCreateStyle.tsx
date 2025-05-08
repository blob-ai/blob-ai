import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  File, FileText, MessageSquare, Save, Settings, Sparkles, 
  RefreshCw, Sliders, X, CheckCircle, Send, Layout, Type
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const stepTitles = [
  "Name your style",
  "Choose creation method",
  "Add details",
  "Review and save"
];

const categories = ["Tech", "Marketing", "Personal Growth", "Business", "Humor", "Education", "Other"];
const tones = ["Bold", "Thoughtful", "Casual", "Analytical", "Motivational", "Educational", "Sarcastic", "Direct", "Conversational"];
const formats = ["One-liners", "Threads", "Lists", "Stories", "Questions", "How-to guides"];

type CreationType = "style" | "template";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const LibraryCreateStyle: React.FC = () => {
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
        setChatMessages([
          {
            role: "assistant",
            content: "Let's build your style together! What kind of tone are you going for? Bold, reflective, funny, educational, or something else?"
          }
        ]);
        generatePreviewExamples();
      }
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
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
    if (step === 1) return !styleName;
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
      
      // Base response on user message content
      if (currentMessage.toLowerCase().includes("direct") || currentMessage.toLowerCase().includes("bold")) {
        aiResponse = "I notice you prefer a direct, bold tone. Would you also like your content to be brief and punchy, or more detailed with examples?";
        if (!selectedTones.includes("Bold")) {
          setSelectedTones([...selectedTones, "Bold"].slice(0, 3));
        }
        if (!selectedTones.includes("Direct")) {
          setSelectedTones([...selectedTones.filter(t => t !== "Conversational"), "Direct"].slice(0, 3));
        }
      } else if (currentMessage.toLowerCase().includes("story") || currentMessage.toLowerCase().includes("narrative")) {
        aiResponse = "Great! Storytelling is powerful. Do you prefer emotional stories that connect with the reader, or more factual case-study type stories?";
        if (!selectedFormats.includes("Stories")) {
          setSelectedFormats([...selectedFormats, "Stories"].slice(0, 2));
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
      const toneBasedExamples = [];
      
      if (selectedTones.includes("Bold") || chatMessages.some(m => m.content.toLowerCase().includes("bold"))) {
        toneBasedExamples.push("Stop looking for shortcuts. The path to success is the path most people avoid.");
      }
      
      if (selectedTones.includes("Educational") || chatMessages.some(m => m.content.toLowerCase().includes("teach"))) {
        toneBasedExamples.push("The 3 key factors for sustainable growth:\n1. Customer acquisition\n2. Retention strategy\n3. Revenue optimization");
      }
      
      if (selectedTones.includes("Conversational")) {
        toneBasedExamples.push("Ever wonder why some products just feel right? It's not an accident. It's deep customer understanding.");
      }
      
      if (selectedTones.includes("Direct")) {
        toneBasedExamples.push("Focus or fail. You can't be exceptional at everything.");
      }
      
      if (selectedFormats.includes("Questions")) {
        toneBasedExamples.push("What's the one thing you could focus on today that would make everything else easier?");
      }
      
      // If we have examples based on selections, use those
      if (toneBasedExamples.length > 0) {
        setPreviewExamples(toneBasedExamples);
      } else {
        // Otherwise use some default examples
        setPreviewExamples([
          "This is how your style might sound. The more you tell me, the better the examples.",
          "Try adding some tones or formats to see more tailored examples."
        ]);
      }
      
      setIsAnalyzing(false);
    }, 1000);
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
    toast.success(`${creationType === 'style' ? 'Style' : 'Template'} saved successfully!`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
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
          {/* Step 1: Name your style */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium mb-4 text-white">Name your style</h2>
              <p className="text-white/80 mb-6">
                Give your style a descriptive name that will help you remember what it's for.
              </p>
              
              <Input
                placeholder="My Professional Tech Style"
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                className="bg-[#151A24] border-white/10 max-w-md"
              />
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-lg font-medium mb-2 text-white">What are you creating?</h3>
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={creationType === "style"} 
                      onCheckedChange={() => setCreationType("style")}
                    />
                    <div className="flex items-center">
                      <Type className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="text-white">Style (tone & voice)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={creationType === "template"} 
                      onCheckedChange={() => setCreationType("template")}
                    />
                    <div className="flex items-center">
                      <Layout className="h-4 w-4 mr-2 text-emerald-400" />
                      <span className="text-white">Template (structure)</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-[#151A24] rounded-md">
                  {creationType === "style" ? (
                    <p className="text-sm text-white/80">
                      A <strong>style</strong> focuses on how something is said—the tone, word choice, and attitude of your writing.
                    </p>
                  ) : (
                    <p className="text-sm text-white/80">
                      A <strong>template</strong> focuses on how content is structured—the format, sections, and organization of your posts.
                    </p>
                  )}
                </div>
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
                className={`cursor-pointer transition-all p-4 ${
                  creationMethod === "upload" ? "border-[#3260ea] bg-[#151A24]" : "hover:border-white/20"
                }`}
                onClick={() => setCreationMethod("upload")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <FileText className="h-6 w-6 text-primary-400" />
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
                      <p className="mt-2 text-sm text-primary-400">
                        {uploadedFile.name} selected
                      </p>
                    )}
                  </div>
                )}
              </CardContainer>
              
              <CardContainer 
                className={`cursor-pointer transition-all p-4 ${
                  creationMethod === "paste" ? "border-[#3260ea] bg-[#151A24]" : "hover:border-white/20"
                }`}
                onClick={() => setCreationMethod("paste")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <File className="h-6 w-6 text-primary-400" />
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
                className={`cursor-pointer transition-all p-4 ${
                  creationMethod === "chat" ? "border-[#3260ea] bg-[#151A24]" : "hover:border-white/20"
                }`}
                onClick={() => setCreationMethod("chat")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-primary-400" />
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
                      {/* ... keep existing code (isAnalyzing spinner) */}
                      <div ref={chatEndRef}></div>
                    </div>
                  </div>
                  
                  {/* Chat Input */}
                  <div className="flex space-x-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Describe your preferred style..."
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
                  
                  {/* Chat Suggestions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {/* ... keep existing code (chat suggestion buttons) */}
                  </div>
                </div>
              </div>
              
              {/* Right Panel - Style Builder */}
              <div className="flex-1 h-[500px] md:h-auto">
                <div className="bg-[#151A24] border border-white/10 rounded-lg p-3 h-full flex flex-col shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-lg text-white">Style Builder</h3>
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
                  
                  {/* Style Name */}
                  <div className="mb-4">
                    <label className="text-sm text-white/70 block mb-1">Style Name</label>
                    <Input 
                      value={styleName} 
                      onChange={(e) => setStyleName(e.target.value)}
                      className="bg-[#1A202C] border-white/10"
                    />
                  </div>
                  
                  {/* Tone Tags */}
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
                          {selectedFormats.includes(format) && (
                            <X className="ml-1 h-3 w-3" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Preview Examples */}
                  <div className="flex-grow mb-4 overflow-hidden">
                    <label className="text-sm text-white/70 block mb-1">Preview Examples</label>
                    <div className="h-full max-h-[250px] overflow-y-auto">
                      <ScrollArea className="h-full">
                        <div className="space-y-3 p-2">
                          {isAnalyzing ? (
                            <div className="flex items-center justify-center h-32 text-white/50">
                              <div className="flex flex-col items-center">
                                <RefreshCw className="h-5 w-5 animate-spin mb-2" />
                                <span>Generating examples...</span>
                              </div>
                            </div>
                          ) : (
                            previewExamples.map((example, idx) => (
                              <div key={idx} className="bg-[#1E2431] p-3 rounded-md border border-white/10 shadow-sm">
                                <p className="whitespace-pre-wrap text-sm text-white/90">{example}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                  
                  {/* Tone Sliders (if tones are selected) */}
                  {selectedTones.length > 0 && (
                    <div className="mb-4">
                      <label className="text-sm text-white/70 block mb-2">Tone Adjustments</label>
                      <div className="space-y-4">
                        {/* ... keep existing code (tone sliders) */}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center py-1 mt-auto">
                    <Button 
                      onClick={refreshExamples}
                      variant="outline"
                      className="bg-transparent border-white/20"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate Examples
                    </Button>
                  </div>
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
              </div>
            </div>
          )}
          
          {/* Step 4: Review and save */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium mb-4 text-white">Review and save your {creationType}</h2>
              
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
                      <div className="bg-[#1E2431] p-3 rounded-md border border-white/10">
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
                    Once saved, you can use this {creationType} for your posts or chat with an AI that mimics this style.
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
