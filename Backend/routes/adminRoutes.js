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

router.post("/login", adminLogin);
router.post("/logout", adminLogout);

router.get("/books", protect, isAdmin, getAllBooks);
router.delete("/books/:id", protect, isAdmin, deleteBookByAdmin);
router.put("/books/:id", protect, isAdmin, updateBookByAdmin);
router.get("/analytics", protect, isAdmin, getAnalytics);

export default router;
