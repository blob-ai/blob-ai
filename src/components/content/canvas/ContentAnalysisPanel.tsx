
import React from "react";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";

export interface ContentAnalysis {
  tone: string;
  wordCount: number;
  readingLevel: string;
  improvements: string[];
}

interface ContentAnalysisPanelProps {
  contentAnalysis: ContentAnalysis | null;
  className?: string;
}

const ContentAnalysisPanel: React.FC<ContentAnalysisPanelProps> = ({ 
  contentAnalysis,
  className 
}) => {
  if (!contentAnalysis) return null;

  return (
    <div 
      className={`mt-4 bg-[#12141D] rounded-lg border border-white/10 p-4 ${className || ""}`}
      id="content-analysis-panel"
      data-content-analysis="true"
      data-accordion-content="true"
    >
      <div className="flex items-center mb-3">
        <div className="flex items-center text-sm font-medium text-white">
          <span className="mr-2">
            <AlertCircle className="h-4 w-4 text-white/70" />
          </span>
          Content Analysis
        </div>
      </div>
      
      <Separator className="mb-4 bg-white/10" />
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-white/70">Tone:</span>
          <span className="bg-[#1E2536] px-3 py-1 rounded-full text-xs">
            {contentAnalysis.tone}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/70">Words:</span>
          <span className="bg-[#1E2536] px-3 py-1 rounded-full text-xs">
            {contentAnalysis.wordCount}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/70">Reading level:</span>
          <span className="bg-[#1E2536] px-3 py-1 rounded-full text-xs">
            {contentAnalysis.readingLevel}
          </span>
        </div>
        
        {contentAnalysis.improvements.length > 0 && (
          <>
            <div className="text-white/70 mt-2">Suggested improvements:</div>
            <ul className="list-disc pl-5 space-y-1 no-selection-toolbar">
              {contentAnalysis.improvements.map((improvement, index) => (
                <li key={index} className="text-white/90 text-xs">
                  {improvement}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentAnalysisPanel;
export type { ContentAnalysis };
