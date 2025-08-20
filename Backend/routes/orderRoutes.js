import express from "express";
import { isAdmin, protect } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getMyOrders);
router.put("/:id/status", protect, isAdmin, updateOrderStatus);
router.get("/", protect, isAdmin, getAllOrders);

export default router;
