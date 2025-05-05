
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { goalOptions } from "@/components/chat/creation/constants";

interface ThemeSelectionFormProps {
  onSubmit: (theme: string, categories: string[], goal: string) => void;
}

// Define category groupings by goal
const categoriesByGoal: Record<string, string[]> = {
  knowledge: ["Best practices", "Explanation / Analysis", "List of advice/rules/etc", "Useful resources"],
  community: ["Thought-provoking", "Personal reflection", "Rant", "Company sagas"],
  growth: ["Striking advice", "Tip", "List of advice/rules/etc", "Useful resources"],
  brand: ["Company sagas", "Personal reflection", "Thought-provoking", "Explanation / Analysis"],
  leads: ["Useful resources", "List of advice/rules/etc", "Tip", "Striking advice"],
  thought: ["Thought-provoking", "Explanation / Analysis", "Personal reflection", "Best practices"],
  custom: ["Best practices", "Explanation / Analysis", "List of advice/rules/etc", "Striking advice", 
           "Useful resources", "Company sagas", "Tip", "Personal reflection", "Thought-provoking", "Rant"]
};

const ThemeSelectionForm: React.FC<ThemeSelectionFormProps> = ({ onSubmit }) => {
  const [theme, setTheme] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("knowledge");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Update available categories when goal changes
  useEffect(() => {
    // Pre-select the first two categories when goal changes
    const availableCategories = categoriesByGoal[selectedGoal] || [];
    if (availableCategories.length > 0) {
      setSelectedCategories([availableCategories[0]]);
      if (availableCategories.length > 1) {
        setSelectedCategories([availableCategories[0], availableCategories[1]]);
      }
    } else {
      setSelectedCategories([]);
    }
  }, [selectedGoal]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (theme.trim() && selectedCategories.length > 0) {
      onSubmit(theme, selectedCategories, selectedGoal);
    }
  };

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
        <Label className="text-lg font-medium">Content Goal</Label>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <RadioGroup value={selectedGoal} onValueChange={setSelectedGoal} className="space-y-2">
            {goalOptions.map((goal) => (
              <div key={goal.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={goal.value} 
                  id={`goal-${goal.value}`} 
                  className="text-blue-600"
                />
                <Label 
                  htmlFor={`goal-${goal.value}`} 
                  className="text-base font-normal cursor-pointer"
                >
                  {goal.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-lg font-medium">Post categories</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
          {(categoriesByGoal[selectedGoal] || []).map((category) => (
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
        disabled={theme.trim() === "" || selectedCategories.length === 0}
      >
        Generate ideas
      </Button>
    </form>
  );
};

export default ThemeSelectionForm;
