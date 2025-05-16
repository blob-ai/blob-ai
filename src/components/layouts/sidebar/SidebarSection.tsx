
import React from 'react';
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  id?: string; // Add id for unique identification
  lastMessageAt?: string; // Add lastMessageAt for chat threads
}

interface SidebarSectionProps {
  title: string;
  items: SidebarItem[];
  emptyMessage?: string; // Add emptyMessage prop
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ 
  title, 
  items,
  emptyMessage = "No items available" 
}) => {
  return (
    <div className="mt-8 px-2">
      <div className="px-4 py-2.5">
        <h3 className="text-xs font-medium text-white/50">
          {title}
        </h3>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.id || item.path}>
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
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-4 py-2 text-sm text-white/50 italic">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

export default SidebarSection;
