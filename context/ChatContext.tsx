'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types/user';
import { Chat } from '../services/chat.api';
import io from 'socket.io-client';

interface ChatContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedChat: Chat | string | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | string | null>>;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  notification: any[];
  setNotification: React.Dispatch<React.SetStateAction<any[]>>;
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  socket: any;
  onlineUsers: string[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

let socket: any = null;

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [notification, setNotification] = useState<any[]>([]);
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (user) {
      socket = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000');
      
      socket.emit('setup', user);
      socket.on('connected', () => console.log('Connected to socket'));
      
      socket.on('onlineUsers', (users: string[]) => {
        setOnlineUsers(users);
      });

      return () => {
        if (socket) {
          socket.disconnect();
          socket = null;
        }
      };
    }
  }, [user]);

  const contextValue: ChatContextType = {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    fetchAgain,
    setFetchAgain,
    socket,
    onlineUsers
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};