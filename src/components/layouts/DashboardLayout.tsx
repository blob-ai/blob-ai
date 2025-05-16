
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/ui/layout/app-header";

/**
 * Main dashboard layout
 * Handles overall dashboard structure including sidebar, header, and main content
 */
const DashboardLayout: React.FC = () => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      {/* Sidebar navigation - fixed position */}
      <Sidebar />
      
      {/* Main content area with proper margin when sidebar is open */}
      <div
        className={cn(
          "flex-1 flex flex-col h-full w-full transition-all duration-300 ease-in-out",
          isSidebarOpen ? "ml-72" : "ml-0"
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

export default DashboardLayout;
