import { io } from "socket.io-client";

// Ensure you use the correct backend URL
const socket = io("http://localhost:8000", {
  transports: ["websocket"], // Use WebSocket only
  reconnectionAttempts: 5,  // Retry 5 times before failing
  reconnectionDelay: 1000,  // Wait 1s before retrying
});

export default socket;
