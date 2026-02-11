'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useChat } from '../../../context/ChatContext';
import { Chat, Message, getAllMessages, sendMessage as sendMsg, markChatAsRead } from '../../../services/chat.api';
import { getChatPartnerName } from './ChatLogic';
import { User as UserType } from '../../../types/user';
import SearchUser from './SearchUser';

interface ChatBoxProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ fetchAgain: propFetchAgain, setFetchAgain: propSetFetchAgain }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { selectedChat, socket, setFetchAgain: contextSetFetchAgain } = useChat();

  const setFetchAgain = propSetFetchAgain || contextSetFetchAgain;

  const scrollBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    } catch (error) {
      console.error('Failed to load messages:', error);
      alert('Failed to load messages');
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat && socket) {
      socket.emit('join chat', (selectedChat as Chat)._id);

      const handleMessageReceived = (newMessage: Message) => {
        if (selectedChat && (selectedChat as Chat)._id === newMessage.chat._id) {
          setMessages(prev => [...prev, newMessage]);
          
          markChatAsRead((selectedChat as Chat)._id);
        } else {
          setFetchAgain(prev => !prev);
        }
      };

      socket.on('message received', handleMessageReceived);

      return () => {
        socket.off('message received', handleMessageReceived);
      };
    }
  }, [socket, selectedChat, setFetchAgain]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() && !file) return;
    
    if (!selectedChat) {
      alert('Please select a chat first');
      return;
    }

    try {
      let fileUrl = '';
      let fileName = '';
      let fileType = '';

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

      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
      setFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (socket) {
        socket.emit('new message', messageData);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
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
      fileInputRef.current.value = '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    }
  
    if (diffInDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
  
    if (diffInDays < 7) {
      return `${date.toLocaleDateString('en-US', { weekday: 'long' })} at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
  
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) + ' at ' + date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  if (!selectedChat) {
    return (
      <div className="hidden md:flex items-center justify-center w-full h-full bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="text-center p-4">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Select a chat to start messaging</p>
          <div className="max-w-md mx-auto">
            <SearchUser />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full md:w-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl">
        <h2 className="text-xl font-bold">
          {selectedChat && (selectedChat as Chat).isGroupChat 
            ? (selectedChat as Chat).chatName 
            : getChatPartnerName(user as UserType, (selectedChat as Chat).users)}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`flex ${msg.sender._id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender._id === user?.id
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.fileUrl ? (
                    <div>
                      <p className="mb-1">{msg.content}</p>
                      <a 
                        href={msg.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-300 underline"
                      >
                        {msg.fileName || 'File'}
                      </a>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  <div className={`text-xs mt-1 ${msg.sender._id === user?.id ? 'text-blue-200' : 'text-gray-500'}`}>
                    {formatDate(msg.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
        {file && (
          <div className="flex items-center p-2 mb-2 bg-blue-50 dark:bg-blue-900/30 rounded">
            <span className="truncate mr-2">{file.name}</span>
            <button 
              type="button" 
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="submit"
            disabled={!newMessage.trim() && !file}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;