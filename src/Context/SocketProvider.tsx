// src/context/SocketContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

// ==== Interfaces ==== //
interface MessagePayload {
  senderId: string;
  receiverId: string;
  content: string;
}

interface GroupMessagePayload {
  memberId: string;
  groupId: string;
  content: string;
}

interface UserStatusPayload {
  userId: string;
  status: "online" | "offline";
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  join: (userId: string) => void;
  sendMessage: (data: MessagePayload) => void;
  joinGroup: (data: { groupId: string; memberId: string }) => void;
  sendGroupMessage: (data: GroupMessagePayload) => void;
  leaveGroup: (data: { groupId: string; memberId: string }) => void;
  setOnline: (userId: string) => void;
  setOffline: (userId: string) => void;
  onReceiveMessage: (cb: (data: MessagePayload) => void) => void;
  onGroupMessage: (cb: (data: GroupMessagePayload) => void) => void;
  onUserJoinedGroup: (cb: (memberId: string) => void) => void;
  onUserLeftGroup: (cb: (memberId: string) => void) => void;
  onTyping: (cb: (data: { senderId: string }) => void) => void;
  onGroupTyping: (cb: (data: { memberId: string }) => void) => void;
  onUserOnline: (cb: (data: UserStatusPayload) => void) => void;
  onUserOffline: (cb: (data: UserStatusPayload) => void) => void;
  emitTyping: (data: { senderId: string; receiverId: string }) => void;
  emitGroupTyping: (data: { memberId: string; groupId: string }) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io("wss://awema.co", {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const join = (userId: string) => {
    socketRef.current?.emit("join", userId);
    console.log("Joined user room:", userId);
  };

  const sendMessage = (data: MessagePayload) => {
    socketRef.current?.emit("send_message", data);
  };

  const joinGroup = (data: { groupId: string; memberId: string }) => {
    socketRef.current?.emit("join_group", data);
  };

  const sendGroupMessage = (data: GroupMessagePayload) => {
    socketRef.current?.emit("send_group_message", data);
  };

  const leaveGroup = (data: { groupId: string; memberId: string }) => {
    socketRef.current?.emit("leave_group", data);
  };

  const setOnline = (userId: string) => {
    socketRef.current?.emit("online", userId);
  };

  const setOffline = (userId: string) => {
    socketRef.current?.emit("offline", userId);
  };

  const onReceiveMessage = (cb: (data: MessagePayload) => void) => {
    socketRef.current?.on("receive_message", cb);
  };

  const onGroupMessage = (cb: (data: GroupMessagePayload) => void) => {
    socketRef.current?.on("receive_message2", cb);
  };

  const onUserJoinedGroup = (cb: (memberId: string) => void) => {
    socketRef.current?.on("user-joined", cb);
  };

  const onUserLeftGroup = (cb: (memberId: string) => void) => {
    socketRef.current?.on("user_left", cb);
  };

  // const onTyping = (cb: (data: { senderId: string }) => void) => {
  //   socketRef.current?.on("typing", cb);
  // };

  const onTyping = (callback: (data: { senderId: string }) => void) => {
    socketRef.current?.on("typing", callback);
    return () => {
      socketRef.current?.off("typing", callback); // Cleanup
    };
  };

  const onGroupTyping = (cb: (data: { memberId: string }) => void) => {
    socketRef.current?.on("group_typing", cb);
  };

  // const onUserOnline = (cb: (data: UserStatusPayload) => void) => {
  //   socketRef.current?.on("userOnline", cb);
  // };

  const onUserOnline = (cb: (data: UserStatusPayload) => void) => {
    socketRef.current?.on("userOnline", cb);
    return () => {
      socketRef.current?.off("userOnline", cb);
    };
  };

  const onUserOffline = (cb: (data: UserStatusPayload) => void) => {
    socketRef.current?.on("userOffline", cb);
  };

  const emitTyping = (data: { senderId: string; receiverId: string }) => {
    socketRef.current?.emit("typing", data);
  };

  const emitGroupTyping = (data: { memberId: string; groupId: string }) => {
    socketRef.current?.emit("group_typing", data);
  };

  const value: SocketContextType = {
    socket: socketRef.current,
    isConnected,
    join,
    sendMessage,
    joinGroup,
    sendGroupMessage,
    leaveGroup,
    setOnline,
    setOffline,
    onReceiveMessage,
    onGroupMessage,
    onUserJoinedGroup,
    onUserLeftGroup,
    onTyping,
    onGroupTyping,
    onUserOnline,
    onUserOffline,
    emitTyping,
    emitGroupTyping,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

// Custom hook
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
