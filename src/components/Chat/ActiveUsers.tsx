import { useRole } from "@/Context/RoleContext";
import { formatImageUrl } from "@/lib/utils";
import { ActiveUsers } from "@/Types/chat.type";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  user: ActiveUsers;
  onlineUser: string;
  onClick: (user: ActiveUsers) => void;
  isSelected: boolean;
  lastMessage?: string;
  userPicturePath?: string;
  isChat: boolean;
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
  lastMessage,
  userPicturePath,
  isChat = false,
}) => {
  const { mode } = useRole();
  return (
    <div
      className={`flex cursor-pointer items-center space-x-4 px-3 py-2 rounded-lg border transition 
  ${
    isSelected
      ? mode === "formal"
        ? "border-primary bg-primary text-white hover:border-primary"
        : "border-primary2 bg-primary2 text-white hover:border-primary2/90"
      : "border-white bg-white hover:border-gray-100"
  }`}
      onClick={() => onClick(user)}
    >
      <div className="relative shrink-0">
        <Avatar className="w-12  h-12 rounded-full object-cover">
          <AvatarImage
            src={userPicturePath && formatImageUrl(userPicturePath)}
            alt="Your avatar"
            className="object-cover"
          />
          <AvatarFallback
            className={`${
              isSelected
                ? "bg-white text-black"
                : mode === "formal"
                ? "text-white  bg-gradient-to-r from-primary to-primary/60"
                : "text-white  bg-gradient-to-r from-primary2 to-primary2/60"
            }`}
          >
            {user?.name
              ?.split(" ")
              .map((word) => word[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
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
          {isChat ? lastMessage : user.email}
        </span>
      </div>
    </div>
  );
};

export default UserCard;
