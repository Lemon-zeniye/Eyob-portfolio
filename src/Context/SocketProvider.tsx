import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext"; // Assuming you have an auth context
import { getUserFromToken } from "@/lib/utils";
import Cookies from "js-cookie";
// Define types for socket events and payloads
type MessagePayload = {
  senderId: string;
  receiverId: string;
  content: string;
};

type GroupMessagePayload = {
  groupId: string;
  memberId: string;
  content: string;
};

type TypingPayload = {
  senderId: string;
  receiverId: string;
};

type GroupTypingPayload = {
  groupId: string;
  memberId: string;
};

type JoinGroupPayload = {
  groupId: string;
  memberId: string;
};

type UserStatusPayload = {
  userId: string;
  status: "online" | "offline";
};

// Define the context value type
interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  sendMessage: (receiverId: string, content: string) => void;
  sendGroupMessage: (groupId: string, content: string) => void;
  notifyTyping: (receiverId: string) => void;
  notifyGroupTyping: (groupId: string) => void;
  subscribe: <T>(event: string, callback: (data: T) => void) => void;
  unsubscribe: (event: string, callback?: (...args: any[]) => void) => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const tocken = Cookies.get("accessToken");
  const user = getUserFromToken(tocken ?? null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const newSocket = io("http://194.5.159.228:3002/" as string, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
      query: {
        userId: user.id,
      },
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");

      // Join user's personal room
      newSocket.emit("join", user.id);

      // Notify server user is online
      newSocket.emit("online", user.id);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");

      // Notify server user is offline
      newSocket.emit("offline", user.id);
    });

    // Cleanup on unmount
    return () => {
      if (newSocket.connected) {
        newSocket.emit("offline", user.id);
        newSocket.disconnect();
      }
    };
  }, [user]);

  // Join a group room
  const joinGroup = (groupId: string) => {
    if (socket && isConnected && user) {
      socket.emit("join_group", {
        groupId,
        memberId: user.id,
      } as JoinGroupPayload);
    }
  };

  // Leave a group room
  const leaveGroup = (groupId: string) => {
    if (socket && isConnected && user) {
      socket.emit("leave_group", {
        groupId,
        memberId: user.id,
      } as JoinGroupPayload);
    }
  };

  // Send private message
  const sendMessage = (receiverId: string, content: string) => {
    if (socket && isConnected && user) {
      socket.emit("send_message", {
        senderId: user.id,
        receiverId,
        content,
      } as MessagePayload);
    }
  };

  // Send group message
  const sendGroupMessage = (groupId: string, content: string) => {
    if (socket && isConnected && user) {
      socket.emit("send_group_message", {
        groupId,
        memberId: user.id,
        content,
      } as GroupMessagePayload);
    }
  };

  // Notify typing in private chat
  const notifyTyping = (receiverId: string) => {
    if (socket && isConnected && user) {
      socket.emit("typing", {
        senderId: user.id,
        receiverId,
      } as TypingPayload);
    }
  };

  // Notify typing in group chat
  const notifyGroupTyping = (groupId: string) => {
    if (socket && isConnected && user) {
      socket.emit("group_typing", {
        groupId,
        memberId: user.id,
      } as GroupTypingPayload);
    }
  };

  // Subscribe to an event
  const subscribe = <T,>(event: string, callback: (data: T) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  // Unsubscribe from an event
  const unsubscribe = (event: string, callback?: (...args: any[]) => void) => {
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  };

  const value: SocketContextValue = {
    socket,
    isConnected,
    joinGroup,
    leaveGroup,
    sendMessage,
    sendGroupMessage,
    notifyTyping,
    notifyGroupTyping,
    subscribe,
    unsubscribe,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
