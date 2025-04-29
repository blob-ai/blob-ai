
import React, { useEffect } from "react";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Users,
  PlusCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";

// Import refactored sidebar components
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavItem from "./sidebar/SidebarNavItem";
import SidebarSection from "./sidebar/SidebarSection";
import SidebarFooter from "./sidebar/SidebarFooter";

const Sidebar = () => {
  const { isSidebarOpen } = useSidebar();
  const { createThread, threads, loadThreads } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadThreads();
    }
  }, [user, loadThreads]);

  const handleNewChat = async () => {
    try {
      const threadId = await createThread();
      navigate(`/dashboard/chat/${threadId}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  // Main navigation items
  const navItems = [
    {
      name: "AI Chat",
      path: "/dashboard/chat",
      icon: <MessageSquare className="h-6 w-6" />,
      exact: false,
      hasAction: true,
      action: handleNewChat
    },
    {
      name: "Dashboard",
      path: "/dashboard/dashboard",
      icon: <LayoutDashboard className="h-6 w-6" />,
      exact: true,
      hasAction: false
    }
  ];

  // Get recent chats from threads context (limited to 3)
  const recentChats = threads
    .slice(0, 3)
    .map(thread => ({ 
      name: thread.title || "Untitled Chat", 
      path: `/dashboard/chat/${thread.id}`,
      icon: <MessageSquare className="h-5 w-5 text-white/60" />
    }));

  // Your workspaces data
  const workspaces = [
    { name: "Personal X Account", path: "/dashboard/workspace/personal-x", icon: <Users className="h-5 w-5 text-primary-400" /> },
    { name: "Web3 Posts", path: "/dashboard/workspace/web3", icon: <Users className="h-5 w-5 text-primary-400" /> }
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-black border-r border-white/10 z-30 transition-all duration-300 ease-in-out overflow-hidden",
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
              items={recentChats} 
              actionItem={{
                name: "New Chat",
                path: "",
                icon: <PlusCircle className="h-4 w-4" />,
                action: handleNewChat
              }}
            />
          </nav>

          <SidebarFooter />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
