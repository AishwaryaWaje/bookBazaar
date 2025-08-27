import express from "express";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  searchBook,
  getMyBooks,
  getGenres,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/cloudinaryMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for book listings and management
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books with optional filters and pagination
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by book title (case-insensitive)
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by book author (case-insensitive)
 *       - in: query
 *         name: genere
 *         schema:
 *           type: string
 *         description: Filter by book genre
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: ["Brand New", "Like New", "Good", "Acceptable", "Worn", "Damaged"]
 *         description: Filter by book condition
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Filter by minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Filter by maximum price
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 28
 *         description: Number of books per page
 *     responses:
 *       200:
 *         description: A list of books with pagination info
 *       500:
 *         description: Server error
 */
router.get("/", getBooks);

/**
 * @swagger
 * /api/books/genres:
 *   get:
 *     summary: Get all distinct book genres
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: An array of unique book genres
 *       500:
 *         description: Server error
 */
router.get("/genres", getGenres);

/**
 * @swagger
 * /api/books/mine:
 *   get:
 *     summary: Get books listed by the authenticated user
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of books owned by the current user
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Server error
 */
router.get("/mine", protect, getMyBooks);

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search books by title, author, or genre
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query string
 *     responses:
 *       200:
 *         description: A list of matching books
 *       500:
 *         description: Server error
 */
router.get("/search", searchBook);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book listing
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - genere
 *               - condition
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genere:
 *                 type: string
 *               condition:
 *                 type: string
 *                 enum: ["Brand New", "Like New", "Good", "Acceptable", "Worn", "Damaged"]
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Book created successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Failed to create book
 */
router.post("/", protect, upload.single("image"), createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update an existing book listing
 *     tags: [Books]
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
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genere:
 *                 type: string
 *               condition:
 *                 type: string
 *                 enum: ["Brand New", "Like New", "Good", "Acceptable", "Worn", "Damaged"]
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       403:
 *         description: Not authorized to update this book
 *       404:
 *         description: Book not found
 *       500:
 *         description: Failed to update book
 */
router.put("/:id", protect, upload.single("image"), updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book listing
 *     tags: [Books]
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
 *         description: Not authorized to delete this book
 *       404:
 *         description: Book not found
 *       500:
 *         description: Failed to delete book
 */
router.delete("/:id", protect, deleteBook);

export default router;
