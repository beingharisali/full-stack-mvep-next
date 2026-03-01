"use client";

import React, { useState, useEffect } from "react";
import { User as AppUser, UserRole } from "../../../types/user";
import {
  User as ChatUser,
  searchUsers,
  accessChat,
} from "../../../services/chat.api";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";

interface SearchUserProps {
  onUserSelect?: (user: AppUser) => void;
}

const SearchUser: React.FC<SearchUserProps> = ({ onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { setSelectedChat, setFetchAgain } = useChat();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Searching for users with term:", searchTerm);
      const chatUsers: ChatUser[] = await searchUsers(searchTerm);
      console.log("Found chat users:", chatUsers);

      const appUsers: AppUser[] = chatUsers.map((chatUser) => ({
        id: chatUser._id,
        firstName: chatUser.firstName,
        lastName: chatUser.lastName,
        email: chatUser.email,
        role: chatUser.role as UserRole,
      }));

      console.log("Converted app users:", appUsers);
      setSearchResults(appUsers);
    } catch (err: any) {
      console.error("Error searching users:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError(
        `Failed to search users: ${err.response?.data?.message || err.message || "Please try again."}`,
      );
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (selectedUser: AppUser) => {
    try {
      console.log("Starting chat with user:", selectedUser);
      const chat = await accessChat(selectedUser.id);
      console.log("Chat created/accessed:", chat);

      setSelectedChat(chat);

      setFetchAgain((prev) => !prev);

      if (onUserSelect) {
        onUserSelect(selectedUser);
      }
    } catch (err: any) {
      console.error("Error starting chat:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError(
        `Failed to start chat: ${err.response?.data?.message || err.message || "Please try again."}`,
      );
    }
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search for ${user?.role === "customer" ? "vendors" : "customers"} to chat...`}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-sm">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="p-3 border-b border-gray-100 hover:bg-gray-50 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">
                  {result.firstName} {result.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {result.email} • {result.role}
                </div>
              </div>
              <button
                onClick={() => handleStartChat(result)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      )}

      {searchTerm && !loading && searchResults.length === 0 && !error && (
        <div className="mt-2 p-3 text-center text-gray-500 bg-gray-50 rounded-lg">
          No users found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchUser;
