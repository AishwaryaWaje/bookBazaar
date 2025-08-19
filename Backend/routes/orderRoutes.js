import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { placeOrder, getMyOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.post("/", protect, getMyOrders);
router.put("/:id/status", protect, updateOrderStatus);

export default router;
