import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
