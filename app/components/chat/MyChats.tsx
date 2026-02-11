'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useChat } from '../../../context/ChatContext';
import { Chat, fetchChats, deleteChat as deleteChatApi, blockChat as blockChatApi, unblockChat as unblockChatApi } from '../../../services/chat.api';
import { getChatPartnerName } from './ChatLogic';
import { User as UserType } from '../../../types/user';
import SearchUser from './SearchUser';

interface MyChatsProps {
  fetchAgain?: boolean;
  setFetchAgain?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyChats: React.FC<MyChatsProps> = ({ fetchAgain: propFetchAgain, setFetchAgain: propSetFetchAgain }) => {
  const [showChats, setShowChats] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null); 

  const { user } = useAuth();
  const { selectedChat, setSelectedChat, chats, setChats, fetchAgain: contextFetchAgain, setFetchAgain: contextSetFetchAgain } = useChat();
  
  const effectiveFetchAgain = propFetchAgain !== undefined ? propFetchAgain : contextFetchAgain;
  const setEffectiveFetchAgain = propSetFetchAgain !== undefined ? propSetFetchAgain : contextSetFetchAgain;
  
  const refreshChats = () => {
    setEffectiveFetchAgain(prev => !prev);
  };

  const fetchChatsData = async () => {
    try {
      const data = await fetchChats();
      const chatsWithBlockStatus = data.map(chat => ({
        ...chat,
        isBlocked: chat.blockedBy && chat.blockedBy.includes(user?.id || '')
      }));
      setChats(chatsWithBlockStatus);
    } catch (error: any) {
      console.error('Failed to load chats:', error);
      alert('Failed to load chats');
    }
  };

  useEffect(() => {
    fetchChatsData();
  }, [effectiveFetchAgain, refreshChats]);

  const handleDeleteChat = async (chatId: string) => {
    try {
      console.log('Deleting chat:', chatId);
      await deleteChatApi(chatId);

      setChats(chats.filter((c: Chat) => c._id !== chatId));

      if (selectedChat && (selectedChat as Chat)._id === chatId) {
        setSelectedChat(null);
      }

      alert('Chat deleted successfully');
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Failed to delete chat: ' + (error.message || 'Unknown error'));
    }
  };

  const handleBlockChat = async (chatId: string) => {
    try {
      console.log('Blocking chat:', chatId);
      await blockChatApi(chatId);

      setChats(chats.map((c: Chat) =>
        c._id === chatId ? { ...c, isBlocked: true } : c
      ));

      alert('Chat blocked successfully');
    } catch (error: any) {
      console.error('Block error:', error);
      alert('Failed to block chat: ' + (error.message || 'Unknown error'));
    }
  };

  const handleUnblockChat = async (chatId: string) => {
    try {
      console.log('Unblocking chat:', chatId);
      await unblockChatApi(chatId);

      setChats(chats.map((c: Chat) =>
        c._id === chatId ? { ...c, isBlocked: false } : c
      ));

      alert('Chat unblocked successfully');
    } catch (error: any) {
      console.error('Unblock error:', error);
      alert('Failed to unblock chat: ' + (error.message || 'Unknown error'));
    }
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setEffectiveFetchAgain(prev => !prev); 
  };

  const toggleDropdown = (chatId: string) => {
    setDropdownOpen(dropdownOpen === chatId ? null : chatId);
  };

  return (
    <div
      className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[32%] h-full overflow-hidden min-w-[300px]`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setShowChats(!showChats)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="text-lg font-bold">My Chats</span>
        </div>
      </div>
      
      <SearchUser />
      
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {showChats && (
        <div className="mt-3 flex-1 overflow-y-auto">
          {chats.length > 0 ? (
            <div className="space-y-2">
              {chats.map((chat: Chat) => {
                const isSelected = selectedChat && (selectedChat as Chat)._id === chat._id;

                return (
                  <div
                    key={chat._id}
                    className={`p-3 flex items-center justify-between rounded-xl cursor-pointer ${
                      isSelected 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-gray-200 dark:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center">
                        <span className="font-medium">
                          {chat.isGroupChat 
                            ? chat.chatName.charAt(0).toUpperCase()
                            : getChatPartnerName(user as UserType, chat.users).charAt(0).toUpperCase()
                          }
                        </span>
                      </div>

                      <div>
                        <div className="font-semibold truncate max-w-[150px]">
                          {chat.isGroupChat
                            ? chat.chatName
                            : getChatPartnerName(user as UserType, chat.users)}
                        </div>

                        {chat.latestMessage && (
                          <div className="text-sm truncate max-w-[150px]">
                            {chat.latestMessage.content}
                          </div>
                        )}
                      </div>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={() => toggleDropdown(chat._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>

                        {dropdownOpen === chat._id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => {
                                handleDeleteChat(chat._id);
                                setDropdownOpen(null);
                              }}
                            >
                              Delete Chat
                            </button>
                            
                            {(chat as any).isBlocked ? (
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                onClick={() => {
                                  handleUnblockChat(chat._id);
                                  setDropdownOpen(null);
                                }}
                              >
                                Unblock Chat
                              </button>
                            ) : (
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                onClick={() => {
                                  handleBlockChat(chat._id);
                                  setDropdownOpen(null);
                                }}
                              >
                                Block Chat
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span>No chats yet</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyChats;