
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface AdvancedOptionsProps {
  goal: string;
  setGoal: (goal: string) => void;
  format: string;
  setFormat: (format: string) => void;
  hook: string;
  setHook: (hook: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  customGoal: string;
  setCustomGoal: (customGoal: string) => void;
  customFormat: string;
  setCustomFormat: (customFormat: string) => void;
  customHook: string;
  setCustomHook: (customHook: string) => void;
  customTone: string;
  setCustomTone: (customTone: string) => void;
  goalOptions: { value: string; label: string }[];
  formatOptions: { value: string; label: string }[];
  hookOptions: { value: string; label: string }[];
  toneOptions: { value: string; label: string }[];
}

const CustomInput = ({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value: string; 
  onChange: (value: string) => void;
  placeholder: string;
}) => (
  <Input
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="mt-2 bg-[#1A1A1A] border-none text-white/70 placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 font-sans h-12 px-4 text-base"
  />
);

const OptionSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder, 
  customValue = "",
  setCustomValue = () => {},
  customPlaceholder = "",
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  customValue?: string;
  setCustomValue?: (value: string) => void;
  customPlaceholder?: string;
}) => {
  // Filter out the custom option to handle it specially
  const standardOptions = options.filter(option => option.value !== "custom");
  
  return (
    <div className="mb-5">
      <p className="text-sm mb-2 text-white/80 font-sans">{label}</p>
      <div>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full bg-[#1A1A1A] border-none rounded-lg text-white/70 h-12 font-sans focus:ring-0 focus-visible:ring-offset-0 focus-visible:ring-0">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-[#121212] border-white/10 text-white font-sans">
            <SelectItem value="custom" className="text-[#60a5fa] font-sans">Custom</SelectItem>
            
            {standardOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="font-sans">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {value === "custom" && (
          <CustomInput 
            value={customValue} 
            onChange={setCustomValue} 
            placeholder={customPlaceholder} 
          />
        )}
      </div>
    </div>
  );
};

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  goal,
  setGoal,
  format,
  setFormat,
  hook,
  setHook,
  tone,
  setTone,
  customGoal,
  setCustomGoal,
  customFormat,
  setCustomFormat,
  customHook,
  setCustomHook,
  customTone,
  setCustomTone,
  goalOptions,
  formatOptions,
  hookOptions,
  toneOptions,
}) => {
  return (
    <div className="mt-6 space-y-4">
      <OptionSelect 
        label="Goal" 
        value={goal}
        onChange={setGoal}
        options={goalOptions}
        placeholder="What's the content's purpose?"
        customValue={customGoal}
        setCustomValue={setCustomGoal}
        customPlaceholder="Enter your custom goal..."
      />
      
      <OptionSelect 
        label="Format" 
        value={format}
        onChange={setFormat}
        options={formatOptions}
        placeholder="What's the content's format?"
        customValue={customFormat}
        setCustomValue={setCustomFormat}
        customPlaceholder="Enter your custom format..."
      />
      
      <OptionSelect 
        label="Hook" 
        value={hook}
        onChange={setHook}
        options={hookOptions}
        placeholder="What hook type to use?"
        customValue={customHook}
        setCustomValue={setCustomHook}
        customPlaceholder="Enter your custom hook type..."
      />
      
      <OptionSelect 
        label="Tone" 
        value={tone}
        onChange={setTone}
        options={toneOptions}
        placeholder="What tone should it have?"
        customValue={customTone}
        setCustomValue={setCustomTone}
        customPlaceholder="Enter your custom tone..."
      />
    </div>
  );
};

export default AdvancedOptions;
