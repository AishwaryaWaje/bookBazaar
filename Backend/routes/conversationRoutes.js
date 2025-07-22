import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getOrCreateConversation,
  getUserConversations,
} from "../controllers/conversationController.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();
router.post("/", protect, getOrCreateConversation);
router.get("/", protect, getUserConversations);
router.get("/user", protect, getUserConversations);
router.get("/:conversationId/messages", protect, getMessages);
router.post("/:conversationId/messages", protect, sendMessage);

export default router;
