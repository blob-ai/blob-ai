import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Info, Clipboard, Plus, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContentSetup } from "@/types/setup";

interface TemplateDialogProps {
  onClose: () => void;
  onGenerate: (content: string, analysis?: TemplateAnalysis) => void;
  savedTemplates: ContentSetup[];
  onSaveTemplate?: (template: ContentSetup) => void;
}

interface TemplateAnalysis {
  missingRequired: string[];
  missingOptional: string[];
  systemGenerated: string[];
}

export const TemplateDialog: React.FC<TemplateDialogProps> = ({
  onClose,
  onGenerate,
  savedTemplates,
  onSaveTemplate
}) => {
  // State for template selection/creation
  const [selectedTemplate, setSelectedTemplate] = useState<ContentSetup | null>(null);
  const [newTemplate, setNewTemplate] = useState("");
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [step, setStep] = useState<'select' | 'transform'>('select');
  const [contentToTransform, setContentToTransform] = useState("");

  const getFirstLine = (text: string) => {
    const firstLine = text.split('\n')[0];
    return firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine;
  };

  // Analyze template and content
  const analyzeTemplateAndContent = (template: string, content: string): TemplateAnalysis => {
    const variableRegex = /\[(.*?)\]/g;
    const missingRequired: string[] = [];
    const missingOptional: string[] = [];
    const systemGenerated = ['NAME', 'LINK', 'hashtags'];
    
    let match;
    while ((match = variableRegex.exec(template)) !== null) {
      const varName = match[1];
      const isRequired = !systemGenerated.includes(varName) && 
        (varName.includes('Position') || varName.includes('Company') || 
         varName.includes('Location') || varName.includes('Eligibility'));
      
      const found = content.toLowerCase().includes(varName.toLowerCase()) ||
                   systemGenerated.includes(varName);
      
      if (!found) {
        if (isRequired) {
          missingRequired.push(varName);
        } else if (!systemGenerated.includes(varName)) {
          missingOptional.push(varName);
        }
      }
    }
    
    return {
      missingRequired,
      missingOptional,
      systemGenerated
    };
  };

  const handleTemplateSelect = (template: ContentSetup) => {
    setSelectedTemplate(template);
    setNewTemplate("");
    setSaveAsTemplate(false);
    setStep('transform');
  };

  const handleNewTemplateNext = () => {
    if (!newTemplate.trim()) {
      toast.error("Please enter a template first");
      return;
    }
    setStep('transform');
  };

  const handleGenerate = async () => {
    if (!contentToTransform.trim()) {
      toast.error("Please enter content to transform");
      return;
    }

    if (!selectedTemplate && !newTemplate.trim()) {
      toast.error("Please select a template or create a new one");
      return;
    }

    // If saving as new template
    if (saveAsTemplate && newTemplate && templateName) {
      const newTemplateSetup: ContentSetup = {
        id: `template-${Date.now()}`,
        name: templateName,
        examples: [{ name: "Example", content: newTemplate }],
        isTemplate: true
      };
      onSaveTemplate?.(newTemplateSetup);
    }

    // Generate content using selected or new template
    const templateContent = selectedTemplate ? 
      selectedTemplate.examples?.[0]?.content : 
      newTemplate;

    // Analyze the content
    const analysis = analyzeTemplateAndContent(templateContent, contentToTransform);

    // Use a preprocessed prompt with very explicit instructions about formatting
    const prompt = `Transform this content to match the template format, removing any sections that don't have corresponding information.

TEMPLATE:
${templateContent}

CONTENT TO TRANSFORM:
${contentToTransform}

FORMATTING RULES:
1. DO NOT USE ANY ASTERISKS (*) ANYWHERE in your response
2. DO NOT format text as bold, italic, or with any markdown
3. Keep all emojis (like 🗣️ 💼 📅) exactly as they appear in the template
4. For section labels like "Position:" keep them exactly as in the template
5. Remove any fields where information is missing (don't show empty placeholders)
6. DO NOT add special characters around labels (no asterisks, no quotes, no formatting)
7. Maintain the exact original styling from the template (capitalization, spacing, etc.)
8. Return PLAIN TEXT output with NO MARKDOWN FORMATTING AT ALL

VISUAL ORGANIZATION GUIDELINES:
1. Use empty lines between major sections to create clear visual separation
2. Ensure headers and important information stand out with proper spacing around them
3. Place related information together in visually coherent blocks
4. Maintain consistent indentation for hierarchical information
5. Use line breaks strategically to improve readability of long paragraphs
6. Organize content in a logical flow with clear visual hierarchy
7. Keep labels and their corresponding values on the same line when appropriate
8. For lists, place each item on its own line with consistent spacing
9. Preserve the template's overall visual structure and aesthetic
10. Use double line breaks to separate major content sections`;

    onGenerate(prompt, analysis);
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className={`flex items-center ${step === 'select' ? 'text-blue-400' : 'text-white/40'}`}>
        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
          1
        </div>
        <span className="ml-2">Select Template</span>
      </div>
      <div className={`w-16 h-[2px] mx-2 ${step === 'transform' ? 'bg-blue-400' : 'bg-white/20'}`} />
      <div className={`flex items-center ${step === 'transform' ? 'text-blue-400' : 'text-white/40'}`}>
        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
          2
        </div>
        <span className="ml-2">Add Content</span>
      </div>
    </div>
  );

  return (
    <Card className="p-6 bg-[#18191B] border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Use a Template</h3>
        <button 
          onClick={onClose}
          className="text-white/60 hover:text-white/80"
        >
          ×
        </button>
      </div>

      {renderStepIndicator()}

      {step === 'select' ? (
        <Tabs defaultValue={savedTemplates.length > 0 ? "existing" : "new"} className="space-y-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="existing" disabled={savedTemplates.length === 0}>
              Use Existing Template
            </TabsTrigger>
            <TabsTrigger value="new">Create New Template</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            {savedTemplates.length > 0 ? (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {savedTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id
                          ? "bg-blue-500/20 border-2 border-blue-500"
                          : "bg-black/20 border border-white/10 hover:border-white/20"
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium text-white/90 mb-2">{template.name}</h5>
                          <div className="text-sm text-white/70">
                            {getFirstLine(template.examples?.[0]?.content || "")}
                          </div>
                        </div>
                        {selectedTemplate?.id === template.id && (
                          <CheckCircle2 className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 px-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Templates Yet</h3>
                <p className="text-white/60 text-sm mb-4">
                  Create your first template to start transforming content more efficiently.
                </p>
                <Button
                  variant="outline"
                  className="bg-blue-500/10 border-blue-500/20 text-blue-400"
                  onClick={() => {
                    const newTabTrigger = document.querySelector('[value="new"]') as HTMLButtonElement;
                    if (newTabTrigger) newTabTrigger.click();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/70 mb-2 block">
                  Template Content
                </label>
                <Textarea
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  placeholder="Paste your template here. The AI will intelligently identify and adapt important elements when generating content."
                  className="w-full h-32 bg-black/20 border-white/10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="saveTemplate"
                  checked={saveAsTemplate}
                  onCheckedChange={(checked) => setSaveAsTemplate(checked as boolean)}
                />
                <label
                  htmlFor="saveTemplate"
                  className="text-sm text-white/70 cursor-pointer"
                >
                  Save as template for future use
                </label>
              </div>

              {saveAsTemplate && (
                <div>
                  <label className="text-sm font-medium text-white/70 mb-2 block">
                    Template Name
                  </label>
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter a name for your template"
                    className="w-full bg-black/20 border-white/10"
                  />
                </div>
              )}

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleNewTemplateNext}
              >
                Continue to Content
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <h4 className="text-white/90 font-medium mb-2">
              {selectedTemplate ? selectedTemplate.name : (saveAsTemplate ? templateName : "New Template")}
            </h4>
            <div className="text-sm text-white/70 whitespace-pre-wrap">
              {selectedTemplate ? selectedTemplate.examples?.[0]?.content : newTemplate}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white/70 mb-2 block">
              Content to Transform
            </label>
            <div className="flex items-center gap-2 mb-3 bg-blue-500/10 text-blue-400 p-3 rounded border border-blue-500/20">
              <Info className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">
                Paste your content below. The AI will intelligently adapt it to match the template's style.
              </p>
            </div>
            <Textarea
              value={contentToTransform}
              onChange={(e) => setContentToTransform(e.target.value)}
              placeholder="Paste your content here (e.g., job posting, announcement, or any content you want to transform)"
              className="w-full h-40 bg-black/20 border-white/10"
            />
          </div>

          <div className="flex justify-between gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => setStep('select')}
              className="text-white/70 hover:text-white"
            >
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-white/70 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
                disabled={!contentToTransform.trim()}
              >
                <Clipboard className="h-4 w-4" />
                Generate Content
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}; 