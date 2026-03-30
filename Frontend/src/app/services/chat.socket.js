import { io } from "socket.io-client";

// Socket connects to server root, not the /api path
const RAW_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const SOCKET_URL = RAW_URL.replace(/\/api\/?$/, "");

let socket;

export const initiateSocketConnection = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    console.log("Socket connection initialized");
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket is not initialized. Call initiateSocketConnection first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
