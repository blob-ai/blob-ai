
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/layouts/SidebarProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import Workspace from "./pages/Workspace";
import ChatInterface from "./pages/ChatInterface";
import Templates from "./pages/Templates";
import NotFound from "./pages/NotFound";
import Layout from "./components/layouts/Layout";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthGuard from "./components/auth/AuthGuard";

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Landing page route */}
              <Route index element={<Index />} />
              
              {/* Auth route */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Redirect /chat to dashboard/chat */}
              <Route path="/chat" element={<Navigate to="/dashboard/chat" replace />} />
              
              {/* Dashboard routes wrapped in ChatProvider and SidebarProvider, protected by AuthGuard */}
              <Route path="/dashboard" element={
                <AuthGuard>
                  <ChatProvider>
                    <SidebarProvider>
                      <Layout />
                    </SidebarProvider>
                  </ChatProvider>
                </AuthGuard>
              }>
                {/* Redirect /dashboard to /dashboard/chat for default view */}
                <Route index element={<Navigate to="/dashboard/chat" replace />} />
                <Route path="chat" element={<ChatInterface />} />
                <Route path="chat/:threadId" element={<ChatInterface />} />
                <Route path="chat/new" element={<ChatInterface />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="workspace" element={<Workspace />} />
                <Route path="workspace/:id" element={<Workspace />} />
                <Route path="templates" element={<Templates />} />
              </Route>
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
