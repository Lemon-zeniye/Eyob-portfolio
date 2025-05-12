import { ActiveUsers } from "@/Types/chat.type";
import React from "react";

interface Props {
  user: ActiveUsers;
  onlineUser: string;
  onClick: (user: ActiveUsers) => void;
  isSelected: boolean;
}

export const UserCardSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 px-3 py-2 rounded-lg border border-white bg-white animate-pulse">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="w-3 h-3 absolute right-0 bottom-0 bg-gray-300 rounded-full border-2 border-white" />
      </div>
      <div className="flex flex-col space-y-1">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-36 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

const UserCard: React.FC<Props> = ({
  user,
  onClick,
  onlineUser,
  isSelected,
}) => {
  return (
    <div
      className={`flex cursor-pointer items-center space-x-4 px-3 py-2 rounded-lg border transition 
  ${
    isSelected
      ? "border-primary bg-primary text-white hover:border-primary"
      : "border-white bg-white hover:border-gray-100"
  }`}
      onClick={() => onClick(user)}
    >
      <div className="relative shrink-0">
        <img
          src={`https://i.pravatar.cc/100?img=10`}
          alt={user.name}
          className="w-12  h-12 rounded-full object-cover"
        />
        <div
          className={`w-3 h-3 absolute right-0 bottom-0 ${
            onlineUser === user._id ? "bg-green-500" : "bg-gray-400"
          } rounded-full border-2 border-white`}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{user.name}</span>
        <span
          className={`text-xs ${isSelected ? "text-white" : "text-gray-500"} `}
        >
          {user.email}
        </span>
      </div>
    </div>
  );
};

export default UserCard;
