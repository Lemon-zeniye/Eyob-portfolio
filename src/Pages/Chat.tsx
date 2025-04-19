import { ChatTab } from "@/components/Chat/ChatTabs"
import PersonalChat from "@/components/Chat/PersonalChat"
import { SearchBar } from "@/components/SearchBar/SearchBar"
import { ChatType } from "@/components/Types"
import { Card } from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"
import user from "../assets/user.jpg"
import ChatDetailDropdown from "@/components/Chat/ChatDetailDropdown"
import { Button } from "@/components/ui/button"
import { Paperclip, Send } from "lucide-react"
import { Input } from "@/components/ui/input"

const ChatUrl = [
  {
    imgUrl: "",
    name: "Kebede Tasew",
    lastchat: "Hey man give me my ",
    date: "20/10/2024",
    seen: false,
  },
  // Add more chat list items as needed
]

interface Message {
  id: number
  content: string
  sender: "me" | "other"
  timestamp: string
}

const Chat = () => {
  const [type, setType] = useState<ChatType>("all")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState<string>("")
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    const message: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: "me",
      timestamp,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage()
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-row justify-between pr-4">
      <div className="w-1/5 flex px-1 h-[90vh] flex-col gap-5">
        <div className="flex flex-col gap-5">
          <ChatTab type={type} setType={setType} />
          <SearchBar search="" setSearch={() => {}} />
        </div>
        <div className="flex flex-col gap-3 h-[80vh] overflow-y-scroll">
          {ChatUrl.map((item, index) => (
            <PersonalChat
              key={index}
              imgUrl={item.imgUrl}
              name={item.name}
              lastchat={item.lastchat}
              date={item.date}
              seen={item.seen}
              selected={false}
              onclick={() => {
                console.log("Chat clicked")
              }}
            />
          ))}
        </div>
      </div>

      <Card className="w-4/5 h-[90vh] flex flex-col px-4 py-4 gap-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-3 items-center relative">
            <img className="w-12 h-12 rounded-full" src={user} alt="" />
            <div className="w-3 h-3 absolute left-10 bottom-1 bg-green-500 rounded-full" />
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Kebede Tassew</p>
              <p className="text-[#7a7a7a]">UI/UX Designer</p>
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
            <Paperclip className="text-[#666666]" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <Button variant={"ghost"} onClick={handleSendMessage}>
            <Send className="text-[#666666]" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Chat
