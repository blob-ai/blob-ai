
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface ThemeSelectionFormProps {
  onSubmit: (theme: string, categories: string[]) => void;
}

const ThemeSelectionForm: React.FC<ThemeSelectionFormProps> = ({ onSubmit }) => {
  const [theme, setTheme] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Best practices",
    "Explanation / Analysis",
    "List of advice/rules/etc",
    "Striking advice"
  ]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (theme.trim()) {
      onSubmit(theme, selectedCategories);
    }
  };

  const categories = [
    "Best practices",
    "Explanation / Analysis",
    "List of advice/rules/etc",
    "Striking advice",
    "Useful resources",
    "Company sagas",
    "Tip",
    "Personal reflection",
    "Thought-provoking",
    "Rant"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="theme" className="text-lg font-medium">Theme</Label>
          <Info className="h-4 w-4 text-white/50" />
        </div>
        <Input
          id="theme"
          placeholder="Enter your theme (e.g., Education, Technology, Marketing)"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-lg font-medium">Post categories</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
                className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label 
                htmlFor={`category-${category}`}
                className="text-base font-normal cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full py-6 bg-purple-600 hover:bg-purple-500 text-lg rounded-xl"
      >
        Generate ideas
      </Button>
    </form>
  );
};

export default ThemeSelectionForm;
