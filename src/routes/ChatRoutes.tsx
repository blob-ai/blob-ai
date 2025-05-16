
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatInterface from '@/pages/ChatInterface';

const ChatRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ChatInterface />} />
      <Route path="/:threadId" element={<ChatInterface />} />
      <Route path="/new" element={<Navigate to="/dashboard/chat" replace />} />
      <Route path="*" element={<Navigate to="/dashboard/chat" replace />} />
    </Routes>
  );
};

export default ChatRoutes;
