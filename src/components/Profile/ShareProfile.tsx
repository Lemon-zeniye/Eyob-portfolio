import { getActiveUsers, shareProfile } from "@/Api/profile.api";
import { ActiveUser } from "@/Types/profile.type";
import { useMutation, useQuery } from "react-query";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import { getAxiosErrorMessage } from "@/Api/axios";
import { Spinner } from "../ui/Spinner";
import { formatImageUrl, tos } from "@/lib/utils";
import Cookies from "js-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserCard = ({
  user,
  small,
  selected,
  onSelect,
}: {
  user: ActiveUser;
  small: boolean;
  selected: boolean;
  onSelect: (user: ActiveUser) => void;
}) => {
  return (
    <div
      className={`w-full p-${
        small ? "2" : "4"
      } border rounded-lg transition-colors cursor-pointer ${
        selected ? "bg-primary/5 border-primary" : "hover:bg-gray-50"
      }`}
      onClick={() => onSelect(user)}
    >
      <div
        className={`flex items-center justify-between gap-${small ? "2" : "4"}`}
      >
        <div
          className={`${
            small ? "w-8 h-8" : "w-12 h-12"
          } rounded-full overflow-hidden`}
        >
          <Avatar className={`w-full h-full border rounded-full`}>
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
        <div className="flex-1 space-y-${small ? '0.5' : '1'} min-w-0">
          <h1
            className={`${
              small ? "text-sm" : "text-lg"
            } font-semibold truncate`}
          >
            {user.name}
          </h1>
          <p
            className={`text-gray-600 ${
              small ? "text-xs" : "text-sm"
            } truncate`}
          >
            {user.email}
          </p>
        </div>
        <Checkbox.Root
          className={`flex-shrink-0 ${
            small ? "w-4 h-4" : "w-5 h-5"
          } rounded border border-gray-300 flex items-center justify-center hover:border-primary transition-colors`}
          checked={selected}
          onCheckedChange={() => onSelect(user)}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox.Indicator className="text-primary">
            <CheckIcon className={small ? "w-3 h-3" : "w-4 h-4"} />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>
    </div>
  );
};

function ShareProfile({
  onSuccess,
  small = false,
}: {
  onSuccess: () => void;
  small?: boolean;
}) {
  const { data: activeUsers } = useQuery({
    queryKey: ["activeUser"],
    queryFn: getActiveUsers,
  });
  const userId = Cookies.get("userId");
  const role = Cookies.get("role");
  const [selectedUsers, setSelectedUsers] = useState<ActiveUser[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const filteredUsers = useMemo(() => {
    if (!activeUsers?.data) return [];
    return activeUsers.data.filter((user) =>
      user.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [activeUsers?.data, debouncedSearch]);

  const handleSelectUser = (user: ActiveUser) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u._id === user._id);
      return isSelected
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user];
    });
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: shareProfile,
    onSuccess: () => {
      tos.success("Success");
      onSuccess();
    },
    onError: (error: any) => {
      const message = getAxiosErrorMessage(error);
      tos.error(message);
    },
  });

  const submit = () => {
    if (userId && role && selectedUsers && selectedUsers.length > 0) {
      const payload = {
        subject: [{ id: userId, type: role }],
        recipient: selectedUsers.map((user) => ({
          id: user._id,
          type: user.role,
        })),
      };
      mutate(payload);
    }
  };

  return (
    <div className="space-y-4">
      <div className="px-1">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search User..."
          className="w-full"
        />
      </div>

      <div
        className={` ${
          small ? "h-[15rem]" : "h-96"
        } overflow-y-auto pr-2 space-y-3`}
      >
        {filteredUsers.map((user) => (
          <UserCard
            key={user._id}
            small={small}
            user={user}
            selected={selectedUsers.some((u) => u._id === user._id)}
            onSelect={handleSelectUser}
          />
        ))}
        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-500 py-4">No users found</p>
        )}
      </div>

      <button
        onClick={submit}
        disabled={selectedUsers.length === 0}
        className="w-full py-3 flex items-center justify-center px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {!isLoading ? (
          <>
            Share with {selectedUsers.length}{" "}
            {selectedUsers.length === 1 ? "user" : "users"}
          </>
        ) : (
          <Spinner />
        )}
      </button>
    </div>
  );
}

export default ShareProfile;
