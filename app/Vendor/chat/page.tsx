'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../../shared/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import { ChatProvider, useChat } from '../../../context/ChatContext';
import MyChats from '../../components/chat/MyChats';
import ChatBox from '../../components/chat/ChatBox';
import { accessChat } from '../../../services/chat.api';

const VendorChatPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fetchAgain, setFetchAgain] = useState(false);
  const router = useRouter();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        if (window.innerWidth < 1024) {
          setSidebarOpen(false);
        } else {
          setSidebarOpen(true);
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <ProtectedRoute allowedRoles={['vendor']} redirectPath="/">
      <div className="min-h-screen">
        <Navbar onMenuToggle={toggleSidebar}/>
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onToggle={toggleSidebar} />
          <main
            className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? "lg:ml-0" : ""
            } ${typeof window !== 'undefined' && window.innerWidth < 1024 ? 'ml-0' : ''}`}>
            <div className="container-mobile-lg mx-auto max-w-7xl p-4 lg:p-6 h-[calc(100vh-100px)] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold neon-text">Chat</h1>
                <button 
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-indigo-900/30 text-indigo-400 rounded-md border border-indigo-500/30 hover:bg-indigo-800/50 transition-colors touch-button"
                >
                  Back
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row flex-1 gap-4 overflow-hidden">
                <MyChats />
                <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const VendorChatWrapper: React.FC = () => {
  return (
    <ChatProvider>
      <VendorChatPage />
    </ChatProvider>
  );
};

export default VendorChatWrapper;