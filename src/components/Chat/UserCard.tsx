import { ActiveUser } from "@/Types/profile.type";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

export const UserCard = ({
  user,
  selected,
  onSelect,
}: {
  user: ActiveUser;
  selected: boolean;
  onSelect: (user: ActiveUser) => void;
}) => {
  return (
    <div
      className={`w-full py-2 px-4 border rounded-lg transition-colors cursor-pointer ${
        selected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
      }`}
      onClick={() => onSelect(user)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src="https://i.pravatar.cc/100?img=8"
            alt={`${user.name}'s avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1  min-w-0">
          <h1 className="text-lg font-semibold truncate">{user.name}</h1>
          <p className="text-gray-600 text-sm truncate">{user.email}</p>
        </div>
        <Checkbox.Root
          className="flex-shrink-0 w-5 h-5 rounded border border-gray-300 flex items-center justify-center hover:border-primary transition-colors"
          checked={selected}
          onCheckedChange={() => onSelect(user)}
          onClick={(e) => e.stopPropagation()} // Prevent card click from triggering twice
        >
          <Checkbox.Indicator className="text-primary">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>
    </div>
  );
};
