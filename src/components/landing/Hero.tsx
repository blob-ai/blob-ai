
import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { HeroChat } from "./HeroChat";
import { RainbowButton } from "../ui/rainbow-button";

// Custom X logo component for better accuracy
const XLogo = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    aria-hidden="true" 
    className={className}
    fill="currentColor"
  >
    <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7254 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.87886 5.03974H8.00029L11.9769 10.728L12.5962 11.6137L17.7652 19.0075H15.6438L11.4257 12.9742V12.9738Z" />
  </svg>
);

export const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Blue gradient glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 blur-3xl opacity-30 rounded-full -translate-y-1/2 w-[800px] h-[800px] mx-auto"></div>
      
      <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
        <div className="w-16 h-16 mb-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center animate-rainbow-soft shadow-lg shadow-blue-500/20">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>
        
        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
          Overcome your content creation anxiety
        </h1>
        <p className={`text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
          Analyze viral posts, craft your style and grow your brand
        </p>
        
        <div className={`flex flex-wrap justify-center gap-2 max-w-3xl mx-auto mb-12 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.15s'}}>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/90">Easy-to-use LLM assistant</span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/90">AI-powered content analysis</span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/90">Multi-platform optimization</span>
        </div>
        
        <div className="flex justify-center space-x-4 mb-12">
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/70">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
            </svg>
          </a>
          <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
            <XLogo className="w-5 h-5 text-white/70" />
          </a>
        </div>

        {/* CTA Button above chat */}
        <div className={`mb-16 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
          <RainbowButton onClick={() => window.location.href = '/dashboard'}>
            Try inspire.me for free
          </RainbowButton>
        </div>
        
        {/* Chat Interface with enhanced glow effect */}
        <div className={`w-full max-w-2xl mx-auto relative ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.25s'}}>
          {/* Brighter blue glow effect behind chat */}
          <div className="absolute inset-0 bg-blue-500/40 blur-2xl rounded-3xl transform scale-105"></div>
          <div className="relative">
            <HeroChat />
          </div>
        </div>
      </div>
    </section>
  );
};
