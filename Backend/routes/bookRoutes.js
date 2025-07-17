import express from "express";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  searchBook,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/cloudinaryMiddleware.js";

const router = express.Router();

router.get("/", getBooks);
router.post("/", protect, upload.single("image"), createBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", deleteBook);
router.get("/search", searchBook);

export default router;
