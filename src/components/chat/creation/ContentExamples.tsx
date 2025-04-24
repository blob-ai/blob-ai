
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";

export type ExampleItem = {
  id: string;
  name: string;
  content: string;
};

interface ContentExamplesProps {
  examples: ExampleItem[];
  setExamples: React.Dispatch<React.SetStateAction<ExampleItem[]>>;
}

const ContentExamples: React.FC<ContentExamplesProps> = ({
  examples,
  setExamples,
}) => {
  const handleAddExample = () => {
    const newId = `example-${examples.length + 1}`;
    const newExample = {
      id: newId,
      name: `Example ${examples.length + 1}`,
      content: "",
    };
    setExamples([...examples, newExample]);
  };

  const handleRemoveExample = (id: string) => {
    setExamples(examples.filter((example) => example.id !== id));
  };

  const handleUpdateExample = (id: string, content: string) => {
    setExamples(
      examples.map((example) =>
        example.id === id ? { ...example, content } : example
      )
    );
  };

  return (
    <div className="mt-6">
      <div className="flex items-center mb-2">
        <p className="text-sm text-white/80 font-sans">
          Examples <span className="text-white/40">(recommended)</span>
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 rounded-full bg-[#60a5fa]/20 hover:bg-[#60a5fa]/30 p-0 ml-1.5"
          onClick={handleAddExample}
        >
          <Plus className="h-3 w-3 text-[#60a5fa]" />
        </Button>
      </div>

      {examples.length === 0 ? (
        <div
          className="bg-[#1A1A1A] rounded-lg p-4 text-gray-500 text-center cursor-pointer font-sans"
          onClick={handleAddExample}
        >
          Paste inspiring content to help the AI
        </div>
      ) : (
        <div className="space-y-3">
          {examples.map((example) => (
            <div
              key={example.id}
              className="bg-[#1A1A1A] rounded-lg p-3 relative"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-white/70 font-sans">{example.name}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-white/10 absolute top-2 right-2"
                  onClick={() => handleRemoveExample(example.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Paste inspiring content to help the AI"
                value={example.content}
                onChange={(e) => handleUpdateExample(example.id, e.target.value)}
                className="min-h-16 bg-[#1A1A1A] border-none text-white placeholder:text-gray-500 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 font-sans"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentExamples;
