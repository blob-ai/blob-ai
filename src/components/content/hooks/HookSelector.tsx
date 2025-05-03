
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export interface HookOption {
  id: string;
  text: string;
  author: {
    name: string;
    avatar: string;
    credential: string;
  };
}

interface HookSelectorProps {
  hooks: HookOption[];
  onSelectHook: (hook: HookOption) => void;
  onSkip: () => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
}

const HookSelector: React.FC<HookSelectorProps> = ({
  hooks,
  onSelectHook,
  onSkip,
  onToggleFavorite,
  favorites,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Choose hook to generate post</h2>
        <p className="text-white/70">Select a hook or skip to write your own.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hooks.map((hook) => (
          <div key={hook.id} className="border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700">
                  <img 
                    src={hook.author.avatar} 
                    alt={hook.author.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{hook.author.name}</div>
                  <div className="text-xs text-white/60">{hook.author.credential}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleFavorite(hook.id)}
                  className="h-8 w-8 rounded-full ml-auto"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(hook.id) ? "fill-current text-red-500" : ""
                    }`}
                  />
                </Button>
              </div>
              
              <p className="text-sm line-clamp-3">{hook.text}</p>
            </div>
            <div className="p-3 border-t border-white/10 bg-black/30">
              <Button
                variant="default"
                onClick={() => onSelectHook(hook)}
                className="w-full bg-blue-600 hover:bg-blue-500"
                size="sm"
              >
                Select Hook
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button 
        variant="ghost" 
        onClick={onSkip}
        className="mx-auto block text-white/60 hover:text-white"
      >
        Skip hooks and proceed to canvas
      </Button>
    </div>
  );
};

export default HookSelector;
