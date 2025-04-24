
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:border-primary-500/30 hover:shadow-lg hover:scale-[1.02]">
      <div className="w-12 h-12 rounded-full bg-primary-600/20 text-primary-400 flex items-center justify-center mb-4 group-hover:bg-primary-600/30 transition-all group-hover:scale-110 group-hover:rotate-3 duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">{title}</h3>
      <p className="text-white/70 group-hover:text-white/90 transition-colors">{description}</p>
    </div>
  );
};
