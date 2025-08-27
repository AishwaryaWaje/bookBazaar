import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
/**
 * Express application instance.
 * @type {express.Application}
 */
const app = express();
/**
 * HTTP server instance created from the Express app.
 * @type {http.Server}
 */
const server = http.createServer(app);

/**
 * Configures CORS for the Express application.
 * Allows requests from "https://book-bazaar-eight.vercel.app" with credentials.
 */
app.use(
  cors({
    origin: "https://book-bazaar-eight.vercel.app",
    credentials: true,
  })
);
/** Parses cookies attached to the request object. */
app.use(cookieParser());
/** Parses incoming JSON requests. */
app.use(express.json());

/**
 * Middleware for logging incoming requests.
 * Logs the HTTP method and original URL of each request.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

/** Connects to the MongoDB database. */
connectDB();

// app.get("/", (req, res) => res.send("API Working!"));
/** API routes for authentication. */
app.use("/api/auth", authRoutes);
/** API routes for book management. */
app.use("/api/books", bookRoutes);
/** API routes for user wishlists. */
app.use("/api/wishlist", wishlistRoutes);
/** API routes for order management. */
app.use("/api/orders", orderRoutes);
/** API routes for conversations. */
app.use("/api/conversations", conversationRoutes);
/** API routes for admin functionalities. */
app.use("/api/admin", adminRoutes);

/**
 * Centralized error handling middleware.
 * Catches and processes errors, sending a standardized error response.
 * @param {Error} err - The error object.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "An unexpected error occurred.",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

/**
 * Socket.IO server instance.
 * @type {Server}
 */
const io = new Server(server, {
  cors: {
    origin: "https://book-bazaar-eight.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
/** Sets the Socket.IO instance on the Express app for global access. */
app.set("io", io);

/**
 * Handles Socket.IO connections.
 * @param {Socket} socket - The connected socket instance.
 */
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

/**
 * The port on which the server will listen.
 * @type {number}
 */
const PORT = process.env.PORT || 5000;
/**
 * Starts the HTTP server and listens for incoming requests.
 */
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
