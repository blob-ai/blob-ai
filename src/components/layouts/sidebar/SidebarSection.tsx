
import React from 'react';
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface SidebarItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface SidebarSectionProps {
  title: string;
  items: SidebarItem[];
  isLoading?: boolean;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, items, isLoading = false }) => {
  return (
    <div className="mt-8 px-2">
      <div className="px-4 py-2.5">
        <h3 className="text-xs font-medium text-white/50">
          {title}
        </h3>
      </div>
      {isLoading ? (
        <div className="px-4 py-2 text-white/50 text-sm">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="px-4 py-2 text-white/50 text-sm">
          No items available
        </div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, index) => (
            <li key={index}>
              {item.onClick ? (
                <div
                  onClick={item.onClick}
                  className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-colors hover:bg-white/5 text-white/70 cursor-pointer"
                >
                  {item.icon || <MessageSquare className="h-4 w-4 text-white/50" />}
                  <span className="truncate text-[15px]">{item.name}</span>
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-colors",
                      "hover:bg-white/5",
                      isActive
                        ? "bg-white/5 text-primary-400"
                        : "text-white/70"
                    )
                  }
                >
                  {item.icon && (
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                      {item.icon}
                    </div>
                  )}
                  {!item.icon && <div className="w-5 h-5 flex-shrink-0" />}
                  <span className="truncate text-[15px]">{item.name}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarSection;
