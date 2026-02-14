"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";
import {
  Chat,
  fetchChats,
  deleteChat as deleteChatApi,
  blockChat as blockChatApi,
  unblockChat as unblockChatApi,
} from "../../../services/chat.api";
import { getChatPartnerName } from "./ChatLogic";
import { User as UserType } from "../../../types/user";
import SearchUser from "./SearchUser";

interface MyChatsProps {
  fetchAgain?: boolean;
  setFetchAgain?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyChats: React.FC<MyChatsProps> = ({
  fetchAgain: propFetchAgain,
  setFetchAgain: propSetFetchAgain,
}) => {
  const [showChats, setShowChats] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const { user } = useAuth();
  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    fetchAgain: contextFetchAgain,
    setFetchAgain: contextSetFetchAgain,
  } = useChat();

  const effectiveFetchAgain =
    propFetchAgain !== undefined ? propFetchAgain : contextFetchAgain;
  const setEffectiveFetchAgain =
    propSetFetchAgain !== undefined ? propSetFetchAgain : contextSetFetchAgain;

  const refreshChats = () => {
    setEffectiveFetchAgain((prev) => !prev);
  };

  const fetchChatsData = async () => {
    try {
      const data = await fetchChats();
      const chatsWithBlockStatus = data.map((chat) => ({
        ...chat,
        isBlocked: chat.blockedBy && chat.blockedBy.includes(user?.id || ""),
      }));
      setChats(chatsWithBlockStatus);
    } catch (error: any) {
      console.error("Failed to load:", error);
      alert("Failed to load chats");
    }
  };

  useEffect(() => {
    fetchChatsData();
  }, [effectiveFetchAgain, refreshChats]);

  const handleDeleteChat = async (chatId: string) => {
    try {
      console.log("Deleting chat:", chatId);
      await deleteChatApi(chatId);

      setChats(chats.filter((c: Chat) => c._id !== chatId));

      if (selectedChat && (selectedChat as Chat)._id === chatId) {
        setSelectedChat(null);
      }

      alert("🗑️ Chat deleted successfully");
    } catch (error: any) {
      console.error("Delete error:", error);
      alert("Failed to delete: " + (error.message || "Unknown error"));
    }
  };

  const handleBlockChat = async (chatId: string) => {
    try {
      console.log("Blocking:", chatId);
      await blockChatApi(chatId);

      setChats(
        chats.map((c: Chat) =>
          c._id === chatId ? { ...c, isBlocked: true } : c,
        ),
      );

      alert("🚫Blocked successfully");
    } catch (error: any) {
      console.error("Block error:", error);
      alert("Failed to block: " + (error.message || "Unknown error"));
    }
  };

  const handleUnblockChat = async (chatId: string) => {
    try {
      console.log("Unblocking:", chatId);
      await unblockChatApi(chatId);

      setChats(
        chats.map((c: Chat) =>
          c._id === chatId ? { ...c, isBlocked: false } : c,
        ),
      );

      alert("🔓Unblocked successfully");
    } catch (error: any) {
      console.error("Unblock error:", error);
      alert("Failed to unblock: " + (error.message || "Unknown error"));
    }
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setEffectiveFetchAgain((prev) => !prev);
  };

  const toggleDropdown = (chatId: string) => {
    setDropdownOpen(dropdownOpen === chatId ? null : chatId);
  };

  return (
    <div
      className={`${selectedChat ? "hidden md:flex" : "flex"} flex-col w-full md:w-[32%] h-full overflow-hidden min-w-[300px]`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-md hover:bg-indigo-500/20 text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowChats(!showChats)}
          >
            {showChats ? "📜" : "📚"}
          </button>
          <span className="text-lg font-bold text-white">Chats</span>
        </div>
      </div>

      <SearchUser />

      <div className="border-t border-indigo-500/30 my-3"></div>

      {showChats && (
        <div className="mt-3 flex-1 overflow-y-auto">
          {chats.length > 0 ? (
            <div className="space-y-2">
              {chats.map((chat: Chat) => {
                const isSelected =
                  selectedChat && (selectedChat as Chat)._id === chat._id;

                return (
                  <div
                    key={chat._id}
                    className={`p-3 flex items-center justify-between rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white border border-indigo-400"
                        : "glass-card hover:border-indigo-500/50"
                    }`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-indigo-900/50 rounded-full w-10 h-10 flex items-center justify-center border border-indigo-500/50">
                        <span className="font-medium text-indigo-400">
                          {chat.isGroupChat
                            ? chat.chatName.charAt(0).toUpperCase()
                            : getChatPartnerName(user as UserType, chat.users)
                                .charAt(0)
                                .toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <div className="font-semibold truncate max-w-[150px]">
                          {chat.isGroupChat
                            ? chat.chatName
                            : getChatPartnerName(user as UserType, chat.users)}
                        </div>

                        {chat.latestMessage && (
                          <div className="text-sm truncate max-w-[150px] text-gray-400">
                            {chat.latestMessage.content}
                          </div>
                        )}
                      </div>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          className="p-1 rounded-full hover:bg-indigo-500/20 transition-colors"
                          onClick={() => toggleDropdown(chat._id)}
                        >
                          ⋮
                        </button>

                        {dropdownOpen === chat._id && (
                          <div className="absolute right-0 mt-1 w-48 glass-card rounded-md shadow-lg z-10 border border-indigo-500/30 py-1">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                              onClick={() => {
                                handleDeleteChat(chat._id);
                                setDropdownOpen(null);
                              }}
                            >
                              🗑️ Delete
                            </button>

                            {(chat as any).isBlocked ? (
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-green-500/20 transition-colors"
                                onClick={() => {
                                  handleUnblockChat(chat._id);
                                  setDropdownOpen(null);
                                }}
                              >
                                🔓 Unblock
                              </button>
                            ) : (
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-orange-500/20 transition-colors"
                                onClick={() => {
                                  handleBlockChat(chat._id);
                                  setDropdownOpen(null);
                                }}
                              >
                                🚫 Block
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400">No chat yet</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyChats;
