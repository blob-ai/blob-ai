
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, CheckCircle, AlertCircle, Info, Upload, Pencil, Clipboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useChat } from "@/contexts/ChatContext";
import type { ContentSetup, TemplateVariable } from "@/types/setup";

interface SelectExistingTemplateCardProps {
  onClose: () => void;
  onTemplateSelect: (content: string) => void;
  templates: ContentSetup[];
}

const SelectExistingTemplateCard: React.FC<SelectExistingTemplateCardProps> = ({
  onClose,
  onTemplateSelect,
  templates
}) => {
  const { currentThread } = useChat();
  const [selectedTemplate, setSelectedTemplate] = useState<ContentSetup | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [processedContent, setProcessedContent] = useState<string>("");
  const [templateError, setTemplateError] = useState<string>("");
  const [highlightedContent, setHighlightedContent] = useState<string>("");
  const [rawInput, setRawInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("paste");

  useEffect(() => {
    setTemplateError("");
  }, [templates]);

  const extractVariables = (content: string) => {
    const variableRegex = /\[([^\]]+)\]/g;
    let match;
    const uniqueVariables: Record<string, string> = {};
    
    while ((match = variableRegex.exec(content)) !== null) {
      uniqueVariables[match[1]] = '';
    }
    
    return uniqueVariables;
  };

  const highlightVariables = (content: string) => {
    return content.replace(/\[([^\]]+)\]/g, '<span class="template-variable">[$1]</span>');
  };

  const handleTemplateSelect = (template: ContentSetup) => {
    setSelectedTemplate(template);
    setTemplateError("");
    setActiveTab("paste");
    setRawInput("");
    
    if (template.examples?.[0]?.content) {
      const content = template.examples[0].content;
      
      setProcessedContent(content);
      setHighlightedContent(highlightVariables(content));
    }
  };

  const handleRawInputSubmit = () => {
    if (!rawInput.trim() || !selectedTemplate?.examples?.[0]?.content) {
      toast({
        title: "Missing input",
        description: "Please paste your content first and select a template",
        variant: "destructive"
      });
      return;
    }
    
    if (!currentThread?.id) {
      toast({
        title: "Error",
        description: "No active chat thread",
        variant: "destructive"
      });
      return;
    }
    
    // Instead of trying to extract variables ourselves, we'll send both the template 
    // and raw input to the LLM and let it handle the transformation intelligently
    onTemplateSelect(rawInput);
  };

  const validTemplates = templates.filter(t => 
    t.examples?.[0]?.content && 
    (t.isTemplate === true || t.isTemplate === undefined)
  );

  return (
    <Card className="p-6 bg-[#18191B] border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Select Template</h3>
        <button 
          onClick={onClose}
          className="text-white/60 hover:text-white/80"
        >
          ×
        </button>
      </div>

      {!selectedTemplate ? (
        <>
          {validTemplates.length > 0 ? (
            <ScrollArea className="h-[300px] pr-4">
              <div className="grid grid-cols-1 gap-4">
                {validTemplates.map((template) => (
                  <Button 
                    key={template.id}
                    variant="outline" 
                    className="flex flex-col items-start w-full p-4 bg-[#18191B]/80 hover:bg-[#1C1D20]/90 border border-[#2A2B32] rounded-xl transition-colors text-left"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-center gap-3 w-full mb-2">
                      <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <FileCode className="h-4 w-4" />
                      </span>
                      <span className="text-[15px] font-semibold text-white">{template.name || "Unnamed Template"}</span>
                    </div>
                    <p className="text-sm text-[#71767B] line-clamp-2 pl-11">
                      {template.examples?.[0]?.content}
                    </p>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-white/60">
              <p>No templates available yet.</p>
              <p className="mt-2">Extract templates from examples first.</p>
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="mb-4">
            <h4 className="text-white/90 font-medium mb-2">Template: {selectedTemplate.name || "Unnamed Template"}</h4>
            <div className="bg-black/20 border border-white/10 rounded-lg p-3 text-white/80 text-sm mb-4 max-h-40 overflow-y-auto whitespace-pre-wrap">
              <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3 bg-blue-500/10 text-blue-400 p-2 rounded border border-blue-500/20">
                <Info className="h-4 w-4" />
                <p className="text-xs">
                  Paste your raw content below. The AI will intelligently adapt it to match the template format while preserving all important information.
                </p>
              </div>
              
              <Textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Paste your job posting, announcement, or any content here. The AI will intelligently transform it to match the template."
                className="w-full h-40 bg-black/20 border-white/10"
              />
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="gap-2"
                  onClick={handleRawInputSubmit}
                  disabled={!rawInput.trim()}
                >
                  <Clipboard className="h-4 w-4" />
                  Generate Content
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SelectExistingTemplateCard;
