
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileCode, Upload, Info } from "lucide-react";

interface TemplateSelectionCardProps {
  onSelectExisting: () => void;
  onExtractNew: () => void;
  onClose: () => void;
}

const TemplateSelectionCard: React.FC<TemplateSelectionCardProps> = ({
  onSelectExisting,
  onExtractNew,
  onClose
}) => {
  return (
    <Card className="p-6 bg-[#18191B] border border-white/10">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-white">Choose Template Option</h3>
        <button 
          onClick={onClose}
          className="text-white/60 hover:text-white/80"
        >
          ×
        </button>
      </div>
      
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
        <div className="flex gap-2">
          <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-400">
            Templates help you quickly create consistent content by replacing variables in [BRACKETS]. 
            Extract templates from examples or use existing ones to generate new content.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="flex flex-col items-start w-full h-[110px] px-5 py-4 bg-[#18191B]/80 hover:bg-[#1C1D20]/90 border border-[#2A2B32] rounded-2xl transition-colors text-left group"
          onClick={onExtractNew}
        >
          <div className="flex items-center gap-3 w-full mb-0.5">
            <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20">
              <Upload className="h-4 w-4" />
            </span>
            <span className="text-[15px] font-semibold text-white">Extract from example</span>
          </div>
          <p className="text-[12px] text-[#71767B] leading-[1.4] pl-[43px]">
            Create template from<br />existing content with [VARIABLES]
          </p>
        </Button>

        <Button 
          variant="outline" 
          className="flex flex-col items-start w-full h-[110px] px-5 py-4 bg-[#18191B]/80 hover:bg-[#1C1D20]/90 border border-[#2A2B32] rounded-2xl transition-colors text-left group"
          onClick={onSelectExisting}
        >
          <div className="flex items-center gap-3 w-full mb-0.5">
            <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20">
              <FileCode className="h-4 w-4" />
            </span>
            <span className="text-[15px] font-semibold text-white">Use existing template</span>
          </div>
          <p className="text-[12px] text-[#71767B] leading-[1.4] pl-[43px]">
            Select from your saved<br />content templates
          </p>
        </Button>
      </div>
    </Card>
  );
};

export default TemplateSelectionCard;
