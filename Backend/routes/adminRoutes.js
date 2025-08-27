import express from "express";
import {
  getAllBooks,
  deleteBookByAdmin,
  getAnalytics,
  updateBookByAdmin,
} from "../controllers/adminController.js";
import { adminLogin, adminLogout } from "../controllers/adminAuthController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin Authentication
 *   description: API for admin authentication operations
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       401:
 *         description: Access denied or Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", adminLogin);

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     summary: Admin logout
 *     tags: [Admin Authentication]
 *     responses:
 *       200:
 *         description: Admin logged out successfully
 */
router.post("/logout", adminLogout);

/**
 * @swagger
 * tags:
 *   name: Admin Management
 *   description: API for admin-specific management operations
 */

/**
 * @swagger
 * /api/admin/books:
 *   get:
 *     summary: Get all books (Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all books
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       403:
 *         description: Access denied, not an admin
 *       500:
 *         description: Server error
 */
router.get("/books", protect, isAdmin, getAllBooks);

/**
 * @swagger
 * /api/admin/books/{id}:
 *   delete:
 *     summary: Delete a book by ID (Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to delete
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       403:
 *         description: Access denied, not an admin
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.delete("/books/:id", protect, isAdmin, deleteBookByAdmin);

/**
 * @swagger
 * /api/admin/books/{id}:
 *   put:
 *     summary: Update a book by ID (Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genere:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       403:
 *         description: Access denied, not an admin
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.put("/books/:id", protect, isAdmin, updateBookByAdmin);

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get analytics data (Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       403:
 *         description: Access denied, not an admin
 *       500:
 *         description: Server error
 */
router.get("/analytics", protect, isAdmin, getAnalytics);

export default router;
