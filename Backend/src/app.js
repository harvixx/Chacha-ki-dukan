import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import gameRouter from "./routes/game.routes.js";
import userRouter from "./routes/user.routes.js";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));
app.use("/api/auth", authRouter)
app.use("/api/game", gameRouter);
app.use("/api/user", userRouter);
export default app;

