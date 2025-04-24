
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RainbowButton } from "../ui/rainbow-button";

export const Cta = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 bg-black relative">
      {/* Blue gradient glow background */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-indigo-900/15 to-transparent blur-3xl"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-10 max-w-3xl mx-auto shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
            Transform your content creation today
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
            Join thousands of creators who save 10+ hours weekly
          </p>
          
          <RainbowButton 
            onClick={() => navigate('/dashboard')}
          >
            <span className="relative z-10">Start creating</span>
            <ArrowRight className="ml-2 h-5 w-5 relative z-10" />
          </RainbowButton>
          <p className="mt-4 mb-2 text-sm text-white/60">
            No credit card required to start
          </p>
        </div>
      </div>
    </section>
  );
};
