import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication and profile management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or invalid input
 *       500:
 *         description: Server error
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
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
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Server error
 */
router.get("/profile", protect, getProfile);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       400:
 *         description: Invalid email or too many attempts
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid request or OTP not verified
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/reset-password", resetPassword);

export default router;
