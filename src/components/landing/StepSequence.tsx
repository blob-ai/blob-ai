
import { ReactNode } from "react";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepSequenceProps {
  steps: Step[];
}

export const StepSequence = ({ steps }: StepSequenceProps) => {
  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600/0 via-blue-600/50 to-blue-600/0 hidden md:block"></div>
      
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-900/30 group-hover:scale-110 transition-transform">
              {step.number}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{step.title}</h3>
            <p className="text-white/70 text-sm max-w-[200px]">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
