// src/controllers/game.controller.js

import {
    createSession,
    applyPriceDrop,
    applyMoodChange,
    calculateScore,
    checkGameOver,
} from "../engine/sellerEngine.js";
import { checkAutoDeal, updatePrice } from "../engine/sellerEngine.js";
import {
    analyzeIntent,
    getAiResponse,
} from "../services/ai.service.js";

import SessionModel from "../models/session.model.js";
import leaderboardModel from "../models/leaderboard.model.js";
import SellerModel from "../models/seller.model.js";
import ProductModel from "../models/product.model.js";

// ─── 1. Naya Game Shuru karo ───────────────────────────────
export const startGame = async (req, res) => {
    try {
        const userId = req.user._id;
        const { sellerId, productId } = req.body;

        await SessionModel.findOneAndUpdate(
            { userId, status: "active" },
            { $set: { status: "expired" } }
        );

        // Fetch real data from DB
        let seller = null;
        let product = null;
        if (sellerId) seller = await SellerModel.findById(sellerId).lean();
        if (productId) product = await ProductModel.findById(productId).lean();

        const sessionData = createSession(userId, product, seller);
        // Attach refs for the Session model
        sessionData.sellerId = sellerId || null;
        sessionData.productId = productId || null;

        const session = await SessionModel.create(sessionData);

        const sellerName = seller?.name || "Chacha";
        const productName = product?.name || "Samsung Galaxy S23";
        const listPrice = session.listPrice.toLocaleString('en-IN');

        const openingMsg =
            `Aao aao beta! Kya chahiye? ${productName} toh ekdum naya rakha hai, sirf ₹${listPrice} mein! Poore market mein isse sasta nahi milega!`;

        session.messages.push({
            role: "assistant",
            content: openingMsg,
        });
        await session.save();

        res.status(201).json({
            success: true,
            sessionId: session._id,
            gameState: {
                productName: session.productName,
                listPrice: session.listPrice,
                currentOffer: session.currentOffer,
                currentRound: session.currentRound,
                maxRounds: session.maxRounds,
                moodScore: session.moodScore,
                status: session.status,
                sellerName,
            },
            message: openingMsg,
        });

    } catch (error) {
        console.error("startGame error:", error);
        res.status(500).json({
            success: false,
            message: "Game shuru nahi ho paya, dobara try karo!",
        });
    }
};

export const getSellers = async (req, res) => {
    try {
        const sellers = await SellerModel.find({});
        res.status(200).json({ success: true, sellers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductsBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const products = await ProductModel.find({ sellerId }).populate("sellerId");
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── 2. Player ka Message Process karo ────────────────────
export const negotiate = async (req, res) => {
    try {
        const userId = req.user._id;
        const { sessionId, playerMessage } = req.body;

        if (!sessionId || !playerMessage?.trim()) {
            return res.status(400).json({
                success: false,
                message: "SessionId aur message dono chahiye!",
            });
        }

        const session = await SessionModel.findOne({
            _id: sessionId,
            userId,
            status: "active",
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session nahi mila ya game khatam ho gaya!",
            });
        }

        // ✅ Prevent double submission via last user message check
        const lastUserMsg = session.messages.slice().reverse().find(m => m.role === "user");
        if (lastUserMsg && lastUserMsg.content === playerMessage && session.currentRound > 0) {
            // Optional: Block exact duplicate message spam
        }

        // ✅ Step 1 — AI intent
        const intent = await analyzeIntent(session, playerMessage);

        // 🧠 IMPORTANT: playerMessage attach karo (repetition check ke liye)
        intent.playerMessage = playerMessage;

        // ✅ Step 2 — Price drop
        const priceDrop = applyPriceDrop(intent, session);
        session.currentOffer = updatePrice(session, priceDrop);
        session.concessionGiven += priceDrop;

        // ✅ Step 3 — Mood
        session.moodScore = applyMoodChange(intent.moodDelta, session);

        // ✅ Step 4 — Round
        session.currentRound += 1;

        // ✅ Step 5 — Save player msg
        session.messages.push({ role: "user", content: playerMessage });

        // ✅ Step 6 — AUTO DEAL (YAHI SAHI JAGAH HAI)
        const autoDeal = checkAutoDeal(session);

        if (autoDeal.triggered) {
            session.status = "deal";
            session.finalDealPrice = session.currentOffer;

            await session.save();

            return res.status(200).json({
                success: true,
                message: autoDeal.message,
                gameOver: true,
                reason: "deal",
                gameState: {
                    currentOffer: session.currentOffer,
                    currentRound: session.currentRound,
                    maxRounds: session.maxRounds,
                    moodScore: session.moodScore,
                    status: session.status,
                },
            });
        }

        // ✅ Step 7 — AI reply
        const chachaReply = await getAiResponse(session, playerMessage, intent);

        // ✅ Step 8 — Save reply
        session.messages.push({ role: "assistant", content: chachaReply });

        // ✅ Step 9 — Game over
        const gameOver = checkGameOver(session);
        if (gameOver.over) {
            session.status = "walkaway";
            session.finalDealPrice = session.currentOffer;
        }

        await session.save();

        res.status(200).json({
            success: true,
            message: chachaReply,
            gameState: {
                currentOffer: session.currentOffer,
                currentRound: session.currentRound,
                maxRounds: session.maxRounds,
                moodScore: session.moodScore,
                status: session.status,
                priceDrop,
                tactic: intent.tactic,
                reasoning: intent.reasoning,
            },
            gameOver: gameOver.over,
            reason: gameOver.reason,
        });

    } catch (error) {
        console.error("negotiate error:", error);
        res.status(500).json({
            success: false,
            message: "Kuch gadbad ho gayi, dobara try karo!",
        });
    }
};

// ─── 3. Deal Accept karo ──────────────────────────────────
export const acceptDeal = async (req, res) => {
    try {
        const userId = req.user._id;
        const { sessionId } = req.body;

        const session = await SessionModel.findOne({
            _id: sessionId,
            userId,
            status: "active",
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session nahi mila!",
            });
        }

        const updatedSession = await SessionModel.findOneAndUpdate(
            { _id: sessionId, status: "active" },
            { $set: { status: "deal", finalDealPrice: session.currentOffer } },
            { new: true }
        );
        
        if (!updatedSession) {
             return res.status(400).json({
                 success: false,
                 message: "Yeh deal pehle hi accept ho chuki hai!",
             });
        }
        
        session.status = "deal";
        session.finalDealPrice = session.currentOffer;

        const scoreData = calculateScore(session);

        const entry = await leaderboardModel.create({
            userId,
            playerName: req.user.name || req.user.email,
            listPrice: session.listPrice,
            dealPrice: session.finalDealPrice,
            savedAmount: scoreData.savedAmount,
            savedPercent: scoreData.savedPercent,
            baseScore: scoreData.baseScore,
            efficiencyBonus: scoreData.efficiencyBonus,
            totalScore: scoreData.totalScore,
            roundsUsed: session.currentRound - 1,
            sessionId: session._id,
            sellerId: session.sellerId,
            productId: session.productId,
        });

        res.status(200).json({
            success: true,
            message: "Deal ho gayi! 🎉",
            scoreData: {
                dealPrice: session.finalDealPrice,
                savedAmount: scoreData.savedAmount,
                savedPercent: scoreData.savedPercent,
                baseScore: scoreData.baseScore,
                efficiencyBonus: scoreData.efficiencyBonus,
                totalScore: scoreData.totalScore,
                roundsUsed: session.currentRound - 1,
            },
            leaderboardId: entry._id,
        });

    } catch (error) {
        console.error("acceptDeal error:", error);
        res.status(500).json({
            success: false,
            message: "Deal save nahi ho payi!",
        });
    }
};

// ─── 4. Leaderboard fetch karo ────────────────────────────
export const getLeaderboard = async (req, res) => {
    try {
        const top20 = await leaderboardModel.find()
            .sort({ totalScore: -1 })
            .limit(20)
            .populate("userId", "name email")
            .populate("sellerId", "name imageUrl")
            .populate("productId", "name")
            .select("-__v");

        const userId = req.user?._id;
        let playerRank = null;

        if (userId) {
            const playerBest = await leaderboardModel
                .findOne({ userId })
                .sort({ totalScore: -1 });

            if (playerBest) {
                playerRank = await leaderboardModel.countDocuments({
                    totalScore: { $gt: playerBest.totalScore },
                }) + 1;
            }
        }

        res.status(200).json({
            success: true,
            leaderboard: top20,
            playerRank,
        });

    } catch (error) {
        console.error("getLeaderboard error:", error);
        res.status(500).json({
            success: false,
            message: "Leaderboard load nahi hua!",
        });
    }
};

// ─── 5. Current Session fetch karo ───────────────────────
export const getSession = async (req, res) => {
    try {
        const userId = req.user._id;

        const session = await SessionModel.findOne({
            userId,
            status: "active",
        }).select("-floorPrice -targetPrice -stubbornness -concessionBudget");

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Koi active session nahi hai!",
            });
        }

        res.status(200).json({
            success: true,
            session,
        });

    } catch (error) {
        console.error("getSession error:", error);
        res.status(500).json({
            success: false,
            message: "Session load nahi hua!",
        });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const statsAgg = await leaderboardModel.aggregate([
            { $match: { userId } },
            { $group: {
                _id: null,
                totalGames: { $sum: 1 },
                totalSavedAmount: { $sum: "$savedAmount" },
                totalScore: { $sum: "$totalScore" }
            }}
        ]);

        const matches = await leaderboardModel.find({ userId })
            .sort({ createdAt: -1 })
            .populate("sellerId", "name")
            .populate("productId", "name")
            .limit(10);

        const stats = statsAgg[0] || { totalGames: 0, totalSavedAmount: 0, totalScore: 0 };

        res.status(200).json({
            success: true,
            stats: {
                totalGames: stats.totalGames,
                totalSavedAmount: stats.totalSavedAmount,
                totalScore: stats.totalScore,
                recentMatches: matches
            }
        });

    } catch (error) {
        console.error("getUserStats error:", error);
        res.status(500).json({ success: false, message: "Stats load nahi hua!" });
    }
};
