import React from 'react';
import { User } from '../../../types/user';

interface UserBadgeItemProps {
  user: User;
  handleFunction: () => void;
}

const UserBadgeItem: React.FC<UserBadgeItemProps> = ({ user, handleFunction }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm">
      <span>
        {user.firstName} {user.lastName}
      </span>
      <button
        type="button"
        onClick={handleFunction}
        className="text-red-500 hover:text-red-700 focus:outline-none"
      >
        ×
      </button>
    </div>
  );
};

export default UserBadgeItem;