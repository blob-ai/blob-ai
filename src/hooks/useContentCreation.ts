import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ContentIdea } from "@/components/content/idea-generation/IdeasGallery";

export enum CreationStep {
  START,
  THEME_SELECTION,
  IDEAS_GALLERY,
  CONTENT_CANVAS,
  PUBLISH,
}

export const useContentCreation = () => {
  // State variables
  const [currentStep, setCurrentStep] = useState<CreationStep>(CreationStep.START);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [theme, setTheme] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [contentGoal, setContentGoal] = useState("knowledge");
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [content, setContent] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [usageCount, setUsageCount] = useState(2);
  const [maxUsage] = useState(5);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL params to determine initial step
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const step = params.get('step');

    if (step === 'theme') {
      setCurrentStep(CreationStep.THEME_SELECTION);
    } else if (step === 'canvas') {
      setCurrentStep(CreationStep.CONTENT_CANVAS);
    } else {
      // Show the creation modal automatically when no specific step is provided
      setShowCreationModal(true);
    }
  }, [location]);

  // Function to generate mock ideas based on theme, categories, and goal
  const generateIdeas = (theme: string, categories: string[], goal: string) => {
    // This would be an API call in a real application
    const goalPrefix = getGoalPrefix(goal);
    
    const mockIdeas: ContentIdea[] = [
      {
        id: "1",
        title: `${goalPrefix}: How to integrate AI effectively in ${theme} teaching for more engaging learning experiences.`,
        category: categories[0] || "Best practices",
        categoryColor: "bg-orange-100 text-orange-800",
        hooks: [
          {
            id: "h1",
            text: "You only need one yes. I rewrote my story 107 times to get it.",
            author: {
              name: "Alex Johnson",
              avatar: "/placeholder.svg",
              credential: "Prev @ EdTech | Stanford",
            }
          },
          {
            id: "h2",
            text: `10X or nothing. Why aim for just 10% better in ${theme.toLowerCase()} when you can change the game?`,
            author: {
              name: "Sarah Williams",
              avatar: "/placeholder.svg",
              credential: "Founder @ LearnTech | Harvard",
            }
          }
        ]
      },
      {
        id: "2",
        title: `${goalPrefix}: Why blended learning is becoming the new normal in ${theme} schools and universities.`,
        category: categories[0] || "Explanation / Analysis",
        categoryColor: "bg-green-100 text-green-800",
        hooks: [
          {
            id: "h3",
            text: `Your destiny in ${theme.toLowerCase()} is determined by the choices you make today. Choose wisely.`,
            author: {
              name: "Michael Chen",
              avatar: "/placeholder.svg",
              credential: "Director @ EducateNow | MIT",
            }
          },
          {
            id: "h4",
            text: `The future of ${theme.toLowerCase()} isn't about technology — it's about how we use it.`,
            author: {
              name: "Emma Rodriguez",
              avatar: "/placeholder.svg",
              credential: "Digital Learning Specialist",
            }
          }
        ]
      },
      {
        id: "3",
        title: `${goalPrefix}: 10 crucial skills every ${theme} educator should develop for modern classrooms.`,
        category: categories[0] || "List of advice/rules/etc",
        categoryColor: "bg-purple-100 text-purple-800",
        hooks: [
          {
            id: "h5",
            text: "The most dangerous phrase in education is 'we've always done it this way'.",
            author: {
              name: "James Peterson",
              avatar: "/placeholder.svg",
              credential: "Education Innovator | Yale",
            }
          },
          {
            id: "h6",
            text: `Knowledge isn't power until it's applied. Here's how ${theme.toLowerCase()} is evolving.`,
            author: {
              name: "Lisa Wang",
              avatar: "/placeholder.svg",
              credential: "EdTech Researcher",
            }
          }
        ]
      },
      {
        id: "4",
        title: `${goalPrefix}: Top 5 online platforms offering free courses in ${theme.toLowerCase()} and entrepreneurship for students.`,
        category: categories[0] || "Useful resources",
        categoryColor: "bg-sky-100 text-sky-800",
        hooks: [
          {
            id: "h7",
            text: "I spent $50,000 on my degree. These free resources taught me more.",
            author: {
              name: "David Kim",
              avatar: "/placeholder.svg",
              credential: "Self-taught Expert",
            }
          },
          {
            id: "h8",
            text: `The best ${theme.toLowerCase()} happens outside the classroom. Here's where to find it.`,
            author: {
              name: "Rachel Greene",
              avatar: "/placeholder.svg",
              credential: "Learning Advocate",
            }
          }
        ]
      },
      {
        id: "5",
        title: `${goalPrefix}: Reflecting on my journey from a traditional ${theme.toLowerCase()} teacher to embracing digital tools - here's what I learned about adaptability and change.`,
        category: categories[0] || "Personal reflection",
        categoryColor: "bg-pink-100 text-pink-800",
        hooks: [
          {
            id: "h9",
            text: "After 15 years in the classroom, I realized I was teaching for the wrong century.",
            author: {
              name: "Thomas Wright",
              avatar: "/placeholder.svg",
              credential: "Education Veteran",
            }
          },
          {
            id: "h10",
            text: `The tools change, but the principles of good ${theme.toLowerCase()} remain timeless.`,
            author: {
              name: "Sophia Miller",
              avatar: "/placeholder.svg",
              credential: "Digital Transformation Lead",
            }
          }
        ]
      },
      {
        id: "6",
        title: `${goalPrefix}: Is our current ${theme.toLowerCase()} system preparing students adequately for jobs that do not exist yet?`,
        category: categories[0] || "Thought-provoking",
        categoryColor: "bg-indigo-100 text-indigo-800",
        hooks: [
          {
            id: "h11",
            text: "We're preparing students for a world that no longer exists.",
            author: {
              name: "Jonathan Lee",
              avatar: "/placeholder.svg",
              credential: "Future of Work Analyst",
            }
          },
          {
            id: "h12",
            text: `The skills gap in ${theme.toLowerCase()} isn't about technology — it's about adaptability.`,
            author: {
              name: "Olivia Chen",
              avatar: "/placeholder.svg",
              credential: "Industry-Education Bridge",
            }
          }
        ]
      },
    ];
    
    setGeneratedIdeas(mockIdeas);
    setCurrentStep(CreationStep.IDEAS_GALLERY);
    setUsageCount(prev => Math.min(prev + 1, maxUsage));
    toast.success(`Generated ideas for "${theme}" with ${goal} goal`);
  };

  // Helper function to get a prefix based on the content goal
  const getGoalPrefix = (goal: string): string => {
    switch (goal) {
      case "knowledge":
        return "Learn";
      case "community":
        return "Discuss";
      case "growth":
        return "Grow";
      case "brand":
        return "Brand";
      case "leads":
        return "Discover";
      case "thought":
        return "Insight";
      default:
        return "";
    }
  };

  const handleThemeSubmit = (theme: string, categories: string[], goal: string = "knowledge") => {
    setTheme(theme);
    setCategories(categories);
    setContentGoal(goal);
    generateIdeas(theme, categories, goal);
  };

  const handleCombinationSelect = (idea: ContentIdea, hookId: string) => {
    const selectedHook = idea.hooks?.find(hook => hook.id === hookId);
    
    if (selectedHook) {
      setSelectedIdea(idea);
      
      // Generate content based on selected idea and hook
      setContent(`${selectedHook.text}\n\nHere's my perspective on ${idea.title}:\n\n[Your content will be generated here based on the selected idea and hook]`);
      setCurrentStep(CreationStep.CONTENT_CANVAS);
    } else {
      // Just use the idea without a hook
      setSelectedIdea(idea);
      setContent(`Here's my perspective on ${idea.title}:\n\n[Your content will be generated here based on the selected idea]`);
      setCurrentStep(CreationStep.CONTENT_CANVAS);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowCreationModal(false);
    
    if (option === "idea-generation") {
      setCurrentStep(CreationStep.THEME_SELECTION);
      navigate('/dashboard/content?step=theme', { replace: true });
    } else if (option === "blank-canvas") {
      setContent("");
      setCurrentStep(CreationStep.CONTENT_CANVAS);
      navigate('/dashboard/content?step=canvas', { replace: true });
    } else {
      // Handle other options by showing a notification for demo
      toast.info(`${option} option selected. This feature is coming soon!`);
    }
  };

  const handlePublish = (content: string) => {
    setContent(content);
    setShowPublishModal(true);
  };

  const handleSaveDraft = (content: string) => {
    setContent(content);
    toast.success("Draft saved successfully");
  };

  const handleSchedule = (content: string, date: Date) => {
    setContent(content);
    toast.success(`Scheduled for publication on ${date.toLocaleDateString()}`);
  };

  const navigateToStep = (step: CreationStep) => {
    setCurrentStep(step);
    
    // Update URL to reflect the step change
    if (step === CreationStep.THEME_SELECTION) {
      navigate('/dashboard/content?step=theme', { replace: true });
    } else if (step === CreationStep.CONTENT_CANVAS) {
      navigate('/dashboard/content?step=canvas', { replace: true });
    } else {
      navigate('/dashboard/content', { replace: true });
    }
  };

  return {
    currentStep,
    showCreationModal,
    selectedOption,
    theme,
    categories,
    contentGoal,
    generatedIdeas,
    selectedIdea,
    content,
    showPublishModal,
    favorites,
    usageCount,
    maxUsage,
    setShowCreationModal,
    setCurrentStep,
    setFavorites,
    handleThemeSubmit,
    handleCombinationSelect,
    handleOptionSelect,
    handlePublish,
    handleSaveDraft,
    handleSchedule,
    navigateToStep,
    setShowPublishModal
  };
};
