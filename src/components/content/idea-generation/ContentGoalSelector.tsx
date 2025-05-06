
import React from "react";
import { Award, Book, DollarSign, MessageSquare, Share, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentGoalOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ContentGoalSelectorProps {
  selectedGoal: string;
  onSelectGoal: (goalId: string) => void;
}

const ContentGoalSelector: React.FC<ContentGoalSelectorProps> = ({
  selectedGoal,
  onSelectGoal,
}) => {
  const goalOptions: ContentGoalOption[] = [
    {
      id: "growth",
      title: "Grow My Audience",
      description: "Content that attracts new followers and expands your reach",
      icon: <Users className="h-5 w-5 text-blue-400" />,
    },
    {
      id: "community",
      title: "Boost Engagement",
      description: "Drive more comments, shares, and interactions",
      icon: <MessageSquare className="h-5 w-5 text-blue-400" />,
    },
    {
      id: "thought",
      title: "Build Authority",
      description: "Position yourself as a thought leader in your space",
      icon: <Award className="h-5 w-5 text-blue-400" />,
    },
    {
      id: "brand",
      title: "Promote Product/Service",
      description: "Content that drives conversions and sales",
      icon: <DollarSign className="h-5 w-5 text-blue-400" />,
    },
    {
      id: "personal",
      title: "Share Personal Journey",
      description: "Authentic content about your experiences",
      icon: <Share className="h-5 w-5 text-blue-400" />,
    },
    {
      id: "knowledge",
      title: "Educate Your Audience",
      description: "Teach valuable skills and share knowledge",
      icon: <Book className="h-5 w-5 text-blue-400" />,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white">What's your content goal today?</h2>
      <p className="text-white/70">Select the primary purpose of your content</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {goalOptions.map((goal) => (
          <button
            key={goal.id}
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
              selectedGoal === goal.id
                ? "bg-blue-600/20 border-blue-500"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
            onClick={() => onSelectGoal(goal.id)}
          >
            <div className="mt-0.5">{goal.icon}</div>
            <div>
              <h3 className="font-medium text-white">{goal.title}</h3>
              <p className="text-sm text-white/70 mt-1">{goal.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContentGoalSelector;
