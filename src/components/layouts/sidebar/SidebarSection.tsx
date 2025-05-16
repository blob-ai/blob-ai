import React from 'react';
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

interface SidebarSectionProps {
  title: string;
  items: SidebarItem[];
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, items }) => {
  return (
    <div className="mt-8 px-2">
      <div className="px-4 py-2.5">
        <h3 className="text-xs font-medium text-white/50">
          {title}
        </h3>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li key={index}>
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
    </div>
  );
};

export default SidebarSection;
