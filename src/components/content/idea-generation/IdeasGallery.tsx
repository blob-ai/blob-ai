
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart } from "lucide-react";

export interface ContentIdea {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
}

interface IdeasGalleryProps {
  theme: string;
  ideas: ContentIdea[];
  onRefresh: () => void;
  onUseIdea: (idea: ContentIdea) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  usageCount: number;
  maxUsage: number;
}

const IdeasGallery: React.FC<IdeasGalleryProps> = ({
  theme,
  ideas,
  onRefresh,
  onUseIdea,
  onToggleFavorite,
  favorites,
  usageCount,
  maxUsage,
}) => {
  // Function to get category-based color
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      "Best practices": "bg-orange-100 text-orange-800",
      "Explanation / Analysis": "bg-green-100 text-green-800",
      "List of advice/rules/etc": "bg-purple-100 text-purple-800",
      "Striking advice": "bg-blue-100 text-blue-800",
      "Useful resources": "bg-sky-100 text-sky-800",
      "Personal reflection": "bg-pink-100 text-pink-800",
      "Thought-provoking": "bg-indigo-100 text-indigo-800",
      "Company sagas": "bg-gray-100 text-gray-800",
      "Tip": "bg-amber-100 text-amber-800",
      "Rant": "bg-red-100 text-red-800",
    };
    
    return colors[category] || "bg-gray-100 text-gray-800";
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => (
          <div key={idea.id} className="border border-white/10 rounded-xl overflow-hidden bg-black">
            <div className={`p-4 min-h-[120px] flex flex-col ${idea.categoryColor}`}>
              <h3 className="font-medium text-base mb-auto">{idea.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm opacity-80">{idea.category}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleFavorite(idea.id)}
                  className="h-8 w-8 rounded-full hover:bg-black/10"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(idea.id) ? "fill-current text-red-500" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>
            <div className="p-3 border-t border-white/10 bg-black">
              <Button
                variant="outline"
                onClick={() => onUseIdea(idea)}
                className="w-full bg-transparent border border-white/20 hover:bg-white/5"
                size="sm"
              >
                Use
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeasGallery;
