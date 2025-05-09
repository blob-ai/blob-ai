import React from 'react';
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  name: string;
  path: string;
  icon?: React.ReactNode;
  exact?: boolean;
  hasAction?: boolean;
  action?: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  name,
  path,
  icon,
  exact = false,
  hasAction = false,
  action
}) => {
  return (
    <li className="relative">
      <NavLink
        to={path}
        end={exact}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-colors",
            "hover:bg-white/5",
            isActive
              ? "bg-white/5 text-primary-400 font-medium"
              : "text-white/70"
          )
        }
      >
        {icon}
        <span className="text-[15px]">{name}</span>
      </NavLink>
      
      {hasAction && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={action}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
        >
          <Plus className="h-4.5 w-4.5" />
        </Button>
      )}
    </li>
  );
};

export default SidebarNavItem;
