import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import authRouter from "./routes/auth.routes.js";
import gameRouter from "./routes/game.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

// 🔧 Middlewares
app.use(cookieParser());
app.use(express.json());

// ✅ CORS FIX (production ready)
app.use(cors({
    origin: process.env.BASE_URL || true, 
    credentials: true
}));

// 🔗 API Routes
app.use("/api/auth", authRouter);
app.use("/api/game", gameRouter);
app.use("/api/user", userRouter);

// ==============================
// 🚀 FRONTEND SERVE (IMPORTANT)
// ==============================
const __dirname = path.resolve();

// dist folder serve karega
app.use(express.static(path.join(__dirname, "dist")));

// React/Vite routing handle
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
export default app;