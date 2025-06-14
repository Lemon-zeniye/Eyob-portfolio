import { getActiveUsers } from "@/Api/profile.api";
import UserCard, { UserCardSkeleton } from "@/components/Chat/ActiveUsers";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { ActiveUsers } from "@/Types/chat.type";
import Cookies from "js-cookie";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

function Explore() {
  const [search, setSearch] = useState("");
  const { data: activeUsers, isLoading } = useQuery({
    queryKey: ["activeUser"],
    queryFn: getActiveUsers,
  });

  const navigate = useNavigate();
  const userId = Cookies.get("userId");

  const filteredUsers = activeUsers?.data
    ?.filter(
      (user: ActiveUsers) =>
        user._id !== userId &&
        (user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()))
    )
    ?.reverse();

  const handleClick = (userId: string, userName: string) => {
    // Replace spaces with underscores
    const formattedUserName = userName.replace(/\s+/g, "_");
    navigate(`/user/${formattedUserName}`, { state: { id: userId } });
  };
  return (
    <div className="w-full">
      <div className="h-full max-w-md mx-auto flex flex-col">
        <SearchBar
          className="w-full focus:outline-none p-2"
          search={search}
          setSearch={setSearch}
        />
        <div className="h-[calc(100vh-8rem)] mt-3 overflow-y-auto flex flex-col">
          <div className="space-y-2">
            {isLoading
              ? [...Array(7)].map((_, i) => <UserCardSkeleton key={i} />)
              : filteredUsers?.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    onlineUser={""}
                    // onClick={() => {
                    //   startChat(user);
                    //   setSidebarOpen(false);
                    // }}
                    onClick={() => handleClick(user._id, user.name)}
                    isSelected={false}
                    isChat={false}
                    userPicturePath={user.picturePath}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
