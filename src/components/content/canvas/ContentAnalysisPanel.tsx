
import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BarChart2 } from "lucide-react";

export interface ContentAnalysis {
  tone?: string;
  wordCount?: number;
  readingLevel?: string;
  improvements?: string[];
}

interface ContentAnalysisPanelProps {
  contentAnalysis: ContentAnalysis | null;
  className?: string;
}

const ContentAnalysisPanel: React.FC<ContentAnalysisPanelProps> = ({
  contentAnalysis,
  className = "",
}) => {
  if (!contentAnalysis) return null;

  return (
    <div 
      className={`border-t border-white/10 ${className}`}
      id="content-analysis-panel"
      data-content-analysis="true"
    >
      <Accordion type="single" collapsible defaultValue="analysis">
        <AccordionItem value="analysis" className="border-none">
          <AccordionTrigger className="py-3 px-4 text-sm font-medium hover:no-underline">
            <div className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-2 text-blue-400" />
              Content Analysis
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 content-analysis-panel" data-accordion-content="true">
            <div className="space-y-2 text-sm no-selection-toolbar">
              <div className="flex justify-between">
                <span className="text-white/70">Tone:</span>
                <Badge variant="outline" className="bg-white/5">{contentAnalysis.tone}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Words:</span>
                <Badge variant="outline" className="bg-white/5">{contentAnalysis.wordCount}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Reading level:</span>
                <Badge variant="outline" className="bg-white/5">{contentAnalysis.readingLevel}</Badge>
              </div>
              {contentAnalysis.improvements && contentAnalysis.improvements.length > 0 && (
                <>
                  <div className="text-white/70 pt-1">Suggested improvements:</div>
                  <ul className="space-y-1">
                    {contentAnalysis.improvements.map((improvement, i) => (
                      <li key={i} className="text-xs flex items-center">
                        <span className="h-1 w-1 rounded-full bg-blue-400 mr-2"></span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ContentAnalysisPanel;
