
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LightbulbIcon, Plus } from "lucide-react";
import LibraryCreateStyle from "./LibraryCreateStyle";
import StyleCard from "./StyleCard";
import { CardContainer } from "../ui/card-container";

const LibraryMyStyles = () => {
  const [isCreatingStyle, setIsCreatingStyle] = useState(false);
  const [styles, setStyles] = useState<any[]>([]);
  
  if (isCreatingStyle) {
    return <LibraryCreateStyle onBack={() => setIsCreatingStyle(false)} />;
  }
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Onboarding context banner */}
      <CardContainer className="mb-5 p-5 bg-gradient-to-r from-[#1E253B] to-[#1A202C] border-white/5">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center">
            <LightbulbIcon className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-medium mb-1 text-white">Start your own content style</h2>
            <p className="text-white/80 mb-4">
              Create personalized styles to simplify your future content creation
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-[#151A24] border border-white/5 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-white">Try creating a style for:</h3>
                <ul className="space-y-1.5">
                  <li className="flex items-center text-blue-400">
                    <span className="mr-2">•</span>
                    Educational Explanations
                  </li>
                  <li className="flex items-center text-blue-400">
                    <span className="mr-2">•</span>
                    Humorous Replies
                  </li>
                  <li className="flex items-center text-blue-400">
                    <span className="mr-2">•</span>
                    Crypto Thought Leadership
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#151A24] border border-white/5 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-white">Or template for:</h3>
                <ul className="space-y-1.5">
                  <li className="flex items-center text-emerald-400">
                    <span className="mr-2">•</span>
                    Educational Threads
                  </li>
                  <li className="flex items-center text-emerald-400">
                    <span className="mr-2">•</span>
                    LinkedIn Job Posts
                  </li>
                  <li className="flex items-center text-emerald-400">
                    <span className="mr-2">•</span>
                    Startup Hiring Announcements
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContainer>
      
      {/* Create Button */}
      <Button 
        className="mx-auto mb-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 h-auto rounded-xl shadow-lg"
        onClick={() => setIsCreatingStyle(true)}
      >
        <Plus className="h-5 w-5 mr-2" />
        Create your own style
      </Button>
      
      {/* Styles List */}
      {styles.length > 0 ? (
        <ScrollArea className="flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {styles.map((style, index) => (
              <StyleCard key={index} style={style} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 text-white/50">
          <p className="mb-2">You haven't created any styles yet</p>
          <p className="text-sm">Create your first style to get started</p>
        </div>
      )}
    </div>
  );
};

export default LibraryMyStyles;
