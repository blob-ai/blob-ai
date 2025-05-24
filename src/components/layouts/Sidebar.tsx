
import React from "react";
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
import { useParams, useNavigate } from "react-router-dom";

// Import refactored sidebar components
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavItem from "./sidebar/SidebarNavItem";
import SidebarSection from "./sidebar/SidebarSection";
import SidebarFooter from "./sidebar/SidebarFooter";
import { useChatThreads } from "@/hooks/useChatThreads";
import { useChat } from "@/contexts/ChatContext";

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { threads, isLoading, handleThreadRename, handleThreadDelete } = useChatThreads(threadId);
  const { setCurrentThread } = useChat();

  // Main navigation items - renamed Library and changed icon
  const navItems = [
    {
      name: "AI Chat",
      path: "/dashboard/chat",
      icon: <MessageSquare className="h-6 w-6" />,
      exact: false,
      hasAction: true,
      action: () => window.location.href = '/dashboard/chat/new'
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

  const handleThreadSelect = (selectedThreadId: string) => {
    const thread = threads.find(t => t.id === selectedThreadId);
    if (thread) {
      setCurrentThread(thread);
      navigate(`/dashboard/chat/${selectedThreadId}`);
    }
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

            {/* Recent Chats Section */}
            <SidebarSection 
              title="Recent chats" 
              chatThreads={threads}
              onThreadRename={handleThreadRename}
              onThreadDelete={handleThreadDelete}
              onThreadSelect={handleThreadSelect}
              isLoading={isLoading}
            />
          </nav>

          <SidebarFooter />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
