// src/socket.ts
import { io } from "socket.io-client";

const socket = io("http://194.5.159.228:3002/", {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
