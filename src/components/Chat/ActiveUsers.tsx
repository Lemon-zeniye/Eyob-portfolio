import React from "react";

interface ActiveUsers {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Props {
  user: ActiveUsers;
}

const UserCard: React.FC<Props> = ({ user }) => {
  const getRando = () => Math.floor(Math.random() * 20) + 1;

  return (
    <div className="flex cursor-pointer items-center space-x-4  px-3 py-2 rounded-lg border border-white bg-white hover:border-gray-100 transition">
      <img
        src={`https://i.pravatar.cc/100?img=${getRando()}`}
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
