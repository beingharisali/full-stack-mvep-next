"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";
import {
  Chat,
  Message,
  getAllMessages,
  sendMessage as sendMsg,
  markChatAsRead,
} from "../../../services/chat.api";
import { getChatPartnerName } from "./ChatLogic";
import { User as UserType } from "../../../types/user";
import SearchUser from "./SearchUser";

interface ChatBoxProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  fetchAgain: propFetchAgain,
  setFetchAgain: propSetFetchAgain,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const {
    selectedChat,
    socket,
    setFetchAgain: contextSetFetchAgain,
    unreadCounts,
    setUnreadCounts,
  } = useChat();

  const setFetchAgain = propSetFetchAgain || contextSetFetchAgain;

  const scrollBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const data = await getAllMessages((selectedChat as Chat)._id);
      setMessages(data);
      setLoading(false);

      await markChatAsRead((selectedChat as Chat)._id);
      setUnreadCounts((prev) => ({
        ...prev,
        [(selectedChat as Chat)._id]: 0,
      }));
    } catch (error) {
      console.error("Failed to load messages:", error);
      alert("Failed to load messages");
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat && socket) {
      socket.emit("join chat", (selectedChat as Chat)._id);

      const handleMessageReceived = (newMessage: Message) => {
        const chatId = (selectedChat as Chat)._id;
        
        if (newMessage.chat._id === chatId) {
          setMessages((prev) => [...prev, newMessage]);
          markChatAsRead(chatId);
        } else {
          setUnreadCounts((prev) => ({
            ...prev,
            [newMessage.chat._id]: (prev[newMessage.chat._id] || 0) + 1,
          }));
          setFetchAgain((prev) => !prev);
        }
      };

      socket.on("message received", handleMessageReceived);

      return () => {
        socket.off("message received", handleMessageReceived);
      };
    }
  }, [socket, selectedChat, setFetchAgain, setUnreadCounts]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() && !file) return;

    if (!selectedChat) {
      alert("Please select a chat first");
      return;
    }

    try {
      let fileUrl = "";
      let fileName = "";
      let fileType = "";

      if (file) {
        fileUrl = URL.createObjectURL(file);
        fileName = file.name;
        fileType = file.type;
      }

      const messageData = await sendMsg(
        newMessage,
        (selectedChat as Chat)._id,
        fileUrl,
        fileName,
        fileType
      );

      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (socket) {
        socket.emit("new message", messageData);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    if (diffInDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    if (diffInDays < 7) {
      return `${date.toLocaleDateString("en-US", {
        weekday: "long",
      })} at ${date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  if (!selectedChat) {
    return (
      <div className="hidden md:flex items-center justify-center w-full h-full bg-[#0f1420] rounded-xl border border-indigo-500/30">
        <div className="text-center p-4">
          <p className="text-gray-400 text-lg mb-4">
            💬 Select a user to start chatting
          </p>
          <div className="max-w-md mx-auto">
            <SearchUser />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full md:w-auto glass-card rounded-xl border border-indigo-500/30">
      <div className="p-4 border-b border-indigo-500/30 bg-[#1a1f2e] rounded-t-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-indigo-400">💬</span>
          {selectedChat && (selectedChat as Chat).isGroupChat
            ? (selectedChat as Chat).chatName
            : getChatPartnerName(
                user as UserType,
                (selectedChat as Chat).users
              )}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#0f1420] rounded-b-xl">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`flex ${
                  msg.sender._id === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender._id === user?.id
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-[#1a1f2e] text-gray-300 rounded-bl-none border border-indigo-500/30"
                  }`}
                >
                  {msg.fileUrl ? (
                    <div>
                      <p className="mb-1">{msg.content}</p>
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-300 underline"
                      >
                        📎 {msg.fileName || "File"}
                      </a>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  <div
                    className={`text-xs mt-1 ${
                      msg.sender._id === user?.id
                        ? "text-indigo-200"
                        : "text-gray-500"
                    }`}
                  >
                    {formatDate(msg.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-indigo-500/30 bg-[#1a1f2e] rounded-b-xl">
        {file && (
          <div className="flex items-center p-2 mb-2 bg-indigo-900/30 rounded border border-indigo-500/30">
            <span className="truncate mr-2 text-gray-300">{file.name}</span>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-red-400 hover:text-red-300"
            >
              ❌
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 gaming-input rounded-full px-4 py-2"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full bg-indigo-900/50 text-indigo-400 hover:bg-indigo-800/50 border border-indigo-500/30"
          >
            📎
          </button>
          <button
            type="submit"
            disabled={!newMessage.trim() && !file}
            className="p-2 rounded-full gaming-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⚡
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;