import React, { useState } from 'react';
import { CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UpgradePlan from "@/pages/UpgradePlan";

const SidebarFooter: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [showUpgradePlan, setShowUpgradePlan] = useState(false);

  return (
    <>
      <div className="mt-auto">
        <div className="p-5">
          <Button 
            variant="outline"
            onClick={() => setShowUpgradePlan(true)}
            className="w-full flex items-center justify-between gap-2 border-white/10 hover:bg-white/5 rounded-xl py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="h-4.5 w-4.5 text-primary-400" />
              <span className="text-[15px] font-medium">
                {profile?.plan_tier === 'plus' ? 'Plus Plan' : 'Free Plan'}
              </span>
            </div>
            <span className="text-sm bg-primary-600/20 text-primary-400 px-2.5 py-0.5 rounded-full">
              Upgrade
            </span>
          </Button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3.5 p-2.5 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-semibold text-base">
                {profile?.username?.substring(0, 1).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-medium text-white truncate">
                {profile?.username || profile?.full_name || 'Content Creator'}
              </p>
              <p className="text-sm text-white/70">
                {profile?.plan_tier === 'plus' ? 'Plus Plan' : 'Free Plan'}
              </p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-center gap-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-xl py-3"
            onClick={signOut}
          >
            <LogOut className="h-4.5 w-4.5" />
            <span className="text-[15px]">Log Out</span>
          </Button>
        </div>
      </div>

      {showUpgradePlan && <UpgradePlan onClose={() => setShowUpgradePlan(false)} />}
    </>
  );
};

export default SidebarFooter;
