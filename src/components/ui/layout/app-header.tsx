
import React, { useState } from "react";
import { Bell, LogOut, Menu, User, Settings, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/layouts/SidebarProvider";
import { TextShimmer } from "../text-shimmer";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpgradePlan from "@/pages/UpgradePlan";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { user, profile, signOut } = useAuth();
  const [showUpgradePlan, setShowUpgradePlan] = useState(false);
  const navigate = useNavigate();
  
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 1).toUpperCase() || 'U';
  };
  
  return (
    <>
      <header className={cn(
        "bg-black z-50 w-full sticky top-0", // Removed border-b
        className
      )}>
        <div className="flex items-center justify-between h-16 px-4 w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <h1 className="text-lg font-bold md:hidden">
              <TextShimmer 
                duration={5}
                className="[--base-color:theme(colors.primary.600)] [--base-gradient-color:theme(colors.primary.400)]"
              >
                inspire.me
              </TextShimmer>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-white hover:bg-white/10 rounded-full"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
            </Button>
            
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-white hover:bg-white/10 rounded-full py-2"
                  >
                    <Avatar className="h-8 w-8 bg-primary-600">
                      <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || user?.email || 'User'} />
                      <AvatarFallback className="text-white font-semibold text-sm">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline whitespace-nowrap">
                      {profile?.username || profile?.full_name || user?.email?.split('@')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1A1F2C] border-white/10 text-white">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{profile?.full_name || profile?.username || 'User'}</span>
                      <span className="text-xs text-white/60">{user?.email}</span>
                      <span className="text-xs text-primary-400 mt-1">{profile?.plan_tier === 'plus' ? 'Plus Plan' : 'Free Plan'}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => setShowUpgradePlan(true)}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>Upgrade Plan</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {showUpgradePlan && <UpgradePlan onClose={() => setShowUpgradePlan(false)} />}
    </>
  );
}
