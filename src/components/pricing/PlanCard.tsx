
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlanFeature {
  text: string;
}

interface PlanCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  isCurrentPlan?: boolean;
  onSelectPlan: () => void;
  className?: string;
}

export function PlanCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  isCurrentPlan = false,
  onSelectPlan,
  className,
}: PlanCardProps) {
  return (
    <div className={cn(
      "flex flex-col p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5",
      className
    )}>
      <div className="mb-5">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="flex items-baseline mt-2">
          <span className="text-3xl font-extrabold">{price}</span>
          {period && <span className="ml-1 text-sm text-white/70">{period}</span>}
        </div>
        <p className="mt-3 text-sm text-white/70">{description}</p>
      </div>

      <div className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 h-5 w-5 flex items-center justify-center rounded-full bg-primary-600/20 text-primary-400">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Button
          onClick={onSelectPlan}
          className={cn(
            "w-full", 
            isCurrentPlan 
              ? "bg-white/20 hover:bg-white/30 text-white cursor-default" 
              : "bg-primary-600 hover:bg-primary-500 text-white"
          )}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? "Current Plan" : buttonText}
        </Button>
      </div>
    </div>
  );
}
