import express from "express";
import rateLimit from "express-rate-limit";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// 🔐 Rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: "Too many attempts. Try again later.",
});

// REGISTER
router.post("/register", authLimiter, register);

// LOGIN
router.post("/login", authLimiter, login);

export default router;
