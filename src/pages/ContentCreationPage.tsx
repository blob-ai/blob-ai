
import React from "react";
import { PageContainer } from "@/components/ui/page-container";
import ContentCreationModal from "@/components/content/ContentCreationModal";
import ThemeSelectionForm from "@/components/content/idea-generation/ThemeSelectionForm";
import IdeasGallery from "@/components/content/idea-generation/IdeasGallery";
import HookSelector from "@/components/content/hooks/HookSelector";
import ContentCanvas from "@/components/content/canvas/ContentCanvas";
import PublishModal from "@/components/content/publish/PublishModal";
import StartStep from "@/components/content/steps/StartStep";
import StepNavigation from "@/components/content/steps/StepNavigation";
import { useContentCreation, CreationStep } from "@/hooks/use-content-creation";
import { toast } from "sonner";

const ContentCreationPage = () => {
  const {
    currentStep,
    setCurrentStep,
    showCreationModal,
    setShowCreationModal,
    generatedIdeas,
    theme,
    categories,
    hooks,
    selectedIdea,
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
    handleSchedule
  } = useContentCreation();

  const handleBack = () => {
    setCurrentStep(prev => Math.max(CreationStep.START, prev - 1));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case CreationStep.START:
        return <StartStep onCreateClick={handleCreateClick} />;
      case CreationStep.THEME_SELECTION:
        return (
          <div className="max-w-xl mx-auto p-6 bg-black border border-white/10 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Generate content ideas</h2>
            <ThemeSelectionForm onSubmit={handleThemeSubmit} />
          </div>
        );
      case CreationStep.IDEAS_GALLERY:
        return (
          <div className="max-w-4xl mx-auto p-6 bg-black border border-white/10 rounded-xl shadow-lg">
            <IdeasGallery
              theme={theme}
              ideas={generatedIdeas}
              onRefresh={() => handleThemeSubmit(theme, categories)}
              onUseIdea={handleIdeaSelect}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
              usageCount={usageCount}
              maxUsage={maxUsage}
            />
          </div>
        );
      case CreationStep.HOOK_SELECTION:
        return (
          <div className="max-w-4xl mx-auto p-6 bg-black border border-white/10 rounded-xl shadow-lg">
            <HookSelector
              hooks={hooks}
              onSelectHook={handleHookSelect}
              onSkip={handleSkipHook}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
            />
          </div>
        );
      case CreationStep.CONTENT_CANVAS:
        return (
          <div className="h-[calc(100vh-64px)] bg-black border border-white/10 rounded-xl shadow-lg overflow-hidden">
            <ContentCanvas
              initialContent={content}
              onPublish={handlePublish}
              onSaveDraft={handleSaveDraft}
              onSchedule={handleSchedule}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer className="py-6">
      <StepNavigation 
        currentStep={currentStep} 
        onBack={handleBack} 
        onStartOver={handleCreateClick} 
      />

      {renderCurrentStep()}

      <ContentCreationModal
        isOpen={showCreationModal}
        onClose={() => setShowCreationModal(false)}
        onOptionSelect={handleOptionSelect}
      />

      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        content={content}
        onPublish={() => {
          toast.success("Post published successfully!");
          setShowPublishModal(false);
          setCurrentStep(CreationStep.START);
        }}
        onConnectPlatform={(platform) => {
          toast.success(`Connected to ${platform}`);
          setTimeout(() => {
            toast.success("Post published successfully!");
            setShowPublishModal(false);
            setCurrentStep(CreationStep.START);
          }, 1000);
        }}
      />
    </PageContainer>
  );
};

export default ContentCreationPage;
