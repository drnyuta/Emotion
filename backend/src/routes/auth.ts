import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

// POST /auth/register
router.post("/register", AuthController.register);

// POST /auth/login
router.post("/login", AuthController.login);

// POST /auth/forgot-password
router.post("/forgot-password", AuthController.forgotPassword);

// POST /auth/reset-password
router.post("/reset-password", AuthController.resetPassword);

// GET /auth/verify
router.get("/verify", AuthController.verifyToken);

export default router;