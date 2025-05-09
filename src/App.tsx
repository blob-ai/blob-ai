
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import Layout from '@/components/layouts/Layout';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import ChatInterface from '@/pages/ChatInterface';
import ContentCreationPage from '@/pages/ContentCreationPage';
import Templates from '@/pages/Templates';
import Workspace from '@/pages/Workspace';
import UpgradePlan from '@/pages/UpgradePlan';
import NotFound from '@/pages/NotFound';
import Styles from '@/pages/Styles';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route element={<AuthGuard><Layout /></AuthGuard>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/styles" element={<Styles />} />
            <Route path="/dashboard/chat/:chatId?" element={<ChatInterface />} />
            <Route path="/dashboard/content/:contentId?" element={<ContentCreationPage />} />
            <Route path="/dashboard/templates" element={<Templates />} />
            <Route path="/dashboard/workspace" element={<Workspace />} />
            <Route path="/dashboard/upgrade" element={<UpgradePlan />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
