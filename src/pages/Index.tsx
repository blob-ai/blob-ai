
import React from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { StepSequence } from "@/components/landing/StepSequence";
import { Features } from "@/components/landing/Features";
import { Faq } from "@/components/landing/Faq";
import { Cta } from "@/components/landing/Cta";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />

      <main>
        <Hero />
        
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <StepSequence steps={[
              {
                number: 1,
                title: "Tell us your vision",
                description: "Share your content aspirations in simple conversation."
              },
              {
                number: 2,
                title: "Select proven formats",
                description: "Access data-backed templates optimized for your platform."
              },
              {
                number: 3,
                title: "Refine with AI guidance",
                description: "Our AI enhances your authentic voice with proven engagement tactics."
              },
              {
                number: 4,
                title: "Amplify your impact",
                description: "Post instantly or schedule strategically to maximize reach."
              }
            ]} />
          </div>
        </section>
        
        <Features />
        <Faq />
        <Cta />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
