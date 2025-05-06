
import React from "react";
import { Button } from "@/components/ui/button";
import { Book, MessageSquare, Users, Award, DollarSign, User } from "lucide-react";

interface ContentGoalOption {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

interface ContentGoalSelectorProps {
  selectedGoal: string;
  onSelectGoal: (goalId: string) => void;
}

const ContentGoalSelector: React.FC<ContentGoalSelectorProps> = ({
  selectedGoal,
  onSelectGoal,
}) => {
  const goals: ContentGoalOption[] = [
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
      icon: <User className="h-5 w-5 text-blue-400" />,
    },
    {
      id: "knowledge",
      title: "Educate Your Audience",
      description: "Teach valuable skills and share knowledge",
      icon: <Book className="h-5 w-5 text-blue-400" />,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">What's your content goal today?</h2>
      <p className="text-white/70 mb-6">Select the primary purpose of your content</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {goals.map((goal) => (
          <Button
            key={goal.id}
            variant="outline"
            className={`
              h-auto flex items-start p-4 gap-3 border-white/10 
              ${selectedGoal === goal.id ? 'bg-blue-950/40 border-blue-500/50' : 'bg-white/5 hover:bg-white/10'}
              transition-colors text-left`
            }
            onClick={() => onSelectGoal(goal.id)}
          >
            <div className="mt-0.5">{goal.icon}</div>
            <div>
              <div className="font-medium">{goal.title}</div>
              <div className="text-sm text-white/70 mt-0.5">{goal.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ContentGoalSelector;
