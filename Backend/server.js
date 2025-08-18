import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "https://book-bazaar-eight.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

connectDB();

//app.get("/", (req, res) => res.send("API Working!"));
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/admin", adminRoutes);

const io = new Server(server, {
  cors: {
    origin: "https://book-bazaar-eight.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_conversation", (conversationId) => {
    if (conversationId) {
      socket.join(conversationId);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
