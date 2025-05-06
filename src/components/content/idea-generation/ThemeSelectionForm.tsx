
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Book, User, MessageSquare, Award, DollarSign, Share, Info, Users } from "lucide-react";
import ContentGoalSelector from "./ContentGoalSelector";

interface ThemeSelectionFormProps {
  onSubmit: (theme: string, categories: string[], goal: string) => void;
}

// Define category groupings by goal
const categoriesByGoal: Record<string, string[]> = {
  knowledge: ["Best practices", "Explanation / Analysis", "List of advice/rules/etc", "Useful resources"],
  community: ["Thought-provoking", "Personal reflection", "Rant", "Company sagas"],
  growth: ["Striking advice", "Tip", "List of advice/rules/etc", "Useful resources"],
  brand: ["Company sagas", "Personal reflection", "Thought-provoking", "Explanation / Analysis"],
  personal: ["Personal reflection", "Milestones", "Lessons learned", "Before/after", "Challenges overcome"],
  thought: ["Thought-provoking", "Explanation / Analysis", "Personal reflection", "Best practices"],
  custom: ["Best practices", "Explanation / Analysis", "List of advice/rules/etc", "Striking advice", 
           "Useful resources", "Company sagas", "Tip", "Personal reflection", "Thought-provoking", "Rant"]
};

const ThemeSelectionForm: React.FC<ThemeSelectionFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
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
    if (selectedCategories.length > 0) {
      onSubmit(theme, selectedCategories, selectedGoal);
    }
  };
  
  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    setStep(2);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 ? (
        <ContentGoalSelector 
          selectedGoal={selectedGoal} 
          onSelectGoal={handleGoalSelect} 
        />
      ) : (
        <>
          <div className="bg-blue-100/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
            {renderGoalIcon(selectedGoal)}
            <span className="text-sm text-blue-100">{getGoalTitle(selectedGoal)}</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-col">
              <Label className="text-lg font-medium">Post categories</Label>
              <span className="text-sm text-white/70">Popular in {getGoalTitle(selectedGoal)}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              {(categoriesByGoal[selectedGoal] || []).map((category) => (
                <div key={category} className="flex items-center space-x-2 py-2">
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

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="theme" className="text-lg font-medium">What topic are you focusing on?</Label>
              <span className="text-xs text-white/50">(optional)</span>
              <Info className="h-4 w-4 text-white/50" />
            </div>
            <Input
              id="theme"
              placeholder="Enter your niche, industry, or specific subject"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 bg-[#3260ea] hover:bg-[#5078F3] text-lg rounded-xl"
            disabled={selectedCategories.length === 0}
          >
            Generate Content Ideas
          </Button>
        </>
      )}
    </form>
  );
};

// Helper functions
function getGoalTitle(goalId: string): string {
  const goalMap: Record<string, string> = {
    knowledge: "Educate Your Audience",
    community: "Boost Engagement",
    growth: "Grow My Audience",
    brand: "Promote Product/Service",
    personal: "Share Personal Journey",
    thought: "Build Authority",
  };
  return goalMap[goalId] || goalId;
}

function renderGoalIcon(goalId: string): React.ReactNode {
  switch (goalId) {
    case "growth":
      return <Users className="h-4 w-4 text-blue-300" />;
    case "community":
      return <MessageSquare className="h-4 w-4 text-blue-300" />;
    case "thought":
      return <Award className="h-4 w-4 text-blue-300" />;
    case "brand":
      return <DollarSign className="h-4 w-4 text-blue-300" />;
    case "personal":
      return <User className="h-4 w-4 text-blue-300" />;
    case "knowledge":
      return <Book className="h-4 w-4 text-blue-300" />;
    default:
      return null;
  }
}

export default ThemeSelectionForm;
