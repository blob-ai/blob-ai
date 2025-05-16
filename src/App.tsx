
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import HomePage from '@/pages/HomePage';
import ContentCreationPage from '@/pages/ContentCreationPage';
import ChatPage from '@/pages/ChatPage';
import { SidebarProvider } from '@/components/layouts/SidebarProvider';
import { ChatProvider } from '@/contexts/ChatContext';
import { ContentEditorProvider } from '@/contexts/ContentEditorContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Auth from '@/pages/Auth';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <ChatProvider>
            <ContentEditorProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route path="chat" element={<ChatPage />} />
                  <Route path="chat/:threadId" element={<ChatPage />} />
                  <Route path="content" element={<ContentCreationPage />} />
                </Route>
              </Routes>
              <Toaster richColors position="top-center" />
            </ContentEditorProvider>
          </ChatProvider>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
