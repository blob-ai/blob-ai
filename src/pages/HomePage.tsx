
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, LayoutDashboard } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Content AI Assistant</h1>
          <nav className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard/chat')}>Chat</Button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-4xl font-bold mb-6">Welcome to Content AI Assistant</h2>
          <p className="text-xl text-white/70 mb-12">
            Your intelligent companion for creating engaging content and managing your social media presence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="flex gap-2 items-center" 
              onClick={() => navigate('/dashboard/chat')}
            >
              <MessageSquare className="w-5 h-5" />
              Start Chatting
            </Button>
            
            <Button 
              size="lg" 
              className="flex gap-2 items-center"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              <LayoutDashboard className="w-5 h-5" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 border-t border-white/10 text-center text-white/50">
        <p>© {new Date().getFullYear()} Content AI Assistant. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
