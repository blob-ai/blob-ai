
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart, ChevronDown, ChevronUp, X } from "lucide-react";
import { HookOption } from "../hooks/HookSelector";
import { getCategoryColors } from "@/utils/categoryColors";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";

export interface ContentIdea {
  id: string;
  title: string;
  category: string;
  categoryColor?: string; // This can be deprecated as we'll use our utility now
  hooks?: HookOption[];
}

interface IdeasGalleryProps {
  theme: string;
  ideas: ContentIdea[];
  onRefresh: () => void;
  onCombinationSelect: (idea: ContentIdea, hookId: string) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  usageCount: number;
  maxUsage: number;
  selectedCategories?: string[]; // Add this prop
}

const IdeasGallery: React.FC<IdeasGalleryProps> = ({
  theme,
  ideas,
  onRefresh,
  onCombinationSelect,
  onToggleFavorite,
  favorites,
  usageCount,
  maxUsage,
  selectedCategories,
}) => {
  const [previewContent, setPreviewContent] = useState<{ideaId: string, hookId: string} | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategoryExpand = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category) 
        : [...prev, category]
    );
  };

  const handlePreview = (ideaId: string, hookId: string) => {
    setPreviewContent({ideaId, hookId});
  };

  const handleClosePreview = () => {
    setPreviewContent(null);
  };

  const getIdeaById = (ideaId: string) => {
    return ideas.find(idea => idea.id === ideaId);
  };

  const getHookById = (idea: ContentIdea | undefined, hookId: string) => {
    return idea?.hooks?.find(hook => hook.id === hookId);
  };

  // Group ideas by category
  const groupedIdeas = ideas.reduce<{ [key: string]: ContentIdea[] }>((acc, idea) => {
    if (!acc[idea.category]) {
      acc[idea.category] = [];
    }
    acc[idea.category].push(idea);
    return acc;
  }, {});

  // Sort categories alphabetically
  let sortedCategories = Object.keys(groupedIdeas).sort();
  
  // Filter categories if selectedCategories is provided
  if (selectedCategories && selectedCategories.length > 0) {
    sortedCategories = sortedCategories.filter(category => 
      selectedCategories.includes(category)
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Ideas generator</h2>
          <p className="text-white/70">Choose a theme and generate post ideas.</p>
        </div>
        <div className="bg-purple-100/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
          {usageCount}/{maxUsage} Free launches
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex-1">
            <span className="text-white/50 text-sm">Theme</span>
            <div className="font-semibold">{theme}</div>
          </div>
        </div>
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          className="min-w-10 h-10 p-0 border-white/10 bg-white/5"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Preview Modal */}
      {previewContent && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-black border border-white/10 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="border-b border-white/10 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Content Preview</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClosePreview}
                className="text-white/70 hover:text-white rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6">
              {(() => {
                const idea = getIdeaById(previewContent.ideaId);
                const hook = getHookById(idea, previewContent.hookId);
                return (
                  <div className="space-y-4">
                    {hook && (
                      <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700">
                            <img 
                              src={hook.author.avatar} 
                              alt={hook.author.name} 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{hook.author.name}</div>
                            <div className="text-xs text-white/60">{hook.author.credential}</div>
                          </div>
                        </div>
                        <p className="text-sm text-white/90">{hook.text}</p>
                      </div>
                    )}
                    {idea && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Content outline</h4>
                        <div className="border border-white/10 rounded-lg p-4">
                          <p className="text-sm text-white/80">
                            Here's my perspective on {idea.title}
                            <br /><br />
                            [Your content will be generated here based on the selected idea and hook]
                          </p>
                        </div>
                      </div>
                    )}
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-500 mt-4"
                      onClick={() => {
                        onCombinationSelect(
                          getIdeaById(previewContent.ideaId)!, 
                          previewContent.hookId
                        );
                        handleClosePreview();
                      }}
                    >
                      Use this combination
                    </Button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {sortedCategories.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white/70">No ideas found for the selected categories. Try refreshing or selecting different categories.</p>
            <Button 
              onClick={onRefresh}
              variant="outline" 
              className="mt-4 border-white/10 bg-white/5"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Ideas
            </Button>
          </div>
        ) : (
          sortedCategories.map((category) => {
            const categoryColors = getCategoryColors(category);
            const isExpanded = expandedCategories.includes(category);
            
            return (
              <Collapsible 
                key={category} 
                open={isExpanded} 
                onOpenChange={() => toggleCategoryExpand(category)}
                className="border border-white/10 rounded-xl overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-between p-4 ${categoryColors.bg} ${categoryColors.text} hover:${categoryColors.bg} hover:brightness-95`}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{category}</span>
                      <Badge variant="outline" className={`ml-2 ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border}`}>
                        {groupedIdeas[category].length}
                      </Badge>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="bg-black p-2 space-y-4">
                  {groupedIdeas[category].map((idea) => (
                    <div 
                      key={idea.id} 
                      className="border border-white/10 rounded-xl overflow-hidden bg-black"
                    >
                      {/* Idea Header - Always visible */}
                      <div className={`p-4 min-h-[80px] relative ${categoryColors.bg} ${categoryColors.text}`}>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-base pr-8">{idea.title}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleFavorite(idea.id)}
                            className="h-8 w-8 rounded-full hover:bg-black/10 flex-shrink-0 ml-2"
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                favorites.includes(idea.id) ? "fill-current text-red-500" : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Hooks Section - Always visible */}
                      <div className="p-4 border-t border-white/10 bg-black/20">
                        <h4 className="text-sm font-medium text-white/70 mb-3">Choose a hook or use the idea directly</h4>
                        <div className="space-y-3">
                          {idea.hooks && idea.hooks.map((hook) => (
                            <div 
                              key={hook.id} 
                              className="border border-white/10 rounded-lg p-3 hover:bg-white/5 transition-colors"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700">
                                  <img 
                                    src={hook.author.avatar} 
                                    alt={hook.author.name} 
                                    className="h-full w-full object-cover" 
                                  />
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{hook.author.name}</div>
                                  <div className="text-xs text-white/60">{hook.author.credential}</div>
                                </div>
                              </div>
                              <p className="text-sm text-white/80 mb-3">{hook.text}</p>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs border-white/10 hover:bg-white/5"
                                  onClick={() => handlePreview(idea.id, hook.id)}
                                >
                                  Preview
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="text-xs bg-blue-600 hover:bg-blue-500"
                                  onClick={() => onCombinationSelect(idea, hook.id)}
                                >
                                  Use this hook
                                </Button>
                              </div>
                            </div>
                          ))}
                          <div className="border-t border-white/10 pt-3 mt-4">
                            <Button
                              variant="outline"
                              className="w-full border-white/10 hover:bg-white/5"
                              onClick={() => onCombinationSelect(idea, "")}
                            >
                              Use idea without a hook
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })
        )}
      </div>
    </div>
  );
};

export default IdeasGallery;
