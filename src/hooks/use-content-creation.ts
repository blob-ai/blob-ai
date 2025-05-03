
import { useState } from "react";
import { ContentIdea } from "@/components/content/idea-generation/IdeasGallery";
import { HookOption } from "@/components/content/hooks/HookSelector";
import { toast } from "sonner";

export enum CreationStep {
  START,
  CREATION_OPTIONS,
  THEME_SELECTION,
  IDEAS_GALLERY,
  HOOK_SELECTION,
  CONTENT_CANVAS,
  PUBLISH,
}

export function useContentCreation() {
  const [currentStep, setCurrentStep] = useState<CreationStep>(CreationStep.START);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [theme, setTheme] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [hooks, setHooks] = useState<HookOption[]>([]);
  const [selectedHook, setSelectedHook] = useState<HookOption | null>(null);
  const [content, setContent] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [usageCount, setUsageCount] = useState(2);
  const [maxUsage] = useState(5);

  // Modified to skip intermediate steps and go directly to modal
  const handleCreateClick = () => {
    setShowCreationModal(true);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowCreationModal(false);
    
    if (option === "idea-generation") {
      setCurrentStep(CreationStep.THEME_SELECTION);
    } else if (option === "blank-canvas") {
      setContent("");
      setCurrentStep(CreationStep.CONTENT_CANVAS);
    } else {
      // Handle other options by showing a notification for demo
      toast.info(`${option} option selected. This feature is coming soon!`);
    }
  };

  const handleThemeSubmit = (theme: string, categories: string[]) => {
    setTheme(theme);
    setCategories(categories);
    generateIdeas(theme, categories);
  };

  const generateIdeas = (theme: string, categories: string[]) => {
    // This would be an API call in a real application
    const mockIdeas: ContentIdea[] = [
      {
        id: "1",
        title: `How to integrate AI effectively in ${theme} teaching for more engaging learning experiences.`,
        category: "Best practices",
        categoryColor: "bg-orange-100 text-orange-800",
      },
      {
        id: "2",
        title: `Why blended learning is becoming the new normal in ${theme} schools and universities.`,
        category: "Explanation / Analysis",
        categoryColor: "bg-green-100 text-green-800",
      },
      {
        id: "3",
        title: `10 crucial skills every ${theme} educator should develop for modern classrooms.`,
        category: "List of advice/rules/etc",
        categoryColor: "bg-purple-100 text-purple-800",
      },
      {
        id: "4",
        title: `Top 5 online platforms offering free courses in ${theme.toLowerCase()} and entrepreneurship for students.`,
        category: "Useful resources",
        categoryColor: "bg-sky-100 text-sky-800",
      },
      {
        id: "5",
        title: `Reflecting on my journey from a traditional ${theme.toLowerCase()} teacher to embracing digital tools - here's what I learned about adaptability and change.`,
        category: "Personal reflection",
        categoryColor: "bg-pink-100 text-pink-800",
      },
      {
        id: "6",
        title: `Is our current ${theme.toLowerCase()} system preparing students adequately for jobs that do not exist yet?`,
        category: "Thought-provoking",
        categoryColor: "bg-indigo-100 text-indigo-800",
      },
    ];
    
    setGeneratedIdeas(mockIdeas);
    setCurrentStep(CreationStep.IDEAS_GALLERY);
    setUsageCount(prev => Math.min(prev + 1, maxUsage));
    toast.success(`Generated ideas for "${theme}"`);
  };

  const handleIdeaSelect = (idea: ContentIdea) => {
    generateHooks(idea);
  };

  const generateHooks = (idea: ContentIdea) => {
    // This would be an API call in a real application
    const mockHooks: HookOption[] = [
      {
        id: "1",
        text: "You only need one yes. I rewrote my story 107 times to get it.",
        author: {
          name: "Alex Johnson",
          avatar: "/placeholder.svg",
          credential: "Prev @ EdTech | Stanford",
        },
      },
      {
        id: "2",
        text: `10X or nothing. Why aim for just 10% better in ${theme.toLowerCase()} when you can change the game?`,
        author: {
          name: "Sarah Williams",
          avatar: "/placeholder.svg",
          credential: "Founder @ LearnTech | Harvard",
        },
      },
      {
        id: "3",
        text: `Your destiny in ${theme.toLowerCase()} is determined by the choices you make today. Choose wisely.`,
        author: {
          name: "Michael Chen",
          avatar: "/placeholder.svg",
          credential: "Director @ EducateNow | MIT",
        },
      },
    ];
    
    setHooks(mockHooks);
    setSelectedIdea(idea);
    setCurrentStep(CreationStep.HOOK_SELECTION);
    toast.success("Choose a hook or skip to canvas");
  };

  const handleHookSelect = (hook: HookOption) => {
    setSelectedHook(hook);
    // Generate content based on selected idea and hook
    setContent(`${hook.text}\n\nHere's my perspective on ${selectedIdea?.title}:\n\n[Your content will be generated here based on the selected idea and hook]`);
    setCurrentStep(CreationStep.CONTENT_CANVAS);
  };

  const handleSkipHook = () => {
    setContent(`Here's my perspective on ${selectedIdea?.title}:\n\n[Your content will be generated here based on the selected idea]`);
    setCurrentStep(CreationStep.CONTENT_CANVAS);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id) 
        : [...prev, id]
    );
  };

  const handlePublish = (content: string) => {
    setContent(content);
    setShowPublishModal(true);
  };

  const handleSaveDraft = (content: string) => {
    setContent(content);
    toast.success("Draft saved successfully");
  };

  const handleSchedule = (content: string, date?: Date) => {
    setContent(content);
    if (date) {
      toast.success(`Scheduled for publication on ${date.toLocaleDateString()}`);
    } else {
      toast.success("Scheduled for publication");
    }
  };

  return {
    currentStep,
    setCurrentStep,
    showCreationModal,
    setShowCreationModal,
    selectedOption,
    theme,
    categories,
    generatedIdeas,
    selectedIdea,
    hooks,
    selectedHook,
    content,
    showPublishModal,
    setShowPublishModal,
    favorites,
    usageCount,
    maxUsage,
    handleCreateClick,
    handleOptionSelect,
    handleThemeSubmit,
    handleIdeaSelect,
    handleHookSelect,
    handleSkipHook,
    handleToggleFavorite,
    handlePublish,
    handleSaveDraft,
    handleSchedule,
  };
}
