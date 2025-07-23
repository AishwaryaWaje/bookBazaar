import express from "express";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  searchBook,
  getMyBooks,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/cloudinaryMiddleware.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/mine", protect, getMyBooks);
router.get("/search", searchBook);
router.post("/", protect, upload.single("image"), createBook);
router.put("/:id", protect, upload.single("image"), updateBook);
router.delete("/:id", protect, deleteBook);

export default router;
