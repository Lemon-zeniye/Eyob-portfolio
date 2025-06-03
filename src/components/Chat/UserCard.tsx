import { ActiveUser } from "@/Types/profile.type";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatImageUrl } from "@/lib/utils";

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
          <Avatar className={`w-full h-full shrink-0 border rounded-full`}>
            <AvatarImage
              src={
                user?.picturePath ? formatImageUrl(user.picturePath) : undefined
              }
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className=" bg-white font-medium">
              {user?.name && user?.name?.slice(0, 1)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
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
