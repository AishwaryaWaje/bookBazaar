import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import WishlistRoutes from "./routes/wishlistRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
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
app.use("/api/messages", messageRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Listening on ", port);
});
