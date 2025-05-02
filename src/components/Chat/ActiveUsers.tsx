import { ActiveUsers } from "@/Types/chat.type";
import React from "react";

interface Props {
  user: ActiveUsers;
  onClick: (user: ActiveUsers) => void;
}

const UserCard: React.FC<Props> = ({ user, onClick }) => {
  return (
    <div
      className="flex cursor-pointer items-center space-x-4  px-3 py-2 rounded-lg border border-white bg-white hover:border-gray-100 transition"
      onClick={() => onClick(user)}
    >
      <img
        src={`https://i.pravatar.cc/100?img=10`}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{user.name}</span>
        <span className="text-xs text-gray-500">{user.email}</span>
      </div>
    </div>
  );
};

export default UserCard;
