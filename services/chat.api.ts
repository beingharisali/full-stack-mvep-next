import http from './http';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage?: Message;
  groupAdmin?: User;
  blockedBy?: string[];
  createdAt: string;
  updatedAt: string;
}

export const accessChat = async (userId: string): Promise<Chat> => {
  const response = await http.post('/chat', { userId });
  return response.data;
};

export const fetchChats = async (): Promise<Chat[]> => {
  const response = await http.get('/chat');
  return response.data;
};

export const createGroup = async (name: string, users: string[]): Promise<Chat> => {
  const response = await http.post('/chat/group', { name, users: JSON.stringify(users) });
  return response.data;
};

export const renameGroup = async (chatId: string, chatName: string): Promise<Chat> => {
  const response = await http.put('/chat/rename', { chatId, chatName });
  return response.data;
};

export const addToGroup = async (chatId: string, userId: string): Promise<Chat> => {
  const response = await http.put('/chat/groupadd', { chatId, userId });
  return response.data;
};

export const removeFromGroup = async (chatId: string, userId: string): Promise<Chat> => {
  const response = await http.put('/chat/groupremove', { chatId, userId });
  return response.data;
};

export const deleteGroup = async (chatId: string): Promise<{ message: string }> => {
  const response = await http.delete(`/chat/groupdelete`, { data: { chatId } });
  return response.data;
};

export const markChatAsRead = async (chatId: string): Promise<{ message: string }> => {
  const response = await http.put(`/chat/${chatId}/read`);
  return response.data;
};

export const deleteChat = async (chatId: string): Promise<{ message: string }> => {
  const response = await http.delete(`/chat/${chatId}`);
  return response.data;
};

export const blockChat = async (chatId: string): Promise<{ message: string }> => {
  const response = await http.post(`/chat/${chatId}/block`);
  return response.data;
};

export const unblockChat = async (chatId: string): Promise<{ message: string }> => {
  const response = await http.post(`/chat/${chatId}/unblock`);
  return response.data;
};

export const sendMessage = async (
  content: string,
  chatId: string,
  fileUrl?: string,
  fileName?: string,
  fileType?: string
): Promise<Message> => {
  const response = await http.post('/message', {
    content,
    chatId,
    fileUrl,
    fileName,
    fileType
  });
  return response.data;
};

export const getAllMessages = async (chatId: string): Promise<Message[]> => {
  const response = await http.get(`/message/${chatId}`);
  return response.data;
};

export const deleteMessage = async (messageId: string): Promise<{ message: string }> => {
  const response = await http.delete(`/message/${messageId}`);
  return response.data;
};

export const clearNotifications = async (): Promise<{ message: string }> => {
  const response = await http.put('/message/clear-notifications');
  return response.data;
};

export const searchUsers = async (searchQuery: string): Promise<User[]> => {
  const response = await http.get(`/users/search?searchQuery=${encodeURIComponent(searchQuery)}`);
  return response.data;
};