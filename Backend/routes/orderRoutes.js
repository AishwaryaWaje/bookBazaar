import express from "express";
import { isAdmin, protect } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing user orders
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order for a book
 *     tags: [Orders]
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
 *                 description: The ID of the book to order
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Book not found, user owns the book, or book already ordered
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Failed to place order
 */
router.post("/", protect, placeOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user's orders
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Failed to fetch orders
 */
router.get("/", protect, getMyOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update the delivery status of an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to update
 *       - in: body
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["ORDER_PLACED", "ITEM_COLLECTED", "DELIVERED"]
 *         description: The new status of the order
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       403:
 *         description: Access denied, not an admin
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to update order status
 */
router.put("/:id/status", protect, isAdmin, updateOrderStatus);

/**
 * @swagger
 * /api/orders/all:
 *   get:
 *     summary: Get all orders in the system (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all orders
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       403:
 *         description: Access denied, not an admin
 *       500:
 *         description: Failed to fetch all orders
 */
router.get("/all", protect, isAdmin, getAllOrders);

export default router;
