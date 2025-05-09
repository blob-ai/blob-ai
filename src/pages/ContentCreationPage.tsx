
import React from "react";
import { PageContainer } from "@/components/ui/page-container";
import ContentCreationModal from "@/components/content/ContentCreationModal";
import PublishModal from "@/components/content/publish/PublishModal";
import { toast } from "sonner";
import { useContentCreation, CreationStep } from "@/hooks/useContentCreation";
import { AuthProvider } from "@/contexts/AuthContext";

// Step components
import StartStep from "@/components/content/steps/StartStep";
import ThemeSelectionStep from "@/components/content/steps/ThemeSelectionStep";
import IdeasGalleryStep from "@/components/content/steps/IdeasGalleryStep";
import CanvasStep from "@/components/content/steps/CanvasStep";
import BackNavigation from "@/components/content/steps/BackNavigation";
import AuthRequired from "@/components/auth/AuthRequired";

const ContentCreationPageContent = () => {
  const {
    currentStep,
    showCreationModal,
    theme,
    contentGoal,
    generatedIdeas,
    content,
    showPublishModal,
    favorites,
    usageCount,
    maxUsage,
    isLoading,
    selectedIdea,
    setShowCreationModal,
    setFavorites,
    handleThemeSubmit,
    handleCombinationSelect,
    handleOptionSelect,
    handlePublish,
    handleSaveDraft,
    handleSchedule,
    navigateToStep,
    setShowPublishModal
  } = useContentCreation();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case CreationStep.START:
        return <StartStep onCreateClick={() => setShowCreationModal(true)} />;
        
      case CreationStep.THEME_SELECTION:
        return <ThemeSelectionStep onSubmit={handleThemeSubmit} />;
        
      case CreationStep.IDEAS_GALLERY:
        return (
          <IdeasGalleryStep
            theme={theme}
            ideas={generatedIdeas}
            onRefresh={() => handleThemeSubmit(theme, [], contentGoal)}
            onCombinationSelect={handleCombinationSelect}
            onToggleFavorite={(id) => 
              setFavorites(prev => 
                prev.includes(id) 
                  ? prev.filter(fav => fav !== id) 
                  : [...prev, id]
              )
            }
            favorites={favorites}
            usageCount={usageCount}
            maxUsage={maxUsage}
            isLoading={isLoading}
          />
        );
        
      case CreationStep.CONTENT_CANVAS:
        return (
          <CanvasStep
            initialContent={content}
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
            onSchedule={handleSchedule}
            contentGoal={contentGoal}
            selectedIdea={selectedIdea}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <PageContainer className="py-6">
      <BackNavigation 
        currentStep={currentStep} 
        onBack={navigateToStep}
        onStartOver={() => setShowCreationModal(true)}
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
          navigateToStep(CreationStep.START);
        }}
        onConnectPlatform={(platform) => {
          toast.success(`Connected to ${platform}`);
          setTimeout(() => {
            toast.success("Post published successfully!");
            setShowPublishModal(false);
            navigateToStep(CreationStep.START);
          }, 1000);
        }}
      />
    </PageContainer>
  );
};

const ContentCreationPage = () => {
  return (
    <AuthProvider>
      <AuthRequired>
        <ContentCreationPageContent />
      </AuthRequired>
    </AuthProvider>
  );
};

export default ContentCreationPage;
