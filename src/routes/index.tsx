
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layouts/Layout';
import Dashboard from '@/pages/Dashboard';
import ChatRoutes from './ChatRoutes';
import { SidebarProvider } from '@/components/layouts/SidebarProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="chat/*" element={<ChatRoutes />} />
              </Route>
            </Routes>
          </SidebarProvider>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
