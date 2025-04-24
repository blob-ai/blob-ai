
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export const FaqAccordion = ({ items }: FaqAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`border border-white/20 rounded-lg overflow-hidden backdrop-blur-sm transition-all duration-300 ${
            openIndex === index ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/20' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
            onClick={() => toggleItem(index)}
          >
            <span className="text-lg font-medium text-white">{item.question}</span>
            <ChevronDown 
              className={`h-5 w-5 text-white/70 transition-transform ${openIndex === index ? 'transform rotate-180 text-blue-400' : ''}`} 
            />
          </button>
          
          <div 
            className={`px-6 overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
            }`}
          >
            <p className="text-white/80">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
