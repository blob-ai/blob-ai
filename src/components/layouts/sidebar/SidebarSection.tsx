
import React from 'react';
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  action?: () => void;
}

interface SidebarSectionProps {
  title: string;
  items: SidebarItem[];
  actionItem?: SidebarItem;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, items, actionItem }) => {
  return (
    <div className="mt-8 px-2">
      <div className="px-4 py-2.5 flex justify-between items-center">
        <h3 className="text-xs font-medium text-white/50">
          {title}
        </h3>
        {actionItem && (
          <button
            onClick={actionItem.action}
            className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300"
          >
            {actionItem.icon && (
              <span className="flex-shrink-0">
                {actionItem.icon}
              </span>
            )}
            <span>{actionItem.name}</span>
          </button>
        )}
      </div>
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li key={index}>
            {item.action ? (
              <button
                onClick={item.action}
                className="flex w-full items-center gap-3.5 px-4 py-2.5 rounded-xl transition-colors hover:bg-white/5 text-white/70"
              >
                {item.icon && (
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    {item.icon}
                  </div>
                )}
                {!item.icon && <div className="w-5 h-5 flex-shrink-0" />}
                <span className="truncate text-[15px]">{item.name}</span>
              </button>
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
    </div>
  );
};

export default SidebarSection;
