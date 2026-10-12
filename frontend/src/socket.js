// src/socket.js - Shared Socket.io Instance
import { io } from "socket.io-client";

// ← Auto-detect environment like api.js does
const getSocketUrl = () => {
  // Local development
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }
  
  // Production (Vercel)
  if (window.location.hostname.includes("vercel.app")) {
    return "https://assignment-submission-system-utbj.onrender.com";
  }
  
  // Fallback
  return "http://localhost:5000";
};

const SOCKET_URL = getSocketUrl();
console.log("🔌 Socket URL:", SOCKET_URL);

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

export default socket;