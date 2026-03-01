import React from 'react';
import { Message } from '../../../services/chat.api';

interface ScrollableChatProps {
  messages: Message[];
}

const ScrollableChat: React.FC<ScrollableChatProps> = ({ messages }) => {
  const currentUserId = "currentUserId"; 
  
  return (
    <div className="overflow-y-auto flex-1 p-4 space-y-3 max-h-96">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`flex ${msg.sender._id === currentUserId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.sender._id === currentUserId
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
            <div className={`text-xs mt-1 ${msg.sender._id === currentUserId ? 'text-blue-200' : 'text-gray-500'}`}>
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrollableChat;