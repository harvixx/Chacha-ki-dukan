// src/models/session.model.js

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    productName: {
      type: String,
      default: "Samsung Galaxy S23",
    },
    listPrice: {
      type: Number,
      default: 25000,
    },

    // Hidden from client - kabhi bhi frontend ko mat bhejna!
    floorPrice: {
      type: Number,
      required: true,
    },
    targetPrice: {
      type: Number,
      required: true,
    },
    stubbornness: {
      type: Number,
      required: true,
    },

    // Game state - client ko yeh milega
    currentOffer: {
      type: Number,
      required: true,
    },
    concessionGiven: {
      type: Number,
      default: 0,
    },
    moodScore: {
      type: Number,
      default: 3,
      min: 1,
      max: 5,
    },
    currentRound: {
      type: Number,
      default: 1,
    },
    maxRounds: {
      type: Number,
      default: 8,
    },

    // Conversation
    messages: [messageSchema],

    // Status
    status: {
      type: String,
      enum: ["active", "deal", "walkaway", "expired"],
      default: "active",
    },
    finalDealPrice: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const SessionModel = mongoose.model("Session", sessionSchema);
export default SessionModel