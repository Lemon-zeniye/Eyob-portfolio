import { useRole } from "@/Context/RoleContext";
import { Group } from "@/Types/chat.type";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  group: Group;
  onClick: (group: Group) => void;
  isSelected: boolean;
}

const GroupCard: React.FC<Props> = ({ group, onClick, isSelected }) => {
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
      onClick={() => onClick(group)}
    >
      <Avatar className="w-12  h-12 rounded-full object-cover">
        <AvatarImage
          src={undefined}
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
          {group?.groupName
            ?.split(" ")
            .map((word) => word[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{group.groupName}</span>
        <span
          className={`text-xs ${isSelected ? "text-white" : "text-gray-500"} `}
        >
          last message
        </span>
      </div>
    </div>
  );
};

export default GroupCard;
