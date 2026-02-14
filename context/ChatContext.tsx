
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { io, type Socket } from "socket.io-client";
import { Chat } from "../services/chat.api";

interface ChatContextType {
  selectedChat: Chat | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  unreadCounts: Record<string, number>;
  setUnreadCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
        transports: ["websocket"],
      });
      setSocket(newSocket);

      newSocket.emit("setup", user.id);

      newSocket.on("connected", () => console.log("Socket connected"));

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchAgain,
        setFetchAgain,
        socket,
        setSocket,
        unreadCounts,
        setUnreadCounts,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};