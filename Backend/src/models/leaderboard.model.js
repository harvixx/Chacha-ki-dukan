// src/models/leaderboard.model.js

import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    playerName: {
      type: String,
      required: true,
      trim: true,
    },

    // Score data
    listPrice: {
      type: Number,
      required: true,
    },
    dealPrice: {
      type: Number,
      required: true,
    },
    savedAmount: {
      type: Number,
      required: true,
    },
    savedPercent: {
      type: Number,
      required: true,
    },

    // Scoring
    baseScore: {
      type: Number,
      required: true,
    },
    efficiencyBonus: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      required: true,
    },

    // Game info
    roundsUsed: {
      type: Number,
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      default: null,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Score ke hisaab se sort karne ke liye index
leaderboardSchema.index({ totalScore: -1 });
leaderboardSchema.index({ userId: 1, createdAt: -1 });
const leaderboardModel = mongoose.model("Leaderboard", leaderboardSchema);
export default leaderboardModel