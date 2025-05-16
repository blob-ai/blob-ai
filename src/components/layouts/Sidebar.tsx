
import React, { useEffect, useState } from "react";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookmarkIcon,
  Users,
  Plus
} from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { supabase } from "@/integrations/supabase/client";

// Import refactored sidebar components
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavItem from "./sidebar/SidebarNavItem";
import SidebarSection from "./sidebar/SidebarSection";
import SidebarFooter from "./sidebar/SidebarFooter";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const { isSidebarOpen } = useSidebar();
  const { threads, loadThreads, createThread } = useChat();

  // Load threads when component mounts
  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  // Format threads for sidebar display
  const recentChats = threads.map(thread => ({
    id: thread.id,
    name: thread.title,
    path: `/dashboard/chat/${thread.id}`,
    lastMessageAt: thread.lastMessageAt
  }));

  // Main navigation items
  const navItems = [
    {
      name: "AI Chat",
      path: "/dashboard/chat",
      icon: <MessageSquare className="h-6 w-6" />,
      exact: false,
      hasAction: true,
      action: async () => {
        const threadId = await createThread();
        window.location.href = `/dashboard/chat/${threadId}`;
      }
    },
    {
      name: "Dashboard",
      path: "/dashboard/dashboard",
      icon: <LayoutDashboard className="h-6 w-6" />,
      exact: true,
      hasAction: false
    },
    {
      name: "Library",
      path: "/dashboard/library",
      icon: <BookmarkIcon className="h-6 w-6" />,
      exact: true,
      hasAction: false
    }
  ];

  // Your workspaces data
  const workspaces = [
    { name: "Personal X Account", path: "/dashboard/workspace/personal-x", icon: <Users className="h-5 w-5 text-primary-400" /> },
    { name: "Web3 Posts", path: "/dashboard/workspace/web3", icon: <Users className="h-5 w-5 text-primary-400" /> }
  ];

  const handleNewChat = async () => {
    const threadId = await createThread();
    window.location.href = `/dashboard/chat/${threadId}`;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-black z-30 transition-all duration-300 ease-in-out overflow-hidden",
        isSidebarOpen ? "w-72" : "w-0"
      )}
    >
      {isSidebarOpen && (
        <div className="flex flex-col h-full">
          <SidebarHeader />

          <nav className="flex-1 overflow-y-auto py-5">
            <ul className="space-y-1.5 px-3">
              {navItems.map((item) => (
                <SidebarNavItem 
                  key={item.path}
                  name={item.name}
                  path={item.path}
                  icon={item.icon}
                  exact={item.exact}
                  hasAction={item.hasAction}
                  action={item.action}
                />
              ))}
            </ul>

            {/* Workspaces Section */}
            <SidebarSection title="Your workspaces" items={workspaces} />

            {/* Recent Chats Section with Create New Chat button */}
            <div className="mt-8 px-2">
              <div className="px-4 py-2.5 flex justify-between items-center">
                <h3 className="text-xs font-medium text-white/50">
                  Recent chats
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-white/50 hover:text-white hover:bg-white/10"
                  onClick={handleNewChat}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {recentChats.length > 0 ? (
                <ul className="space-y-1.5">
                  {recentChats.map((thread) => (
                    <li key={thread.id}>
                      <NavLink
                        to={thread.path}
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
                        <MessageSquare className="h-4 w-4 text-white/50" />
                        <span className="truncate text-[15px]">{thread.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-sm text-white/50 italic">
                  No recent chats
                </div>
              )}
            </div>
          </nav>

          <SidebarFooter />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
