import { Router } from "express"
import { loginValidator, registerValidator } from "../Validators/auth.validator.js";
import validate from "../middlewares/validate.js";
import {  getMe, login, logout, refreshToken, register, resendEmail, verifyEmail } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const authRouter = Router();
authRouter.post("/register", registerValidator, validate, register);
authRouter.post("/login", loginValidator, validate, login);
authRouter.get("/verify-email", verifyEmail);
authRouter.get("/me", authMiddleware, getMe);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/refresh", refreshToken);
authRouter.post("/resendEmail", resendEmail);
// authRouter.post("/login", loginValidator, validate, l);
export default authRouter;