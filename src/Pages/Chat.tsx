import { SearchBar } from "@/components/SearchBar/SearchBar";
import { useState, useEffect, useRef } from "react";
import user from "../assets/user.jpg";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import Tabs from "@/components/Tabs/TabsLine";
import { useQuery, useQueryClient } from "react-query";
import {
  getActiveUsers,
  getChatWithX,
  getGroupChats,
  getGroups,
  getPreviousChat,
} from "@/Api/chat.api";
import UserCard, { UserCardSkeleton } from "@/components/Chat/ActiveUsers";
import { ActiveUsers, Group } from "@/Types/chat.type";
import { useSocket } from "../Context/SocketProvider";
import { formatMessageTime, groupMessagesByDate } from "@/lib/utils";
import Cookies from "js-cookie";
import GroupCard from "@/components/Chat/GroupCard";
import * as Dialog from "@radix-ui/react-dialog";
import AddGroup from "@/components/Chat/AddGroup";
import { FiMessageSquare } from "react-icons/fi";
import { Menu, X } from "lucide-react";
import GroupDetail from "@/components/Chat/GroupDetail";
import { useIsMobile } from "@/hooks/use-isMobile";
import UserProfile from "@/components/Jobs/UserFullProfile";
import { useRole } from "@/Context/RoleContext";
import { useNavigate } from "react-router-dom";

export function NoChatSelected({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
      <button
        onClick={onClick}
        className="md:hidden absolute top-2 left-1 border p-2 rounded-none bg-white shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>
      <FiMessageSquare className="text-6xl mb-4 text-gray-400" />
      <h2 className="text-xl font-semibold">No Chat Selected</h2>
      <p className="mt-2 text-sm text-gray-400">
        Select a person from the chat list to start a conversation.
      </p>
    </div>
  );
}

const ChatSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 px-4 py-2 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`p-3 rounded-lg ${
              i % 2 === 0 ? "bg-primary/20" : "bg-gray-200"
            } max-w-xs md:max-w-md w-1/4`}
          >
            <div className="h-4 bg-gray-300 rounded w-full mb-2" />
            <div className="h-3 bg-gray-300 rounded w-1/3 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};

const Chat = () => {
  const [messages, setMessage] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<ActiveUsers | undefined>(
    undefined
  );
  const [openGroup, setOpenGroup] = useState(false);
  const [groupDetail, setGroupDetail] = useState(false);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [openProfile, setOpenProfile] = useState(false);
  const { role } = useRole();
  const navigate = useNavigate();
  const { mode } = useRole();
  // socket
  const userId = Cookies.get("userId");
  const {
    isConnected,
    join,
    sendMessage,
    onReceiveMessage,
    setOnline,
    onUserOnline,
    emitTyping,
    joinGroup,
    onTyping,
    sendGroupMessage,
    onGroupMessage,
    emitGroupTyping,
    onGroupTyping,
  } = useSocket();
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(
    undefined
  );

  const [onlineUser, setOnlineUser] = useState("");

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const { data: activeUsers, isLoading } = useQuery({
    queryKey: ["activeUser"],
    queryFn: getActiveUsers,
  });

  const { data: previousChatUsers } = useQuery({
    queryKey: ["getPreviousChat"],
    queryFn: getPreviousChat,
  });

  const filteredUsers = activeUsers?.data?.filter(
    (user: ActiveUsers) =>
      user._id !== userId &&
      (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()))
  );

  const { data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  const { data: newMessages, isLoading: isMessageLoading } = useQuery({
    queryKey: ["newMessage", selectedUser?._id],
    queryFn: () => {
      if (selectedUser) {
        return getChatWithX(selectedUser._id);
      }
    },
    enabled: !!selectedUser?._id,
  });

  const { data: groupChats, isLoading: isGroupChatLoading } = useQuery({
    queryKey: ["groupChats", selectedGroup?._id],
    queryFn: () => {
      if (selectedGroup) {
        return getGroupChats(selectedGroup._id);
      }
    },
    enabled: !!selectedGroup?._id,
  });

  const handleSendMessage = () => {
    if (messages?.trim() && userId && selectedUser) {
      const message: any = {
        senderId: userId,
        content: messages.trim(),
        receiverId: selectedUser._id,
      };
      sendMessage(message);
    }
    if (messages?.trim() && userId && selectedGroup) {
      const groupMessage: any = {
        memberId: userId,
        content: messages.trim(),
        groupId: selectedGroup._id,
      };
      sendGroupMessage(groupMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const groupedMessages = newMessages
    ? groupMessagesByDate(newMessages.data)
    : {};

  const groupedGroupMessages = groupChats
    ? groupMessagesByDate(groupChats.data)
    : {};

  // socket related

  useEffect(() => {
    if (userId && isConnected) {
      setOnline(userId);
      console.log("setting user to online", userId);
    }
  }, [isConnected]); // Empty dependency array to run only once on mount

  useEffect(() => {
    onReceiveMessage(() => {
      queryClient.invalidateQueries({ queryKey: ["newMessage"], exact: false });

      setMessage("");
    });

    onUserOnline((data) => {
      console.log("online user listen", data);
      setOnlineUser(data.userId);
    });

    onGroupMessage(() => {
      queryClient.invalidateQueries(["groupChats"]);
      setMessage("");
    });
  }, [onReceiveMessage, onUserOnline, onGroupMessage]);

  useEffect(() => {
    onTyping((data) => {
      console.log("who is typing", data);
    });
    onGroupTyping((data) => {
      console.log("group is typing", data);
    });
  }, [onGroupTyping, onTyping]);

  // useEffect(() => {
  //   const handleTyping = (data: { senderId: string }) => {
  //     console.log("Typing event received:", data);
  //   };

  //   const cleanup = onTyping(handleTyping);

  //   return cleanup; // Ensures listener is removed on unmount
  // }, [onTyping]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [newMessages, groupChats]);

  const startChat = (user: ActiveUsers) => {
    join(user._id);
    setSelectedUser(user);
    setSelectedGroup(undefined);
  };
  const startGroupChat = (group: Group) => {
    setSelectedGroup(group);
    setSelectedUser(undefined);
    if (userId) {
      joinGroup({ groupId: group._id, memberId: userId });
    }
  };

  const handleClick = (userId: string, userName: string) => {
    // Replace spaces with underscores
    const formattedUserName = userName.replace(/\s+/g, "_");
    navigate(`/user/${formattedUserName}`, { state: { id: userId } });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-[calc(100vh-4.3rem)] max-h-screen overflow-hidden">
      {/* Sidebar - Contacts/Groups with toggle button */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block col-span-1 border-r flex flex-col h-full bg-white z-10 absolute md:relative w-full md:w-auto`}
      >
        <div className="flex flex-col gap-4 p-2 h-full">
          <Tabs tabs={["All", "Chat", "Group"]}>
            {/* All Tab */}
            <div className="h-full flex flex-col">
              <SearchBar
                className="w-full focus:outline-none p-2"
                search={search}
                setSearch={setSearch}
              />
              <div className="h-[calc(100vh-4rem)] mt-3 overflow-y-auto flex flex-col">
                <div className="space-y-2">
                  {isLoading
                    ? [...Array(7)].map((_, i) => <UserCardSkeleton key={i} />)
                    : filteredUsers?.map((user) => (
                        <UserCard
                          key={user._id}
                          user={user}
                          onlineUser={onlineUser}
                          // onClick={() => {
                          //   startChat(user);
                          //   setSidebarOpen(false);
                          // }}
                          onClick={() => handleClick(user._id, user.name)}
                          isSelected={user._id === selectedUser?._id}
                        />
                      ))}
                </div>
              </div>
            </div>

            {/* Chat Tab */}
            <div className="h-full mt-3 overflow-y-auto flex flex-col">
              <div className="space-y-2">
                {previousChatUsers?.data.map((user) => (
                  <UserCard
                    key={user.userId}
                    user={{
                      _id: user.userId,
                      name: user.name,
                      email: user.email,
                      role: "user",
                    }}
                    onlineUser={onlineUser}
                    onClick={() => {
                      startChat({
                        _id: user.userId,
                        name: user.name,
                        email: user.email,
                        role: "user",
                      });
                      setSidebarOpen(false);
                    }}
                    isSelected={user.userId === selectedUser?._id}
                  />
                ))}
              </div>
            </div>

            {/* Group Tab */}
            <div className="h-full flex flex-col">
              <div className="flex justify-center p-2">
                <Button
                  onClick={() => setOpenGroup(true)}
                  className={`w-full  ${
                    mode === "formal" ? "border-primary" : "border-primary2"
                  }`}
                  variant="outline"
                >
                  New Group
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto mt-2 space-y-2">
                {groups?.data.map((group) => (
                  <GroupCard
                    key={group._id}
                    group={group}
                    onClick={() => {
                      startGroupChat(group);
                      setSidebarOpen(false); // Close sidebar on mobile when group is selected
                    }}
                    isSelected={group._id === selectedGroup?._id}
                  />
                ))}
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`col-span-1 md:col-span-3 flex flex-col h-full overflow-hidden bg-gray-50 ${
          !sidebarOpen ? "block" : "hidden md:block"
        }`}
      >
        {/* Sidebar toggle button (visible on mobile) */}

        {selectedGroup || selectedUser ? (
          <div className="flex flex-col  h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] overflow-hidden">
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2 rounded-none bg-white shadow-md"
                >
                  {sidebarOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
                <div
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => {
                    if (selectedGroup) {
                      setGroupDetail(true);
                    }
                    if (selectedUser && role === "user") {
                      setOpenProfile(true);
                    }
                  }}
                >
                  <div className="relative ">
                    <img
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                      src={selectedGroup ? user : user}
                      alt=""
                    />
                    {!selectedGroup && (
                      <div
                        className={`w-3 h-3 absolute right-0 bottom-0 ${
                          onlineUser === selectedUser?._id
                            ? "bg-green-500"
                            : "bg-gray-400"
                        } rounded-full border-2 border-white`}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {selectedGroup
                        ? selectedGroup.groupName
                        : selectedUser?.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {selectedGroup
                        ? `${selectedGroup.members.length} members`
                        : selectedUser?.role}
                    </p>
                  </div>
                </div>
              </div>
              <div>{/* <ChatDetailDropdown /> */}</div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              ref={chatContainerRef}
            >
              {/* Single Chat Messages */}
              {selectedUser && (
                <>
                  {isMessageLoading ? (
                    <ChatSkeleton />
                  ) : (
                    Object.entries(groupedMessages).map(
                      ([dateLabel, messages]) => (
                        <div key={dateLabel}>
                          <div className="text-center my-4 text-sm text-gray-500">
                            {dateLabel}
                          </div>
                          {messages.map((message) => (
                            <div
                              key={message._id}
                              className={`flex ${
                                message.sender._id === userId
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`p-3 my-2 max-w-xs md:max-w-md rounded-lg ${
                                  message.sender._id === userId
                                    ? mode === "formal"
                                      ? "bg-primary text-white"
                                      : "bg-primary2 text-white"
                                    : "bg-gray-200 text-black"
                                }`}
                              >
                                <p>{message.content}</p>
                                <div className="flex justify-end w-full">
                                  <p
                                    className={`text-xs ${
                                      message.sender._id === userId
                                        ? "text-white"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {formatMessageTime(message.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    )
                  )}
                </>
              )}

              {/* Group Chat Messages */}
              {selectedGroup && (
                <>
                  {isGroupChatLoading ? (
                    <ChatSkeleton />
                  ) : (
                    Object.entries(groupedGroupMessages).map(
                      ([dateLabel, messages]) => (
                        <div key={dateLabel}>
                          <div className="text-center my-4 text-sm text-gray-500">
                            {dateLabel}
                          </div>
                          {messages.map((message) => (
                            <div
                              key={message._id}
                              className={`flex ${
                                message.memberId._id === userId
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`p-3 my-1 max-w-xs md:max-w-md rounded-lg ${
                                  message.memberId._id === userId
                                    ? mode === "formal"
                                      ? "bg-primary text-white"
                                      : "bg-primary2 text-white"
                                    : "bg-gray-200 text-black"
                                }`}
                              >
                                {/* Show sender name in group chats */}
                                {message.memberId._id !== userId && (
                                  <p className="font-semibold text-sm mb-1">
                                    {message.memberId.name}
                                  </p>
                                )}
                                <p>{message.content}</p>
                                <div className="flex justify-end w-full">
                                  <p
                                    className={`text-xs ${
                                      message.memberId._id === userId
                                        ? "text-white"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {formatMessageTime(message.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    )
                  )}
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="p-3  flex-shrink-0 border-t bg-white">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="text-gray-500" />
                </Button>
                <Input
                  className="flex-1"
                  value={messages}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (userId && selectedUser?._id) {
                      emitTyping({
                        senderId: userId,
                        receiverId: selectedUser._id,
                      });
                      if (selectedGroup?._id && userId) {
                        emitGroupTyping({
                          memberId: userId,
                          groupId: selectedGroup._id,
                        });
                      }
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                />
                <Button variant="ghost" size="icon" onClick={handleSendMessage}>
                  <Send className="text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full  flex items-center justify-center">
            <NoChatSelected onClick={() => setSidebarOpen(!sidebarOpen)} />
          </div>
        )}
      </div>
      <Dialog.Root open={openGroup} onOpenChange={setOpenGroup}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg flex flex-col gap-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Add Group
            </Dialog.Title>
            <Dialog.Description></Dialog.Description>
            <AddGroup onSuccess={() => setOpenGroup(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <GroupDetail
        userGroup={selectedGroup}
        groupDetail={groupDetail}
        setGroupDetail={setGroupDetail}
      />
      <UserProfile
        open={openProfile}
        setOpen={setOpenProfile}
        id={selectedUser?._id}
        showShare={true}
      />
    </div>
  );
};

export default Chat;
