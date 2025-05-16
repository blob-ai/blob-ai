
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import HomePage from '@/pages/HomePage';
import ContentCreationPage from '@/pages/ContentCreationPage';
import ChatPage from '@/pages/ChatPage';
import { SidebarProvider } from '@/components/layouts/SidebarProvider';
import { ChatProvider } from '@/contexts/ChatContext';
import { ContentEditorProvider } from '@/contexts/ContentEditorContext';
import './index.css';

function App() {
  return (
    <SidebarProvider>
      <ChatProvider>
        <ContentEditorProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="chat" element={<ChatPage />} />
                <Route path="chat/:threadId" element={<ChatPage />} />
                <Route path="content" element={<ContentCreationPage />} />
              </Route>
            </Routes>
            <Toaster richColors position="top-center" />
          </Router>
        </ContentEditorProvider>
      </ChatProvider>
    </SidebarProvider>
  );
}

export default App;
