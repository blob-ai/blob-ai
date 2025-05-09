
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ContentIdea } from "@/types/content";
import { getCategoryColors } from "@/utils/categoryColors";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getContentGoals, 
  getContentCategoriesByGoal, 
  getContentIdeasByThemeAndCategories, 
  saveUserContent,
  updateUserContent,
  getUserUsage,
  incrementUsageCounter
} from "@/services/contentService";

export enum CreationStep {
  START,
  THEME_SELECTION,
  IDEAS_GALLERY,
  CONTENT_CANVAS,
  PUBLISH,
}

export const useContentCreation = () => {
  // Auth state
  const { user, isAuthenticated } = useAuth();
  
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
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Usage tracking
  const [usageCount, setUsageCount] = useState(0);
  const [maxUsage, setMaxUsage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Load usage data when the component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUsageData();
    }
  }, [isAuthenticated, user]);

  const loadUsageData = async () => {
    try {
      const usageData = await getUserUsage();
      if (usageData) {
        setUsageCount(usageData.content_generations_used);
        setMaxUsage(usageData.content_generations_limit);
      }
    } catch (error) {
      console.error("Error loading usage data:", error);
    }
  };

  // Function to generate ideas based on theme, categories, and goal
  const generateIdeas = async (theme: string, categories: string[], goal: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to generate content ideas");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if user has reached usage limit
      const usageData = await getUserUsage();
      if (usageData && usageData.content_generations_used >= usageData.content_generations_limit) {
        toast.error(`You've reached your daily limit of ${usageData.content_generations_limit} idea generations`);
        setIsLoading(false);
        return;
      }
      
      // Get ideas from the backend
      const ideas = await getContentIdeasByThemeAndCategories(theme, categories, goal);
      
      // If we have ideas, increment the usage counter
      if (ideas && ideas.length > 0) {
        setGeneratedIdeas(ideas);
        
        // Update the usage count
        if (user) {
          const updatedUsage = await incrementUsageCounter(user.id);
          setUsageCount(updatedUsage.content_generations_used);
        }
        
        setCurrentStep(CreationStep.IDEAS_GALLERY);
        toast.success(`Generated ideas for "${theme}" with ${goal} goal`);
      } else {
        toast.error("No ideas found for the selected criteria");
      }
    } catch (error) {
      console.error("Error generating ideas:", error);
      toast.error("Failed to generate ideas. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeSubmit = async (theme: string, categories: string[], goal: string = "knowledge") => {
    setTheme(theme);
    setCategories(categories);
    setContentGoal(goal);
    await generateIdeas(theme, categories, goal);
  };

  const handleCombinationSelect = async (idea: ContentIdea, hookId: string) => {
    const selectedHook = idea.hooks?.find(hook => hook.id === hookId);
    
    setSelectedIdea(idea);
    
    try {
      let initialContent = "";
      
      if (selectedHook) {
        // Generate content based on selected idea and hook
        initialContent = `${selectedHook.text}\n\nHere's my perspective on ${idea.title}:\n\n[Your content will be generated here based on the selected idea and hook]`;
      } else {
        // Just use the idea without a hook
        initialContent = `Here's my perspective on ${idea.title}:\n\n[Your content will be generated here based on the selected idea]`;
      }
      
      setContent(initialContent);
      
      // Save draft to database
      if (user) {
        const savedContent = await saveUserContent({
          user_id: user.id,
          title: idea.title,
          content: initialContent,
          theme,
          goal_id: contentGoal,
          idea_id: idea.id,
          hook_id: hookId || null,
          status: 'draft'
        });
        
        setCurrentContentId(savedContent.id);
      }
      
      setCurrentStep(CreationStep.CONTENT_CANVAS);
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content. Please try again.");
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

  const handlePublish = async (content: string) => {
    setContent(content);
    
    try {
      // Update content in database if we have a content ID
      if (currentContentId) {
        await updateUserContent(currentContentId, { content });
      }
      // If no content ID, create a new one
      else if (user) {
        const savedContent = await saveUserContent({
          user_id: user.id,
          title: selectedIdea?.title || "New Content",
          content,
          theme,
          goal_id: contentGoal,
          idea_id: selectedIdea?.id,
          status: 'draft'
        });
        
        setCurrentContentId(savedContent.id);
      }
      
      setShowPublishModal(true);
    } catch (error) {
      console.error("Error updating content:", error);
      toast.error("Failed to save content. Please try again.");
    }
  };

  const handleSaveDraft = async (content: string) => {
    setContent(content);
    
    try {
      // Update content in database if we have a content ID
      if (currentContentId) {
        await updateUserContent(currentContentId, { content });
      }
      // If no content ID, create a new one
      else if (user) {
        const savedContent = await saveUserContent({
          user_id: user.id,
          title: selectedIdea?.title || "New Content",
          content,
          theme,
          goal_id: contentGoal,
          idea_id: selectedIdea?.id,
          status: 'draft'
        });
        
        setCurrentContentId(savedContent.id);
      }
      
      toast.success("Draft saved successfully");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft. Please try again.");
    }
  };

  const handleSchedule = async (content: string, date: Date) => {
    setContent(content);
    
    try {
      // Update content in database if we have a content ID
      if (currentContentId) {
        await updateUserContent(currentContentId, { 
          content, 
          status: 'scheduled', 
          published_at: date.toISOString()
        });
      }
      // If no content ID, create a new one
      else if (user) {
        const savedContent = await saveUserContent({
          user_id: user.id,
          title: selectedIdea?.title || "New Content",
          content,
          theme,
          goal_id: contentGoal,
          idea_id: selectedIdea?.id,
          status: 'scheduled',
          published_at: date.toISOString()
        });
        
        setCurrentContentId(savedContent.id);
      }
      
      toast.success(`Scheduled for publication on ${date.toLocaleDateString()}`);
    } catch (error) {
      console.error("Error scheduling content:", error);
      toast.error("Failed to schedule content. Please try again.");
    }
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
    isLoading,
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
    setShowPublishModal,
    isAuthenticated,
  };
};
