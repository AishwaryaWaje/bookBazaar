import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: API for managing user wishlists
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get the authenticated user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of books in the user's wishlist
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Failed to fetch wishlist
 */
router.get("/", protect, getWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add a book to the authenticated user's wishlist
 *     tags: [Wishlist]
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
 *                 description: The ID of the book to add to the wishlist
 *     responses:
 *       201:
 *         description: Book added to wishlist successfully
 *       400:
 *         description: Book already in wishlist or not found
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Failed to add to wishlist
 */
router.post("/", protect, addToWishlist);

/**
 * @swagger
 * /api/wishlist/{bookId}:
 *   delete:
 *     summary: Remove a book from the authenticated user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to remove from the wishlist
 *     responses:
 *       200:
 *         description: Book removed from wishlist successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Failed to remove book from wishlist
 */
router.delete("/:bookId", protect, removeFromWishlist);

export default router;
