import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    console.log("Server disconnected. Attempting to reconnect...");
    let attempts = 0;
    const reconnectInterval = setInterval(() => {
      attempts++;
      if (attempts > 5) {
        clearInterval(reconnectInterval);
        console.error("Failed to reconnect after multiple attempts.");
        return;
      }
      const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
      console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);
      setTimeout(() => {
        socket.connect();
      }, delay);
    }, 1000);
  } else {
    console.log("Socket disconnected unexpectedly. Attempting to reconnect...");
    socket.connect();
  }
});

socket.on("connect", () => {
  console.log("Socket reconnected successfully!");
});

export default socket;
