
import React from "react";
import IdeasGallery, { ContentIdea } from "@/components/content/idea-generation/IdeasGallery";

interface IdeasGalleryStepProps {
  theme: string;
  ideas: ContentIdea[];
  onRefresh: () => void;
  onCombinationSelect: (idea: ContentIdea, hookId: string) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  usageCount: number;
  maxUsage: number;
  isLoading?: boolean;
}

const IdeasGalleryStep: React.FC<IdeasGalleryStepProps> = ({
  theme,
  ideas,
  onRefresh,
  onCombinationSelect,
  onToggleFavorite,
  favorites,
  usageCount,
  maxUsage,
  isLoading = false,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-black border border-white/10 rounded-xl shadow-lg">
      <IdeasGallery
        theme={theme}
        ideas={ideas}
        onRefresh={onRefresh}
        onCombinationSelect={onCombinationSelect}
        onToggleFavorite={onToggleFavorite}
        favorites={favorites}
        usageCount={usageCount}
        maxUsage={maxUsage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default IdeasGalleryStep;
