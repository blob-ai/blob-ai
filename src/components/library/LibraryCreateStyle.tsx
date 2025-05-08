
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { File, FileText, MessageSquare, Save, Settings, Sparkles } from "lucide-react";

const stepTitles = [
  "Name your style",
  "Choose creation method",
  "Add details",
  "Review and save"
];

const categories = ["Tech", "Marketing", "Personal Growth", "Business", "Humor", "Education", "Other"];
const tones = ["Bold", "Thoughtful", "Casual", "Analytical", "Motivational", "Educational", "Sarcastic", "Direct", "Conversational"];

const LibraryCreateStyle: React.FC = () => {
  const [step, setStep] = useState(1);
  const [styleName, setStyleName] = useState("");
  const [creationMethod, setCreationMethod] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  
  const handleNext = () => {
    if (step < stepTitles.length) {
      setStep(step + 1);
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
      }
    }
  };
  
  const isNextDisabled = () => {
    if (step === 1) return !styleName;
    if (step === 2) return !creationMethod || (creationMethod === "paste" && !pastedText) || (creationMethod === "upload" && !uploadedFile);
    if (step === 3) return !selectedCategory;
    return false;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Step indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {stepTitles.map((title, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                idx + 1 === step ? "bg-primary-500" : 
                idx + 1 < step ? "bg-primary-500/50" : "bg-white/10"
              }`}>
                {idx + 1}
              </div>
              <span className={`text-xs ${idx + 1 === step ? "text-white" : "text-white/50"}`}>
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content area */}
      <CardContainer className="max-w-2xl mx-auto w-full bg-black/20 border-white/10 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-4">
          {/* Step 1: Name your style */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-medium mb-4">Name your style</h2>
              <p className="text-white/70 mb-4">
                Give your style a descriptive name that will help you remember what it's for.
              </p>
              <Input
                placeholder="My Professional Tech Style"
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                className="bg-black/30 border-white/10"
              />
            </div>
          )}
          
          {/* Step 2: Choose creation method */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium mb-4">How would you like to create your style?</h2>
              
              <CardContainer 
                className={`cursor-pointer transition-all p-4 ${
                  creationMethod === "upload" ? "border-primary-400 bg-black/40" : "hover:border-white/20"
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
                  creationMethod === "paste" ? "border-primary-400 bg-black/40" : "hover:border-white/20"
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
                  creationMethod === "chat" ? "border-primary-400 bg-black/40" : "hover:border-white/20"
                }`}
                onClick={() => setCreationMethod("chat")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Chat with AI</h3>
                    <p className="text-sm text-white/60">Co-create your style by describing it to our AI</p>
                  </div>
                </div>
                
                {creationMethod === "chat" && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-white/80">
                      You'll be able to chat with our AI assistant to define your style after proceeding to the next step.
                    </p>
                  </div>
                )}
              </CardContainer>
            </div>
          )}
          
          {/* Step 3: Add details */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium mb-4">Style details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Description (optional)
                  </label>
                  <Textarea
                    placeholder="A brief description of your style..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-black/30 border-white/10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Category
                  </label>
                  <Select value={selectedCategory || ""} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-black/30 border-white/10">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1F2C] border-white/10 text-white">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Tone Tags (select up to 3)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tones.map((tone) => (
                      <Badge 
                        key={tone}
                        variant={selectedTones.includes(tone) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedTones.includes(tone) 
                            ? "bg-primary-500 hover:bg-primary-600 text-white" 
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
              <h2 className="text-xl font-medium mb-4">Review and save your style</h2>
              
              <CardContainer className="bg-black/30 border-white/10 p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{styleName}</h3>
                    {description && <p className="text-white/70 text-sm mt-1">{description}</p>}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <Badge className="bg-white/10 border-none">
                        {selectedCategory}
                      </Badge>
                    )}
                    
                    {selectedTones.map((tone) => (
                      <Badge key={tone} className="bg-primary-500/20 text-primary-400 border-none">
                        {tone}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-white/70">
                      <strong>Created by:</strong> You
                    </p>
                    <p className="text-sm text-white/70">
                      <strong>Method:</strong> {
                        creationMethod === "upload" ? `File upload (${uploadedFile?.name})` :
                        creationMethod === "paste" ? "Text samples" :
                        "AI co-creation"
                      }
                    </p>
                  </div>
                </div>
              </CardContainer>
              
              <div className="bg-gradient-to-br from-[#1e1e2d] to-[#1a1f2c] border-white/5 rounded-lg p-4 flex items-center gap-4">
                <div className="bg-primary-400/20 p-3 rounded-full">
                  <Sparkles className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Your style is ready!</h3>
                  <p className="text-sm text-white/70">
                    Once saved, you can use this style for your posts or chat with an AI that mimics this style.
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
          className="bg-transparent"
        >
          Back
        </Button>
        
        {step < stepTitles.length ? (
          <Button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="bg-primary-500 hover:bg-primary-600"
          >
            Continue
          </Button>
        ) : (
          <Button
            className="bg-primary-500 hover:bg-primary-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Style
          </Button>
        )}
      </div>
    </div>
  );
};

export default LibraryCreateStyle;
