import express from "express";
import { register, login, logout, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/verify", protect, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user.userId,
      isAdmin: req.user.isAdmin,
    },
  });
});

router.get("/profile", protect, getProfile);

router.post("/logout", logout);

export default router;
