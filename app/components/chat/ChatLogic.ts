import { User as UserType } from '../../../types/user';
import { Chat, User as ChatUser } from '../../../services/chat.api';

export const getChatPartnerName = (user: UserType | null, chatUsers: ChatUser[]): string => {
  if (!user || chatUsers.length === 0) return '';
  
  const partner = chatUsers.find(u => u._id !== user.id);
  return partner ? `${partner.firstName} ${partner.lastName}` : 'Unknown';
};

export const getChatPartner = (user: UserType | null, chatUsers: ChatUser[]): ChatUser | undefined => {
  if (!user || chatUsers.length === 0) return undefined;
  
  return chatUsers.find(u => u._id !== user.id);
};

export const isGroupChat = (chat: Chat): boolean => {
  return chat.isGroupChat;
};

export const isGroupAdmin = (user: UserType | null, chat: Chat): boolean => {
  if (!user || !chat.isGroupChat || !chat.groupAdmin) return false;
  return chat.groupAdmin._id === user.id;
};

export const isChatBlocked = (user: UserType | null, chat: Chat): boolean => {
  if (!user || !chat.blockedBy) return false;
  return chat.blockedBy.includes(user.id);
};