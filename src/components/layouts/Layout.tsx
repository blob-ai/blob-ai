
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/ui/layout/app-header";

/**
 * Main application layout
 * Handles overall page structure including sidebar, header, and main content
 */
const Layout: React.FC = () => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      {/* Sidebar navigation */}
      <Sidebar />
      
      {/* Main content area */}
      <div
        className={cn(
          "flex-1 flex flex-col h-full w-full transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-64" : "ml-0"
        )}
      >
        {/* Top Navigation */}
        <AppHeader />
        
        {/* Main Content - Scrollable area */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
