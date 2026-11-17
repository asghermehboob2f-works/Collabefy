import { Router } from "express";
import { register, login, refresh, logout, getMe, updateProfile } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);
router.patch("/profile", requireAuth, updateProfile);

export default router;
