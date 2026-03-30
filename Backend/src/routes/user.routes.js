import express from "express";
import { updateUserSession } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/update-session", authMiddleware, updateUserSession);

export default router;
