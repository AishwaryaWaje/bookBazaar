import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import WishlistRoutes from "./routes/wishlistRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

connectDB();
//app.get("/", (req, res) => res.send("API Working!"));
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/wishlist", WishlistRoutes);
app.use("/api/conversations", conversationRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("Listening on ", port);
});
