
import React from "react";
import { FeatureCard } from "./FeatureCard";
import { Lightbulb, PenTool, MessageSquare, Clock } from "lucide-react";

export const Features = () => {
  return (
    <section className="py-16 bg-black/80">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Everything you need to create compelling content
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <FeatureCard 
            icon={<Lightbulb />}
            title="Idea Generator"
            description="Never run out of ideas again. Get trending topics tailored to your audience."
          />
          
          <FeatureCard 
            icon={<PenTool />}
            title="Content Builder"
            description="Create perfectly structured content with proven frameworks that engage."
          />
          
          <FeatureCard 
            icon={<MessageSquare />}
            title="Voice Keeper"
            description="Maintain your authentic voice while leveraging AI assistance."
          />
          
          <FeatureCard 
            icon={<Clock />}
            title="Time Saver"
            description="Publish 3x more content in half the time with streamlined workflows."
          />
        </div>
      </div>
    </section>
  );
};
