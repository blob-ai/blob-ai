
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, MessageSquare, Save, 
  RefreshCw, X, Send, ArrowLeft
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useStyles } from "@/hooks/useStyles";

const stepTitles = [
  "Enter Example",
  "Add Details",
  "Review & Save"
];

const categories = ["Business", "Personal Growth", "Technical", "Creative Writing", "Academic"];

const tones = [
  "Friendly", "Professional", "Casual", "Formal", "Technical", "Persuasive",
  "Enthusiastic", "Confident", "Humorous", "Direct", "Thoughtful", "Educational"
];

const formats = [
  "Thread", "Essay", "List", "Q&A", "Story", "Tutorial",
  "Review", "Analysis", "Announcement", "Journal", "Script"
];

// Helper function to extract tones from text
const extractTonesFromExample = (text: string): string[] => {
  // This is a simple implementation - in a real app, this would use AI
  const possibleTones = [
    { tone: "Friendly", keywords: ["hi", "hello", "thanks", "appreciate", "welcome"] },
    { tone: "Professional", keywords: ["regarding", "therefore", "furthermore", "accordingly"] },
    { tone: "Technical", keywords: ["system", "data", "function", "process", "technical"] },
    { tone: "Persuasive", keywords: ["should", "must", "consider", "believe", "recommend"] },
    { tone: "Humorous", keywords: ["funny", "joke", "laugh", "humor", "hilarious"] },
  ];
  
  const detectedTones = new Set<string>();
  text = text.toLowerCase();
  
  possibleTones.forEach(({ tone, keywords }) => {
    if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
      detectedTones.add(tone);
    }
  });
  
  return Array.from(detectedTones).slice(0, 3); // Limit to 3 tones
};

const LibraryCreateStyle: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [useAI, setUseAI] = useState(true);
  const [styleName, setStyleName] = useState("");
  const [description, setDescription] = useState("");
  const [exampleText, setExampleText] = useState("");
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { folders, refetch } = useStyles();
  
  useEffect(() => {
    if (activeStep === 1 && exampleText && useAI) {
      // Simulate AI processing
      setIsProcessing(true);
      setTimeout(() => {
        const detectedTones = extractTonesFromExample(exampleText);
        setSelectedTones(detectedTones);
        setDescription(`A style based on "${exampleText.substring(0, 30)}..."`);
        setIsProcessing(false);
      }, 1500);
    }
  }, [activeStep, exampleText, useAI]);
  
  const handleToneToggle = (tone: string) => {
    setSelectedTones(prev => 
      prev.includes(tone) 
        ? prev.filter(t => t !== tone) 
        : [...prev, tone].slice(0, 5)
    );
  };
  
  const handleFormatToggle = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format) 
        : [...prev, format].slice(0, 3)
    );
  };
  
  const handleNextStep = () => {
    if (activeStep === 0 && !exampleText.trim()) {
      toast.error("Please enter an example text");
      return;
    }
    
    if (activeStep < stepTitles.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };
  
  const handleRegenerate = () => {
    setIsProcessing(true);
    // Simulate regenerating
    setTimeout(() => {
      const newTones = ["Confident", "Direct", "Educational"].filter(
        t => !selectedTones.includes(t)
      ).slice(0, 3);
      
      setSelectedTones(prev => [...prev, ...newTones].slice(0, 5));
      setIsProcessing(false);
      toast.success("Regenerated style details");
    }, 1000);
  };
  
  const handleSaveStyle = async () => {
    if (!styleName.trim()) {
      toast.error("Please enter a style name");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Find a folder to use (default to first folder)
      const defaultFolder = folders.find(f => f.name !== "All");
      
      // Insert the style into Supabase
      const { data, error } = await supabase
        .from('styles')
        .insert({
          name: styleName,
          description: description,
          tone: selectedTones,
          format: selectedFormats,
          example: exampleText,
          folder_id: defaultFolder?.id,
          is_template: false,
          is_favorite: false,
          is_pinned: false,
          source: "user"
        })
        .select();
      
      if (error) throw error;
      
      toast.success(`Style "${styleName}" saved successfully`);
      refetch(); // Refresh styles list
      
      // Reset form
      setStyleName("");
      setDescription("");
      setExampleText("");
      setSelectedTones([]);
      setSelectedFormats([]);
      setSelectedCategory("");
      setActiveStep(0);
      
    } catch (error) {
      console.error('Error saving style:', error);
      toast.error('Failed to save style');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top navigation */}
      <div className="flex items-center justify-between mb-4">
        {activeStep > 0 ? (
          <Button
            variant="ghost"
            className="text-white/70"
            onClick={handlePrevStep}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        ) : (
          <div></div> {/* Empty placeholder for alignment */}
        )}
        
        <div className="flex items-center gap-2">
          {stepTitles.map((title, idx) => (
            <React.Fragment key={title}>
              {idx > 0 && <div className="w-8 h-[2px] bg-white/20"></div>}
              <div
                className={`px-2 py-1 text-xs rounded-md ${
                  idx === activeStep
                    ? "bg-[#3260ea]/30 text-blue-400 border border-blue-500/30"
                    : idx < activeStep
                    ? "bg-[#24293A] text-white/80"
                    : "bg-[#1A202C] text-white/50"
                }`}
              >
                {title}
              </div>
            </React.Fragment>
          ))}
        </div>
        
        <div className="w-20"></div> {/* Empty placeholder for alignment */}
      </div>

      {/* Step 1: Enter Example */}
      <TabsContent value="0" className="flex-1 m-0" asChild>
        <div className={activeStep === 0 ? "block h-full" : "hidden"}>
          <CardContainer className="flex-1 h-full flex flex-col">
            <div className="p-1 sm:p-4">
              <h2 className="text-xl font-medium text-white mb-1">Enter Text Example</h2>
              <p className="text-white/80 text-sm mb-4">
                Provide an example of the writing style you want to save
              </p>
              
              <Textarea
                placeholder="Paste or type an example of the writing style here..."
                className="h-64 bg-[#1A202C] border-white/10 mb-4"
                value={exampleText}
                onChange={(e) => setExampleText(e.target.value)}
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={useAI}
                    onCheckedChange={setUseAI}
                    className="data-[state=checked]:bg-[#3260ea]"
                  />
                  <span className="text-sm text-white/80">
                    Detect style details with AI
                  </span>
                </div>
                
                <Button
                  onClick={handleNextStep}
                  className="bg-[#3260ea] hover:bg-[#2853c6]"
                  disabled={!exampleText.trim()}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Next: Add Details
                </Button>
              </div>
            </div>
          </CardContainer>
        </div>
      </TabsContent>

      {/* Step 2: Add Details */}
      <TabsContent value="1" className="flex-1 m-0" asChild>
        <div className={activeStep === 1 ? "block h-full" : "hidden"}>
          <CardContainer className="flex-1 h-full flex flex-col">
            <div className="p-1 sm:p-4">
              <h2 className="text-xl font-medium text-white mb-4">Add Style Details</h2>
              
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <RefreshCw className="h-8 w-8 text-blue-400 mb-3 animate-spin" />
                  <p className="text-white/80">Analyzing your example...</p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1.5">
                        Style Name
                      </label>
                      <Input
                        placeholder="Give your style a name"
                        className="bg-[#1A202C] border-white/10"
                        value={styleName}
                        onChange={(e) => setStyleName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1.5">
                        Description
                      </label>
                      <Textarea
                        placeholder="Describe this style"
                        className="h-24 bg-[#1A202C] border-white/10"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-white/90">
                          Tone Selection
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300"
                          onClick={handleRegenerate}
                          disabled={isProcessing}
                        >
                          <RefreshCw className={`h-3 w-3 mr-1 ${isProcessing ? 'animate-spin' : ''}`} />
                          Regenerate
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tones.map((tone) => (
                          <Badge
                            key={tone}
                            className={`cursor-pointer ${
                              selectedTones.includes(tone)
                                ? "bg-[#3260ea] hover:bg-[#2853c6]"
                                : "bg-[#1A202C] hover:bg-[#24293A] text-white/70"
                            } px-3 py-1`}
                            onClick={() => handleToneToggle(tone)}
                          >
                            {tone}
                            {selectedTones.includes(tone) && (
                              <X className="h-3 w-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1.5">
                        Format Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {formats.map((format) => (
                          <Badge
                            key={format}
                            className={`cursor-pointer ${
                              selectedFormats.includes(format)
                                ? "bg-[#3260ea] hover:bg-[#2853c6]"
                                : "bg-[#1A202C] hover:bg-[#24293A] text-white/70"
                            } px-3 py-1`}
                            onClick={() => handleFormatToggle(format)}
                          >
                            {format}
                            {selectedFormats.includes(format) && (
                              <X className="h-3 w-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1.5">
                        Category
                      </label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-full bg-[#1A202C] border-white/10">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A202C] border-white/10 text-white">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </ScrollArea>
              )}
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleNextStep}
                  className="bg-[#3260ea] hover:bg-[#2853c6]"
                  disabled={isProcessing || !styleName.trim()}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Next: Review & Save
                </Button>
              </div>
            </div>
          </CardContainer>
        </div>
      </TabsContent>

      {/* Step 3: Review & Save */}
      <TabsContent value="2" className="flex-1 m-0" asChild>
        <div className={activeStep === 2 ? "block h-full" : "hidden"}>
          <CardContainer className="flex-1 h-full flex flex-col">
            <div className="p-1 sm:p-4">
              <h2 className="text-xl font-medium text-white mb-1">Review Style</h2>
              <p className="text-white/80 text-sm mb-4">
                Review your style details before saving
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-medium mb-2">Style Information</h3>
                  <CardContainer className="bg-[#1A202C] mb-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-white/50">Name</label>
                        <p className="text-white">{styleName || "Untitled Style"}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs text-white/50">Description</label>
                        <p className="text-white/90">{description || "No description"}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs text-white/50">Category</label>
                        <p className="text-white/90">{selectedCategory || "Uncategorized"}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs text-white/50">Tone</label>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {selectedTones.length > 0 ? (
                            selectedTones.map((tone) => (
                              <Badge
                                key={tone}
                                className="bg-[#3260ea]/20 text-blue-400 border-none"
                              >
                                {tone}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-white/50 text-sm">No tones selected</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-white/50">Format</label>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {selectedFormats.length > 0 ? (
                            selectedFormats.map((format) => (
                              <Badge
                                key={format}
                                className="bg-[#3260ea]/20 text-blue-400 border-none"
                              >
                                {format}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-white/50 text-sm">No formats selected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContainer>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Example Text</h3>
                  <CardContainer className="bg-[#1A202C] h-48 overflow-auto">
                    <p className="text-white/90 whitespace-pre-wrap text-sm">
                      {exampleText || "No example text provided."}
                    </p>
                  </CardContainer>
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <Button
                  onClick={handleSaveStyle}
                  className="bg-[#3260ea] hover:bg-[#2853c6]"
                  disabled={isSubmitting || !styleName.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Style
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContainer>
        </div>
      </TabsContent>
    </div>
  );
};

export default LibraryCreateStyle;
