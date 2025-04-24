
import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/components/pricing/PlanCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * UpgradePlan Component
 * 
 * Modal component that allows users to upgrade their subscription plan
 * @param onClose - Function to call when closing the modal
 */
export default function UpgradePlan({ onClose }: { onClose: () => void }) {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Plan definitions
  const plans = {
    free: {
      title: "Free",
      price: "$0",
      period: "forever",
      description: "Start creating content with our basic features",
      features: [
        { text: "10 AI chat interactions per day" },
        { text: "Basic content generation (text only)" },
        { text: "5 post analyses per week" },
        { text: "3 basic templates" },
        { text: "No workspace features" }
      ],
      limits: {
        dailyChatLimit: 10,
        dailyAnalysisLimit: 5
      }
    },
    plus: {
      title: "Plus",
      price: "$14.99",
      period: "/month",
      description: "Level up your content with advanced features",
      features: [
        { text: "Extended limits on AI interactions" },
        { text: "Enhanced content generation (all text formats)" },
        { text: "Full template library + custom templates" },
        { text: "Create and manage your projects using our Workspace features" },
        { text: "Priority support" },
        { text: "Early access to new features" }
      ],
      limits: {
        dailyChatLimit: 50,
        dailyAnalysisLimit: 20
      }
    }
  };

  /**
   * Creates a new user profile in the database
   * @param userId - User ID
   * @param planTier - Selected plan tier
   */
  const createUserProfile = async (userId: string, planTier: string) => {
    const planLimits = plans[planTier.toLowerCase() as keyof typeof plans].limits;
    
    const { error: createError } = await supabase
      .from("profiles")
      .insert([
        { 
          id: userId,
          plan_tier: planTier.toLowerCase(),
          daily_chat_count: 0,
          daily_chat_limit: planLimits.dailyChatLimit,
          daily_analysis_count: 0,
          daily_analysis_limit: planLimits.dailyAnalysisLimit,
          total_tokens_used: 0,
          is_onboarded: true
        }
      ]);

    if (createError) {
      console.error("Error creating profile:", createError);
      throw createError;
    }
    
    console.log("Profile created successfully for user:", userId);
  };

  /**
   * Updates an existing user profile with new plan details
   * @param userId - User ID
   * @param planTier - Selected plan tier
   */
  const updateUserProfile = async (userId: string, planTier: string) => {
    const planLimits = plans[planTier.toLowerCase() as keyof typeof plans].limits;
    
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        plan_tier: planTier.toLowerCase(),
        daily_chat_limit: planLimits.dailyChatLimit,
        daily_analysis_limit: planLimits.dailyAnalysisLimit
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw updateError;
    }
    
    console.log("Profile updated successfully for user:", userId);
  };

  /**
   * Handles plan change when user selects a new plan
   * @param planTier - Selected plan tier (free or plus)
   */
  const handlePlanChange = async (planTier: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to change your plan",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      // If profile doesn't exist, create one first
      if (!profile) {
        console.log("No profile found, creating one for user:", user.id);
        await createUserProfile(user.id, planTier);
      } else {
        // Update existing profile
        await updateUserProfile(user.id, planTier);
      }

      // Show success message
      toast({
        title: "Plan Updated",
        description: `Your plan has been updated to ${planTier}`,
      });
      
      // Refresh profile to update UI
      await refreshProfile();
    } catch (error: any) {
      console.error("Error updating plan:", error);
      toast({
        title: "Error",
        description: `Failed to update plan: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const currentPlan = profile?.plan_tier || "free";

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-y-auto p-4">
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-8 p-6">
          <h1 className="text-3xl font-bold text-center">Upgrade your plan</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
            <PlanCard
              title={plans.free.title}
              price={plans.free.price}
              period={plans.free.period}
              description={plans.free.description}
              features={plans.free.features}
              buttonText={isUpdating ? "Updating..." : "Select Free Plan"}
              isCurrentPlan={currentPlan === "free"}
              onSelectPlan={() => handlePlanChange("free")}
            />

            <PlanCard
              title={plans.plus.title}
              price={plans.plus.price}
              period={plans.plus.period}
              description={plans.plus.description}
              features={plans.plus.features}
              buttonText={isUpdating ? "Updating..." : "Upgrade to Plus"}
              isCurrentPlan={currentPlan === "plus"}
              onSelectPlan={() => handlePlanChange("plus")}
              className="border-primary-500/30 bg-primary-600/5"
            />
          </div>

          <div className="mt-8 text-center text-sm text-white/60">
            <p>Need more capabilities for your business?</p>
            <button className="text-primary-400 hover:text-primary-300 font-medium">
              Contact our sales team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
