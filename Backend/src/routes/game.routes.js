// src/routes/game.routes.js

import express from "express";
import {
  startGame,
  negotiate,
  acceptDeal,
  getLeaderboard,
  getSession,
  getSellers,
  getProductsBySeller,
  getUserStats
} from "../controllers/game.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const gameRouter = express.Router();

// ─── Protected Routes — login zaroori ─────────────────────
gameRouter.post("/start",        authMiddleware, startGame);
gameRouter.post("/negotiate",    authMiddleware, negotiate);
gameRouter.post("/accept-deal",  authMiddleware, acceptDeal);
gameRouter.get ("/session",      authMiddleware, getSession);
gameRouter.get ("/profile/stats", authMiddleware, getUserStats);

// ─── Public Route — sabko dikhega ─────────────────────────
gameRouter.get ("/leaderboard",  getLeaderboard);
gameRouter.get ("/sellers",  authMiddleware, getSellers);
gameRouter.get ("/products/:sellerId", authMiddleware, getProductsBySeller);

export default gameRouter;