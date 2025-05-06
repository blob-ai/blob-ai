
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { Textarea } from "@/components/ui/textarea";
import { Filter, Play, Save, Settings, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample saved styles - in a real app these would come from an API
const SAMPLE_STYLES = [
  {
    id: "s1",
    name: "Naval's Wisdom",
    creatorName: "Naval Ravikant",
    creatorAvatar: "https://pbs.twimg.com/profile_images/1256841238298292232/ycqwaMI2_400x400.jpg",
    description: "Concise philosophical insights",
    tone: ["Thoughtful", "Direct", "Philosophical"],
    example: "If you aren't willing to be mocked, you'll never be original enough."
  },
  {
    id: "s2",
    name: "Hormozi's Lists",
    creatorName: "Alex Hormozi",
    creatorAvatar: "https://pbs.twimg.com/profile_images/1602381288925261824/OBgGZqZ7_400x400.jpg",
    description: "Actionable business advice in list format",
    tone: ["Bold", "Instructional", "Structured"],
    example: "The 3 types of leverage:\n\n1. Money\n2. People\n3. Technology"
  },
  {
    id: "s3",
    name: "Sahil's Rules",
    creatorName: "Sahil Bloom",
    creatorAvatar: "https://pbs.twimg.com/profile_images/1735694839870857216/MQW8CD5T_400x400.jpg",
    description: "Mental models and frameworks",
    tone: ["Educational", "Clear", "Informative"],
    example: "The 5-hour rule: The most successful people dedicate 5 hours per week to deliberate learning."
  }
];

const LibraryStyleLab: React.FC = () => {
  const [content, setContent] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    // Clear any previously generated content
    setGeneratedContent(null);
  };

  const handleGenerateContent = () => {
    if (!content) {
      return; // Don't generate if no content provided
    }
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const selectedStyleData = SAMPLE_STYLES.find(style => style.id === selectedStyle);
      
      // Simple mock of AI-generated content based on selected style
      let generated = "";
      
      if (selectedStyleData) {
        if (selectedStyleData.id === "s1") { // Naval style
          generated = `${content.split(" ").slice(0, 15).join(" ")}.\n\nRemember: ${content.split(" ").slice(-10).join(" ")}.`;
        } else if (selectedStyleData.id === "s2") { // Hormozi list style
          generated = `The 3 keys to ${content.split(" ").slice(0, 3).join(" ")}:\n\n1. ${content.split(" ").slice(0, 5).join(" ")}\n2. ${content.split(" ").slice(5, 10).join(" ")}\n3. ${content.split(" ").slice(10, 15).join(" ")}`;
        } else if (selectedStyleData.id === "s3") { // Sahil's rule style
          generated = `The ${content.split(" ")[0]} rule:\n\n${content}\n\nMaster this one thing and watch your life transform.`;
        }
      }
      
      setGeneratedContent(generated);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-5 overflow-hidden">
      {/* Left column - Styles */}
      <div className="md:w-1/3 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Saved Styles</h3>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <ScrollArea className="flex-grow">
          <div className="space-y-3 pr-2">
            {SAMPLE_STYLES.map((style) => (
              <CardContainer 
                key={style.id}
                className={`cursor-pointer transition-all ${selectedStyle === style.id ? 'border-primary-400 bg-black/40' : 'hover:border-white/20'}`}
                onClick={() => handleStyleSelect(style.id)}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={style.creatorAvatar} 
                    alt={style.creatorName}
                    className="w-10 h-10 rounded-full border border-white/10" 
                  />
                  <div className="flex-grow">
                    <h4 className="font-medium text-white">{style.name}</h4>
                    <p className="text-sm text-white/60">{style.description}</p>
                  </div>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  {style.tone.map((t, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/10 border-none">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContainer>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Right column - Content generation */}
      <div className="md:w-2/3 flex flex-col overflow-hidden">
        <div className="bg-black/20 rounded-lg border border-white/10 p-4 mb-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Content Canvas</h3>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-white/60 mb-2">Input your content idea:</p>
            <Textarea 
              placeholder="Enter your content idea or outline here..."
              className="bg-black/30 border-white/10 min-h-[100px] text-white"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-white/60">
              {selectedStyle ? (
                <span>Using style: <span className="text-primary-400">{SAMPLE_STYLES.find(s => s.id === selectedStyle)?.name}</span></span>
              ) : (
                <span>Select a style from the left</span>
              )}
            </div>
            
            <Button 
              onClick={handleGenerateContent}
              disabled={!selectedStyle || !content || isGenerating}
              className="bg-primary-500 hover:bg-primary-600"
            >
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Generated content */}
        {generatedContent && (
          <CardContainer className="bg-black/20 border-white/10 flex-grow flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Generated Content</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm">
                  <Play className="h-4 w-4 mr-1" />
                  Use
                </Button>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 flex-grow overflow-auto border border-white/5">
              <p className="text-white whitespace-pre-line">{generatedContent}</p>
            </div>
          </CardContainer>
        )}
        
        {/* Premium feature teaser */}
        {!generatedContent && (
          <CardContainer className="bg-gradient-to-br from-[#1e1e2d] to-[#1a1f2c] border-white/5 flex-grow">
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-primary-400/20 p-3 rounded-full mb-4">
                <Sparkles className="h-6 w-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">AI Personas</h3>
              <p className="text-white/70 mb-4 max-w-md">
                Upgrade to Premium to chat directly with AI clones of your favorite creators and get personalized content advice.
              </p>
              <Button className="bg-primary-500 hover:bg-primary-600">
                Upgrade to Premium
              </Button>
            </div>
          </CardContainer>
        )}
      </div>
    </div>
  );
};

export default LibraryStyleLab;
