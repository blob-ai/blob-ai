
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AnalysisSection {
  title: string;
  items: string[];
}

interface PostAnalysisResultProps {
  sections: AnalysisSection[];
  onUseFormat: () => void;
  onCreateSimilar: () => void;
}

const PostAnalysisResult: React.FC<PostAnalysisResultProps> = ({
  sections,
  onUseFormat,
  onCreateSimilar,
}) => {
  const cleanText = (text: string) => {
    // Remove markdown-style bold markers and trim any leading indicators
    return text.replace(/\*\*/g, '').replace(/^•\s*/, '').trim();
  };

  return (
    <div className="rounded-lg overflow-hidden text-white bg-[#1A1F2C] font-sans max-w-xl">
      <div className="max-h-[600px] overflow-y-auto p-4">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-bold text-white/90 mb-3 uppercase tracking-wider">
              {section.title}
            </h3>
            <Separator className="mb-3 bg-white/20" />
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <div 
                  key={i} 
                  className="text-sm text-white/80 font-sans pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-white/50"
                >
                  {cleanText(item)}
                </div>
              ))}
            </div>
            {index < sections.length - 1 && (
              <Separator className="my-4 bg-white/10" />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 p-3 border-t border-white/10">
        <Button
          variant="ghost"
          className="text-[#60a5fa] hover:text-[#60a5fa]/80 hover:bg-[#60a5fa]/10 font-sans"
          onClick={onUseFormat}
        >
          Use exact format
        </Button>
        <Button
          variant="ghost"
          className="text-[#60a5fa] hover:text-[#60a5fa]/80 hover:bg-[#60a5fa]/10 font-sans"
          onClick={onCreateSimilar}
        >
          Create similar content
        </Button>
      </div>
    </div>
  );
};

export default PostAnalysisResult;
