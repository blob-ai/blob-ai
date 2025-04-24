import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, CheckCircle, AlertCircle, Info, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { TemplateVariable, TemplateExtractionMode } from "@/types/setup";

interface ExtractTemplateCardProps {
  onClose: () => void;
  onExtract: (content: string, name: string, detectedVariables: TemplateVariable[]) => void;
  templateCount?: number;
}

const ExtractTemplateCard: React.FC<ExtractTemplateCardProps> = ({
  onClose,
  onExtract,
  templateCount = 0
}) => {
  const [content, setContent] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [extractedTemplate, setExtractedTemplate] = useState('');
  const [highlightedTemplate, setHighlightedTemplate] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionMode, setExtractionMode] = useState<TemplateExtractionMode>("auto");
  const [detectedVariables, setDetectedVariables] = useState<TemplateVariable[]>([]);
  const [customVariables, setCustomVariables] = useState<TemplateVariable[]>([]);
  const [newVariableName, setNewVariableName] = useState('');
  
  const COMMON_VARIABLES = [
    { pattern: /\b(company|organization|firm|enterprise|business|corporation)\b/gi, name: "COMPANY_NAME", label: "Company Name", description: "The name of the company" },
    { pattern: /\b(position|job|title|role|vacancy)\b/gi, name: "ROLE", label: "Job Title", description: "The title of the job position" },
    { pattern: /\b(salary|compensation|pay|wage|stipend|remuneration)\b/gi, name: "SALARY", label: "Salary", description: "The salary or compensation offered" },
    { pattern: /\b(location|place|city|site|venue|area)\b/gi, name: "LOCATION", label: "Location", description: "The job location" },
    { pattern: /\b(apply|link|url|application)\b/gi, name: "LINK", label: "Application Link", description: "Link to apply for the job" },
    { pattern: /\b(experience|level|seniority|grade|tier)\b/gi, name: "LEVEL", label: "Experience Level", description: "The required experience level" },
    { pattern: /\b(description|about|overview|summary)\b/gi, name: "DESCRIPTION", label: "Description", description: "Job or company description" },
    { pattern: /\b(requirements|qualifications|skills|requisites)\b/gi, name: "REQUIREMENTS", label: "Requirements", description: "Job requirements or qualifications" },
    { pattern: /\b(responsibilities|duties|tasks|functions|roles)\b/gi, name: "RESPONSIBILITIES", label: "Responsibilities", description: "Job responsibilities" },
    { pattern: /\b(benefits|perks|advantages|offerings)\b/gi, name: "BENEFITS", label: "Benefits", description: "Job benefits or perks" },
    { pattern: /\b(eligibility|criteria|qualifications)\b/gi, name: "ELIGIBILITY", label: "Eligibility", description: "Eligibility criteria" },
    { pattern: /\b(duration|period|term|timeline|length)\b/gi, name: "DURATION", label: "Duration", description: "Job duration or contract period" },
    { pattern: /\b(contact|person|name|author|poster)\b/gi, name: "NAME", label: "Contact Person", description: "Name of the contact person" },
    { pattern: /\b(deadline|due|closing|date|apply by)\b/gi, name: "DEADLINE", label: "Deadline", description: "Application deadline" },
    { pattern: /\b(hashtags?|tags)\b/gi, name: "HASHTAGS", label: "Hashtags", description: "Social media hashtags" }
  ];
  
  const detectRepeatedPhrases = (text: string): Record<string, number> => {
    const phrases: Record<string, number> = {};
    
    const regex = /\b(\w+\s+\w+\s+\w+(\s+\w+)*)\b/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const phrase = match[1];
      if (phrase.length > 10) {
        phrases[phrase] = (phrases[phrase] || 0) + 1;
      }
    }
    
    return Object.fromEntries(
      Object.entries(phrases).filter(([_, count]) => count > 1)
    );
  };
  
  const extractTemplateFromContent = (text: string): { template: string, variables: TemplateVariable[] } => {
    let template = text;
    const detectedVars: TemplateVariable[] = [];
    
    COMMON_VARIABLES.forEach(({ pattern, name, label, description }) => {
      let matches = [];
      let match;
      
      const patternRegex = new RegExp(pattern.source, pattern.flags);
      
      while ((match = patternRegex.exec(template)) !== null) {
        const start = Math.max(0, match.index - 30);
        const end = Math.min(template.length, match.index + match[0].length + 30);
        const context = template.substring(start, end);
        
        let valueMatch;
        if (name === "COMPANY_NAME") {
          valueMatch = /\b([A-Z][a-zA-Z\s]{2,})\b/g.exec(context.substring(match[0].length));
        } else if (name === "SALARY") {
          valueMatch = /\$\d+[kK]?(-| to |\s*-\s*)\$?\d+[kK]?(\/[a-z]+)?|\$\d+[kK]?(\/[a-z]+)?/g.exec(context);
        } else if (name === "LOCATION") {
          valueMatch = /\b([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})\b/g.exec(context);
        } else if (name === "LEVEL") {
          valueMatch = /\b(Entry|Junior|Mid|Senior|Lead|Principal)\b(-|\s)?(Level)?/g.exec(context);
        } else if (name === "LINK") {
          valueMatch = /https?:\/\/[^\s]+/g.exec(context);
        }
        
        if (valueMatch && !matches.includes(valueMatch[0])) {
          matches.push(valueMatch[0]);
        }
      }
      
      if (matches.length > 0) {
        matches.forEach(match => {
          const varName = `${name}_${detectedVars.filter(v => v.name.startsWith(name)).length + 1}`;
          detectedVars.push({
            name: varName,
            value: match,
            occurrences: 0,
            label: label,
            description: description
          });
          
          const escapedMatch = match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const replaceRegex = new RegExp(escapedMatch, 'g');
          const count = (template.match(replaceRegex) || []).length;
          
          if (count > 0) {
            detectedVars[detectedVars.length - 1].occurrences = count;
            template = template.replace(replaceRegex, `[${varName}]`);
          }
        });
      }
    });
    
    const repeatedPhrases = detectRepeatedPhrases(template);
    
    Object.entries(repeatedPhrases).forEach(([phrase, count]) => {
      if (count >= 2) {
        const varName = `REPEATED_PHRASE_${detectedVars.filter(v => v.name.startsWith('REPEATED_PHRASE')).length + 1}`;
        detectedVars.push({
          name: varName,
          value: phrase,
          occurrences: count,
          label: "Repeated Phrase",
          description: `This phrase appears ${count} times in the template`
        });
        
        const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const replaceRegex = new RegExp(escapedPhrase, 'g');
        template = template.replace(replaceRegex, `[${varName}]`);
      }
    });
    
    const patterns = [
      { pattern: /\b(Samsung|TikTok|PlayStation|Scale AI|Google|Meta|Microsoft|Apple)\b/gi, variable: "COMPANY_NAME" },
      { pattern: /\b(Software Engineer|Project Manager|Associate Project Manager|Strategic Projects Lead|Android Intern)\b/gi, variable: "ROLE" },
      { pattern: /\$\d+(\.\d+)?(-| to |\s*-\s*)\$?\d+(\.\d+)?\/?(hr|hour|hourly|yr|year|annual)/gi, variable: "SALARY" },
      { pattern: /\$\d+(\.\d+)?\/?(hr|hour|hourly|yr|year|annual)/gi, variable: "SALARY" },
      { pattern: /\b(San Francisco|New York|Mountain View|San Jose|Los Angeles), (CA|NY|NY, USA|CA, USA)\b/gi, variable: "LOCATION" },
      { pattern: /https?:\/\/[^\s]+/gi, variable: "LINK" },
      { pattern: /\b(Frederick Goh|Mark Benliyan)\b/gi, variable: "NAME" }
    ];
    
    patterns.forEach(({ pattern, variable }) => {
      if (!detectedVars.some(v => v.name.startsWith(variable))) {
        let match;
        const regex = new RegExp(pattern);
        
        if ((match = regex.exec(template)) !== null) {
          const varName = variable;
          const foundVar = detectedVars.find(v => v.name === varName);
          
          if (!foundVar) {
            detectedVars.push({
              name: varName,
              value: match[0],
              occurrences: 1,
              label: varName.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
              description: `${varName.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')} from the content`
            });
            
            const escapedMatch = match[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const replaceRegex = new RegExp(escapedMatch, 'g');
            const count = (template.match(replaceRegex) || []).length;
            
            if (count > 0) {
              detectedVars[detectedVars.length - 1].occurrences = count;
              template = template.replace(replaceRegex, `[${varName}]`);
            }
          }
        }
      }
    });
    
    return { template, variables: detectedVars };
  };
  
  const highlightVariables = (template: string) => {
    return template.replace(/\[([^\]]+)\]/g, '<span class="template-variable">[$1]</span>');
  };
  
  const handleGenerateTemplate = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter content to extract a template from",
        variant: "destructive"
      });
      return;
    }
    
    setIsExtracting(true);
    
    try {
      const { template, variables } = extractTemplateFromContent(content);
      setExtractedTemplate(template);
      setHighlightedTemplate(highlightVariables(template));
      setDetectedVariables(variables);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract template",
        variant: "destructive"
      });
      console.error("Template extraction error:", error);
    } finally {
      setIsExtracting(false);
    }
  };
  
  const handleAddCustomVariable = () => {
    if (!newVariableName.trim()) return;
    
    const varName = newVariableName.trim().toUpperCase().replace(/\s+/g, '_');
    
    if (customVariables.some(v => v.name === varName)) {
      toast({
        title: "Error",
        description: `Variable [${varName}] already exists`,
        variant: "destructive"
      });
      return;
    }
    
    setCustomVariables([...customVariables, {
      name: varName,
      value: "",
      occurrences: 0,
      label: newVariableName.trim(),
      description: `Custom variable: ${newVariableName.trim()}`
    }]);
    
    setNewVariableName("");
  };
  
  const handleManualVariableSelection = (text: string, variableName: string) => {
    if (!extractedTemplate) return;
    
    const newTemplate = extractedTemplate.replace(text, `[${variableName}]`);
    setExtractedTemplate(newTemplate);
    setHighlightedTemplate(highlightVariables(newTemplate));
    
    const updatedVariables = [...detectedVariables];
    const varIndex = updatedVariables.findIndex(v => v.name === variableName);
    
    if (varIndex >= 0) {
      updatedVariables[varIndex].occurrences = (updatedVariables[varIndex].occurrences || 0) + 1;
    }
    
    setDetectedVariables(updatedVariables);
  };
  
  const handleRemoveVariable = (variableName: string) => {
    const updatedVariables = detectedVariables.filter(v => v.name !== variableName);
    setDetectedVariables(updatedVariables);
    
    const variableToRemove = detectedVariables.find(v => v.name === variableName);
    
    if (variableToRemove && variableToRemove.value) {
      const updatedTemplate = extractedTemplate.replace(
        new RegExp(`\\[${variableName}\\]`, 'g'),
        variableToRemove.value
      );
      
      setExtractedTemplate(updatedTemplate);
      setHighlightedTemplate(highlightVariables(updatedTemplate));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!extractedTemplate) {
      handleGenerateTemplate();
      return;
    }
    
    const finalName = templateName.trim() 
      ? templateName.trim() 
      : `Template ${templateCount + 1}`;
    
    const allVariables = [...detectedVariables, ...customVariables];
    
    onExtract(extractedTemplate, finalName, allVariables);
  };
  
  return (
    <Card className="p-6 bg-[#18191B] border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Extract Template</h3>
        <button 
          onClick={onClose}
          className="text-white/60 hover:text-white/80"
        >
          ×
        </button>
      </div>
      
      <Tabs defaultValue="auto" onValueChange={(value) => setExtractionMode(value as TemplateExtractionMode)}>
        <TabsList className="mb-4">
          <TabsTrigger value="auto">Auto Extraction</TabsTrigger>
          <TabsTrigger value="manual">Manual Editing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white/70 mb-2">
                Template Name (optional)
              </label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder={`Template ${templateCount + 1}`}
                className="w-full bg-black/20 border-white/10 mb-4"
              />
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-400">
                    Paste your content below. The system will automatically detect company names, roles, locations, and other variables.
                  </p>
                </div>
              </div>
              
              <label className="block text-white/70 mb-2">
                Paste content to extract template from
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your job posting, announcement, or any content you want to templatize. The system will automatically detect variables."
                className="w-full h-40 bg-black/20 border-white/10"
              />
            </div>
            
            {(extractedTemplate && detectedVariables.length > 0) && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <label className="text-white/70">
                      Detected Variables
                    </label>
                  </div>
                  <span className="text-xs text-white/50">
                    {detectedVariables.length} variables found
                  </span>
                </div>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  {detectedVariables.map((variable) => (
                    <Badge 
                      key={variable.name} 
                      className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-full px-2 py-0.5 flex items-center gap-1 border border-blue-500/20"
                    >
                      {variable.name}
                      {variable.occurrences && variable.occurrences > 1 && (
                        <span className="text-xs bg-blue-500/20 px-1 rounded-full ml-1">
                          {variable.occurrences}×
                        </span>
                      )}
                      <button 
                        className="ml-1 hover:text-white"
                        onClick={() => handleRemoveVariable(variable.name)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/70">
                    Template Preview
                  </label>
                </div>
                <div className="p-3 bg-black/30 border border-white/10 rounded-md max-h-60 overflow-y-auto">
                  <div className="whitespace-pre-wrap text-white/80" dangerouslySetInnerHTML={{ __html: highlightedTemplate }} />
                </div>
                <div className="mt-2 text-xs text-white/50">
                  Variables are shown in [BRACKETS]. Switch to "Manual Editing" if you want to customize.
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="mr-2"
              >
                Cancel
              </Button>
              {extractedTemplate ? (
                <Button
                  type="submit"
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Save Template
                </Button>
              ) : (
                <Button
                  type="button"
                  className="gap-2"
                  disabled={!content.trim() || isExtracting}
                  onClick={handleGenerateTemplate}
                >
                  {isExtracting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <FileCode className="h-4 w-4" />
                      Extract Template
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="manual">
          {!extractedTemplate ? (
            <div className="flex flex-col items-center py-8 text-center text-white/60">
              <AlertCircle className="h-8 w-8 mb-2 text-white/40" />
              <p className="mb-4">Please first extract a template in the Auto Extraction tab</p>
              <Button
                variant="outline"
                onClick={() => setExtractionMode("auto")}
              >
                Go to Auto Extraction
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={newVariableName}
                  onChange={(e) => setNewVariableName(e.target.value)}
                  placeholder="Enter new variable name"
                  className="bg-black/20 border-white/10"
                />
                <Button
                  type="button"
                  onClick={handleAddCustomVariable}
                  disabled={!newVariableName.trim()}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="mb-4 flex flex-wrap gap-2">
                {[...detectedVariables, ...customVariables].map((variable) => (
                  <Badge 
                    key={variable.name} 
                    className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 rounded-full px-2 py-0.5"
                    variant="outline"
                  >
                    {variable.name}
                    {variable.occurrences && variable.occurrences > 1 && (
                      <span className="text-xs bg-blue-500/20 px-1 rounded-full ml-1">
                        {variable.occurrences}×
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
              
              <div className="p-3 bg-black/30 border border-white/10 rounded-md max-h-60 overflow-y-auto">
                <div className="whitespace-pre-wrap text-white/80" dangerouslySetInnerHTML={{ __html: highlightedTemplate }} />
              </div>
              
              <p className="text-xs text-white/50">
                To add a variable, select text in the template and choose which variable it should be replaced with.
              </p>
              
              <div className="flex justify-end mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setExtractionMode("auto")}
                  className="mr-2"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="gap-2"
                  onClick={handleSubmit}
                >
                  <CheckCircle className="h-4 w-4" />
                  Save Template
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ExtractTemplateCard;
