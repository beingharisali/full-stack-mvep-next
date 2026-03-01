
import http from "./http";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  createdAt: string;
  updatedAt: string;
  readBy: string[]; 
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

export const fetchChats = async (): Promise<Chat[]> => {
  const response = await http.get("/chat");
  return response.data;
};

export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await http.get(`/user?search=${query}`);
  return response.data;
};

export const accessChat = async (userId: string): Promise<Chat> => {
  const response = await http.post("/chat", { userId });
  return response.data;
};

export const createGroup = async (
  name: string,
  users: string[]
): Promise<Chat> => {
  const response = await http.post("/chat/group", { name, users });
  return response.data;
};

export const getAllMessages = async (chatId: string): Promise<Message[]> => {
  const response = await http.get(`/message/${chatId}`);
  return response.data;
};

export const sendMessage = async (
  content: string,
  chatId: string,
  fileUrl?: string,
  fileName?: string,
  fileType?: string
): Promise<Message> => {
  const response = await http.post("/message", {
    content,
    chatId,
    fileUrl,
    fileName,
    fileType,
  });
  return response.data;
};

export const markChatAsRead = async (chatId: string): Promise<void> => {
  await http.put(`/chat/${chatId}/read`);
};

export const deleteChat = async (chatId: string): Promise<void> => {
  await http.delete(`/chat/${chatId}`);
};

export const blockChat = async (chatId: string): Promise<void> => {
  await http.put(`/chat/${chatId}/block`);
};

export const unblockChat = async (chatId: string): Promise<void> => {
  await http.put(`/chat/${chatId}/unblock`);
};