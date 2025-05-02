import { SearchBar } from "@/components/SearchBar/SearchBar";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import user from "../assets/user.jpg";
import ChatDetailDropdown from "@/components/Chat/ChatDetailDropdown";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import Tabs from "@/components/Tabs/TabsLine";
import { useQuery } from "react-query";
import { getActiveUsers, getChatWithX } from "@/Api/chat.api";
import UserCard from "@/components/Chat/ActiveUsers";
import { ActiveUsers } from "@/Types/chat.type";
import { useSocket } from "../Context/SocketProvider";
import { getUserFromToken } from "@/lib/utils";
import Cookies from "js-cookie";

// const ChatUrl = [
//   {
//     imgUrl: "",
//     name: "Kebede Tasew",
//     lastchat: "Hey man give me my ",
//     date: "20/10/2024",
//     seen: false,
//   },
//   // Add more chat list items as needed
// ];

interface Message {
  id: number;
  content: string;
  sender: "me" | "other";
  timestamp: string;
}

const Chat = () => {
  // const [type, setType] = useState<ChatType>("all");
  const [messages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<ActiveUsers | undefined>(
    undefined
  );
  const userInfo = getUserFromToken(Cookies.get("accessToken") ?? null);
  const { join, sendMessage, onReceiveMessage, setOnline } = useSocket();

  const { data: activeUsers } = useQuery({
    queryKey: ["activeUser"],
    queryFn: getActiveUsers,
  });

  const { data: newMessages, refetch } = useQuery({
    queryKey: ["newMessage", userInfo?.id],
    queryFn: () => {
      if (userInfo?.id) {
        return getChatWithX(userInfo.id);
      }
    },
    enabled: !!userInfo?.id,
  });

  console.log("message", newMessages);

  useEffect(() => {
    if (selectedUser?._id) {
      refetch();
    }
  }, [selectedUser?._id]);

  const handleSendMessage = () => {
    if (newMessage?.trim() && userInfo?.id && selectedUser) {
      const message: any = {
        senderId: userInfo.id,
        content: newMessage.trim(),
        receiverId: selectedUser._id,
      };
      sendMessage(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  useEffect(() => {
    if (userInfo?.id) {
      const userId = userInfo.id;
      join(userId);
      setOnline(userId);
    }

    onReceiveMessage((data) => {
      console.log("Message received:", data);
    });
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startChat = (user: ActiveUsers) => {
    setSelectedUser(user);
    // join(user._id);
  };

  return (
    <div className="flex flex-row justify-between pr-4">
      <div className="w-1/5 flex px-1 h-[90vh] flex-col gap-5">
        <div className="flex flex-col gap-5">
          {/* <ChatTab type={type} setType={setType} /> */}

          <div className="">
            <Tabs tabs={["All", "Chat", "Group"]}>
              <div>
                <SearchBar
                  className="focus:outline-none"
                  search=""
                  setSearch={() => {}}
                />
                <div className="flex flex-col mt-4 gap-3 h-[80vh] overflow-y-scroll">
                  {activeUsers?.data.map((user) => (
                    <UserCard key={user._id} user={user} onClick={startChat} />
                  ))}
                </div>
              </div>
              <div>chat</div>
              <div>Group</div>
            </Tabs>
          </div>
        </div>
      </div>

      <Card className="w-4/5 h-[90vh] flex flex-col px-4 py-4 gap-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-3 items-center relative">
            <img className="w-12 h-12 rounded-full" src={user} alt="" />
            <div className="w-3 h-3 absolute left-10 bottom-1 bg-green-500 rounded-full" />
            <div className="flex flex-col gap-1">
              <p className="font-semibold">{selectedUser?.name}</p>
              <p className="text-[#7a7a7a]">{selectedUser?.role}</p>
            </div>
          </div>
          <ChatDetailDropdown />
        </div>

        <div
          className="w-full overflow-y-scroll h-[72vh] pr-2 scroll-smooth flex flex-col gap-3"
          ref={chatContainerRef}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 max-w-xs rounded-lg ${
                  message.sender === "me"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p>{message.content}</p>
                <div className="flex items-end justify-end w-full">
                  <p
                    className={`text-xs ${
                      message.sender === "me" ? "text-white" : "text-black"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-row justify-between items-center">
          <Button variant={"ghost"}>
            <Paperclip className="text-gray-500" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <Button variant={"ghost"} onClick={handleSendMessage}>
            <Send className="text-gray-500" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
