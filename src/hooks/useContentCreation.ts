
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ContentIdea } from "@/components/content/idea-generation/IdeasGallery";
import { categoryColors } from "@/components/content/idea-generation/IdeasGallery";

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
    // Ensure we have a theme default if empty
    const themeText = theme || "general topics";
    
    // This would be an API call in a real application
    const goalPrefix = getGoalPrefix(goal);
    
    // Create mock ideas distributed across different categories
    const mockIdeas: ContentIdea[] = [];
    
    // Use selected categories or default to a standard set
    const categoriesToUse = categories.length > 0 ? categories : [
      "Best practices",
      "Explanation / Analysis",
      "List of advice/rules/etc",
      "Useful resources",
      "Personal reflection",
      "Thought-provoking"
    ];
    
    // Generate 1-2 ideas per category
    categoriesToUse.forEach(category => {
      // Generate titles based on category
      let titleIdeas: string[] = [];
      
      switch(category) {
        case "Best practices":
          titleIdeas = [
            `${goalPrefix}: Top 5 best practices for implementing ${themeText} successfully.`,
            `${goalPrefix}: The DO's and DON'Ts of ${themeText} every professional should know.`
          ];
          break;
        case "Explanation / Analysis":
          titleIdeas = [
            `${goalPrefix}: Why ${themeText} is becoming increasingly important in today's landscape.`,
            `${goalPrefix}: Understanding the hidden mechanics behind ${themeText}.`
          ];
          break;
        case "List of advice/rules/etc":
          titleIdeas = [
            `${goalPrefix}: 10 crucial skills every ${themeText} specialist should develop.`,
            `${goalPrefix}: 7 golden rules for mastering ${themeText} in record time.`
          ];
          break;
        case "Useful resources":
          titleIdeas = [
            `${goalPrefix}: Top 5 platforms offering free resources in ${themeText}.`,
            `${goalPrefix}: The ultimate toolbox for ${themeText} - everything you need in one place.`
          ];
          break;
        case "Personal reflection":
          titleIdeas = [
            `${goalPrefix}: Reflecting on my journey from novice to expert in ${themeText}.`,
            `${goalPrefix}: How embracing ${themeText} changed my professional perspective.`
          ];
          break;
        case "Thought-provoking":
          titleIdeas = [
            `${goalPrefix}: Is the conventional wisdom on ${themeText} actually wrong?`,
            `${goalPrefix}: The uncomfortable truth about ${themeText} nobody talks about.`
          ];
          break;
        case "Company sagas":
          titleIdeas = [
            `${goalPrefix}: How our team transformed our approach to ${themeText} and saw immediate results.`,
            `${goalPrefix}: Behind the scenes: Our ${themeText} strategy that doubled our growth.`
          ];
          break;
        case "Tip":
          titleIdeas = [
            `${goalPrefix}: One simple tip that revolutionized my approach to ${themeText}.`,
            `${goalPrefix}: The 5-minute ${themeText} hack that saved me hours every week.`
          ];
          break;
        case "Striking advice":
          titleIdeas = [
            `${goalPrefix}: Stop doing ${themeText} this way - here's why it's failing you.`,
            `${goalPrefix}: The counterintuitive approach to ${themeText} that actually works.`
          ];
          break;
        default:
          titleIdeas = [
            `${goalPrefix}: A fresh perspective on ${themeText} for today's professionals.`,
            `${goalPrefix}: Everything you need to know about ${themeText} in 2025.`
          ];
      }
      
      // Create one idea per category
      const idea: ContentIdea = {
        id: `${mockIdeas.length + 1}`,
        title: titleIdeas[0], // Use first title
        category: category,
        categoryColor: categoryColors[category] || "bg-gray-100 text-gray-800",
        hooks: [
          {
            id: `h${mockIdeas.length + 1}_1`,
            text: getRandomHook(category, themeText),
            author: {
              name: getRandomName(),
              avatar: "/placeholder.svg",
              credential: getRandomCredential(),
            }
          },
          {
            id: `h${mockIdeas.length + 1}_2`,
            text: getRandomHook(category, themeText),
            author: {
              name: getRandomName(),
              avatar: "/placeholder.svg",
              credential: getRandomCredential(),
            }
          }
        ]
      };
      
      mockIdeas.push(idea);
      
      // Optionally add a second idea for some categories to have variety
      if (Math.random() > 0.5 && titleIdeas.length > 1) {
        const secondIdea: ContentIdea = {
          id: `${mockIdeas.length + 1}`,
          title: titleIdeas[1], // Use second title
          category: category,
          categoryColor: categoryColors[category] || "bg-gray-100 text-gray-800",
          hooks: [
            {
              id: `h${mockIdeas.length + 1}_1`,
              text: getRandomHook(category, themeText),
              author: {
                name: getRandomName(),
                avatar: "/placeholder.svg",
                credential: getRandomCredential(),
              }
            },
            {
              id: `h${mockIdeas.length + 1}_2`,
              text: getRandomHook(category, themeText),
              author: {
                name: getRandomName(),
                avatar: "/placeholder.svg",
                credential: getRandomCredential(),
              }
            }
          ]
        };
        
        mockIdeas.push(secondIdea);
      }
    });
    
    setGeneratedIdeas(mockIdeas);
    setCurrentStep(CreationStep.IDEAS_GALLERY);
    setUsageCount(prev => Math.min(prev + 1, maxUsage));
    toast.success(`Generated ideas for "${theme}" with ${goal} goal`);
  };
  
  // Helper functions for idea generation
  
  const getRandomHook = (category: string, themeText: string): string => {
    const hooks = {
      "Best practices": [
        `Everyone talks about best practices in ${themeText}, but here's what actually moved the needle for me.`,
        `I wasted 3 years following outdated advice on ${themeText}. Here's what actually works in 2025.`,
        `The "best practices" for ${themeText} that nobody questions but should.`
      ],
      "Explanation / Analysis": [
        `I analyzed 100+ cases of ${themeText} implementation. Here's the pattern nobody's talking about.`,
        `The most successful people in ${themeText} aren't doing what you think. Here's the real strategy.`,
        `I've spent 5 years researching ${themeText}. The conventional wisdom is completely wrong.`
      ],
      "List of advice/rules/etc": [
        `I built a 7-figure business applying these exact ${themeText} principles.`,
        `After interviewing 50+ experts on ${themeText}, these are the key insights they all shared.`,
        `My 10-minute daily ${themeText} routine that transformed my results completely.`
      ],
      "default": [
        `The biggest myth about ${themeText} I wish I'd known earlier.`,
        `What I wish someone told me when I started with ${themeText}.`,
        `The counterintuitive approach to ${themeText} that changed everything for me.`
      ]
    };
    
    const categoryHooks = hooks[category as keyof typeof hooks] || hooks["default"];
    return categoryHooks[Math.floor(Math.random() * categoryHooks.length)];
  };
  
  const getRandomName = (): string => {
    const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Avery", "Cameron", "Dakota"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  };
  
  const getRandomCredential = (): string => {
    const positions = ["Founder @", "CEO @", "Director @", "Lead @", "Prev @", "Head of", "Specialist @"];
    const companies = ["TechGrowth", "InnovateCo", "NextLevel", "FutureScale", "PeakPerform", "EliteStrategy", "OptimizeNow"];
    
    // Randomly add educational credential
    const education = Math.random() > 0.5 ? " | " + ["Harvard", "Stanford", "MIT", "Oxford", "Cambridge", "Yale"][Math.floor(Math.random() * 6)] : "";
    
    return `${positions[Math.floor(Math.random() * positions.length)]} ${companies[Math.floor(Math.random() * companies.length)]}${education}`;
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
      case "personal":
        return "Share";
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
