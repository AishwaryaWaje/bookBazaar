import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getOrCreateConversation,
  getUserConversations,
  deleteConversation,
} from "../controllers/conversationController.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: API for managing user conversations and messages
 */

/**
 * @swagger
 * /api/conversations:
 *   post:
 *     summary: Get or create a conversation for a specific book
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: The ID of the book to start/find a conversation about
 *     responses:
 *       200:
 *         description: Returns an existing or newly created conversation
 *       400:
 *         description: Book ID is required or user listed this book
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.post("/", protect, getOrCreateConversation);

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: Get all conversations for the authenticated user
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of conversations
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Failed to fetch conversations
 */
router.get("/", protect, getUserConversations);

/**
 * @swagger
 * /api/conversations/user:
 *   get:
 *     summary: Get all conversations for the authenticated user (alias for /api/conversations)
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of conversations
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Failed to fetch conversations
 */
router.get("/user", protect, getUserConversations);

/**
 * @swagger
 * /api/conversations/{id}:
 *   delete:
 *     summary: Delete a conversation and its messages
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation to delete
 *     responses:
 *       200:
 *         description: Conversation deleted successfully
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized for this conversation
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Failed to delete conversation
 */
router.delete("/:id", protect, deleteConversation);

/**
 * @swagger
 * /api/conversations/{conversationId}/messages:
 *   get:
 *     summary: Get messages for a specific conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation to retrieve messages from
 *     responses:
 *       200:
 *         description: A list of messages in the conversation
 *       401:
 *         description: User not authenticated or unauthorized
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Failed to fetch messages
 */
router.get("/:conversationId/messages", protect, getMessages);

/**
 * @swagger
 * /api/conversations/{conversationId}/messages:
 *   post:
 *     summary: Send a message in a conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation to send a message to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The message content
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Message text is required
 *       401:
 *         description: User not authenticated or unauthorized
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Failed to send message
 */
router.post("/:conversationId/messages", protect, sendMessage);

export default router;
