import { Group } from "@/Types/chat.type";
import React from "react";

interface Props {
  group: Group;
  onClick: (group: Group) => void;
  isSelected: boolean;
}

const GroupCard: React.FC<Props> = ({ group, onClick, isSelected }) => {
  return (
    <div
      className={`flex cursor-pointer items-center space-x-4 px-3 py-2 rounded-lg border transition 
  ${
    isSelected
      ? "border-primary bg-primary text-white hover:border-primary"
      : "border-white bg-white hover:border-gray-100"
  }`}
      onClick={() => onClick(group)}
    >
      <img
        src={`https://i.pravatar.cc/100?img=12`}
        alt={group.groupName}
        className="w-12 h-12 rounded-full object-cover"
      />
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
