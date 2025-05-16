
import React, { useEffect } from "react";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Users,
  BookmarkIcon,
  PanelLeftClose
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import refactored sidebar components
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavItem from "./sidebar/SidebarNavItem";
import SidebarSection from "./sidebar/SidebarSection";
import SidebarFooter from "./sidebar/SidebarFooter";
import { useChatHistory } from "@/hooks/use-chat-history";

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { threads, loadThreads, isLoadingThreads, selectThread } = useChatHistory();

  // Load the threads when the component mounts
  useEffect(() => {
    loadThreads(5); // Load initial 5 threads
  }, [loadThreads]);

  // Main navigation items - renamed Library and changed icon
  const navItems = [
    {
      name: "AI Chat",
      path: "/dashboard/chat",
      icon: <MessageSquare className="h-6 w-6" />,
      exact: false,
      hasAction: true,
      action: () => navigate('/dashboard/chat')
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

  // Convert chat threads to the format expected by SidebarSection
  const recentChats = threads.map(thread => ({
    name: thread.title,
    path: `/dashboard/chat/${thread.id}`,
    onClick: () => selectThread(thread)
  }));

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

            {/* Recent Chats Section - Now uses actual chat threads */}
            <SidebarSection 
              title="Recent chats" 
              items={recentChats} 
              isLoading={isLoadingThreads}
            />
          </nav>

          <SidebarFooter />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
