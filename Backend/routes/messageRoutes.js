import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMessage,
  getOrCreateConversation,
  getUserConversation,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/conversation", protect, getOrCreateConversation);
router.get("/conversations", protect, getUserConversation);
router.post("/", protect, sendMessage);
router.get("/:conversationId", protect, getMessage);

export default router;
