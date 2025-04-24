
import React from "react";
import { cn } from "@/lib/utils";

interface PlanSelectorProps {
  plans: string[];
  selectedPlan: string;
  onPlanChange: (plan: string) => void;
  className?: string;
}

export function PlanSelector({ 
  plans, 
  selectedPlan, 
  onPlanChange,
  className 
}: PlanSelectorProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="flex p-1 rounded-full bg-white/10 backdrop-blur-sm">
        {plans.map((plan) => (
          <button
            key={plan}
            onClick={() => onPlanChange(plan)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-full transition-colors",
              selectedPlan === plan
                ? "bg-white/20 text-white"
                : "text-white/70 hover:text-white hover:bg-white/5"
            )}
          >
            {plan}
          </button>
        ))}
      </div>
    </div>
  );
}
