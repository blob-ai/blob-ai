
import React from "react";
import { FaqAccordion } from "./FaqAccordion";

export const Faq = () => {
  return (
    <section className="py-16 bg-black relative">
      {/* Blue gradient glow background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/10 via-indigo-900/5 to-transparent blur-3xl rounded-full w-full h-[600px] mx-auto"></div>
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        
        <FaqAccordion items={[
          {
            question: "What is inspire.me?",
            answer: "inspire.me is an AI-powered platform that helps content creators overcome anxiety by analyzing successful accounts, generating personalized templates, and providing AI-guided content creation."
          },
          {
            question: "How does it work?",
            answer: "Simply sign up, tell us your content goals, and our AI assistant will help you generate ideas, structure your content, and maintain your authentic voice - all while saving you hours of work."
          },
          {
            question: "Which platforms do you support?",
            answer: "We support all major social platforms including Twitter/X, LinkedIn, Instagram, TikTok, YouTube, and Medium. We're constantly adding support for more platforms."
          },
          {
            question: "How much does it cost?",
            answer: "inspire.me offers a free plan to get started. Premium plans with additional features start at $19/month."
          },
          {
            question: "Can I keep my personal writing style?",
            answer: "Absolutely! Our AI adapts to your voice and tone, ensuring all content feels authentically you while still leveraging best practices."
          }
        ]} />
      </div>
    </section>
  );
};
