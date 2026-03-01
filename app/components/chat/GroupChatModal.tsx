'use client';

import React, { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useAuth } from '../../../context/AuthContext';
import { useChat } from '../../../context/ChatContext';
import { User as UserType, UserRole } from '../../../types/user';
import { Chat, createGroup, searchUsers } from '../../../services/chat.api';
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';

interface GroupChatModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated?: () => void;
}

interface SearchResultUser extends UserType {
  token?: string; 
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ 
  children, 
  isOpen, 
  onClose, 
  onGroupCreated 
}) => {
  const { user } = useAuth();
  const { chats, setChats } = useChat();
  
  const [groupChatName, setGroupChatName] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<SearchResultUser[]>([]);
  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchResultUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const chatUsers = await searchUsers(query);
      
      const appUsers: SearchResultUser[] = chatUsers.map(chatUser => ({
        id: chatUser._id,
        firstName: chatUser.firstName,
        lastName: chatUser.lastName,
        email: chatUser.email,
        role: chatUser.role as UserRole
      }));
      
      const filteredResults = appUsers.filter(result => 
        !selectedUsers.some(sel => sel.id === result.id)
      );
      setSearchResult(filteredResults);
      setLoading(false);
    } catch (error: any) {
      console.error('Error searching users:', error);
      alert('Failed to load search results');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length < 1) {
      alert('Please add at least one user and fill the group name');
      return;
    }

    try {
      const userIds = [...selectedUsers.map(u => u.id), user?.id].filter(id => id) as string[];
      
      const newChat = await createGroup(groupChatName, userIds);
      setChats([newChat, ...chats]);
      onClose();
      onGroupCreated?.();
      
      alert('New group chat created!');
      setGroupChatName('');
      setSelectedUsers([]);
      setSearch('');
      setSearchResult([]);
    } catch (error: any) {
      console.error('Error creating group chat:', error);
      alert('Failed to create the group chat: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = (delUser: SearchResultUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel.id !== delUser.id));
  };

  const handleGroup = (userToAdd: SearchResultUser) => {
    if (selectedUsers.some(u => u.id === userToAdd.id)) {
      alert('User already added!');
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    setSearch(''); 
    setSearchResult([]); 
  };

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupChatName(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  return (
    <>
      <div onClick={onClose}>{children}</div>
      
      <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content 
            className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 sm:max-w-lg md:w-full rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            style={{ maxWidth: '500px' }}
          >
            <DialogPrimitive.DialogTitle className="text-lg font-semibold leading-none tracking-tight mb-4">
              Create Group Chat
            </DialogPrimitive.DialogTitle>
            
            <div className="space-y-4 py-4">
              <div>
                <input 
                  placeholder="Chat Name" 
                  value={groupChatName}
                  onChange={handleGroupNameChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <input 
                  placeholder="Add Users eg: John, Jane, Bob" 
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedUsers.map(u => (
                  <UserBadgeItem
                    key={u.id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>

              <div className="max-h-40 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-2">Loading...</div>
                ) : (
                  <>
                    {searchResult.slice(0, 4).map(user => (
                      <UserListItem
                        key={user.id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))}
                    {search && !loading && searchResult.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-2">
                        No users found
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-4">
              <Button 
                onClick={handleSubmit}
                className="w-full"
                disabled={!groupChatName || selectedUsers.length === 0}
              >
                Create Chat
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
};

export default GroupChatModal;