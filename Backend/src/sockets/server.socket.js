// src/sockets/server.socket.js

import { Server } from "socket.io";
import { 
    createSession, 
    applyPriceDrop, 
    updatePrice, 
    applyMoodChange, 
    applyPressure, 
    checkAutoDeal, 
    checkGameOver,
    calculateScore 
} from "../engine/sellerEngine.js";
import { analyzeIntent, getAiResponse } from "../services/ai.service.js";
import SellerModel from "../models/seller.model.js";
import ProductModel from "../models/product.model.js";
import SessionModel from "../models/session.model.js";
import leaderboardModel from "../models/leaderboard.model.js";

let io;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.BASE_URL || "http://localhost:5173",
            credentials: true
        }
    });

    console.log("✅ Socket.io is running");

    io.on("connection", (socket) => {
        console.log("🔌 A user connected:", socket.id);

        // ─── 1. START GAME ──────────────────────────────
        socket.on("start_game", async (data = {}) => {
            try {
                const userId = data.userId || socket.id;
                const { sellerId, productId } = data;

                // Fetch real data from DB
                let seller = null;
                let product = null;

                if (sellerId) {
                    seller = await SellerModel.findById(sellerId).lean();
                }
                if (productId) {
                    product = await ProductModel.findById(productId).lean();
                }

                const session = createSession(userId, product, seller);
                // Store DB refs for later persistence
                session._sellerId = sellerId || null;
                session._productId = productId || null;
                socket.session = session;

                const sellerName = seller?.name || "Chacha";
                const productName = product?.name || "Samsung Galaxy S23";
                const listPrice = session.listPrice.toLocaleString('en-IN');

                const openingMsg = `Aao aao beta! Kya chahiye aaj? ${productName} toh ekdum naya rakha hai, sirf ₹${listPrice} mein! Poore market mein isse sasta nahi milega!`;

                // Save opening message to session history
                session.messages.push({ role: "assistant", content: openingMsg });

                socket.emit("game_started", {
                    message: openingMsg,
                    gameState: {
                        productName: session.productName,
                        listPrice: session.listPrice,
                        currentOffer: session.currentOffer,
                        currentRound: session.currentRound,
                        maxRounds: session.maxRounds,
                        moodScore: session.moodScore,
                        status: session.status,
                        sellerName,
                    }
                });
            } catch (err) {
                console.error("start_game error:", err);
                socket.emit("error", { message: "Game shuru nahi ho paya!" });
            }
        });

        // ─── 2. NEGOTIATION / CHAT ──────────────────────
        socket.on("send_message", async (playerMessage) => {
            if (!socket.session || socket.session.status !== "active") {
                return socket.emit("error", { message: "Khel khatam ho gaya hai ya session nahi mila." });
            }

            const session = socket.session;

            socket.emit("chacha_typing", true);

            try {
                // Step A: Player ke message ka Intent samajh
                const intent = await analyzeIntent(session, playerMessage);
                intent.playerMessage = playerMessage;

                // Step B: Game Logic & Price Drop
                session.currentRound += 1;
                const drop = applyPriceDrop(intent, session);
                session.currentOffer = updatePrice(session, drop);
                session.moodScore = applyMoodChange(intent.moodDelta, session);

                // Step C: Pressure & Auto Deal Check
                const { moodPenalty, pressureMessage } = applyPressure(session, intent);
                session.moodScore = applyMoodChange(moodPenalty, session);

                const autoDeal = checkAutoDeal(session);
                const gameOver = checkGameOver(session);

                // Step D: AI Response
                let chachaMessage = await getAiResponse(session, playerMessage, intent);
                if (pressureMessage) {
                    chachaMessage += ` ${pressureMessage}`;
                }

                // History Update
                session.messages.push({ role: "user", content: playerMessage });
                session.messages.push({ role: "assistant", content: chachaMessage });

                // Step E: Status Finalization
                let finalStatus = "active";
                if (autoDeal.triggered) {
                    finalStatus = "completed";
                    chachaMessage = autoDeal.message;
                } else if (gameOver.over) {
                    finalStatus = "failed";
                    chachaMessage = "Chalo bhai, tumse na ho payega. Main kisi aur ko bech deta hoon, dimaag mat khao!";
                }
                session.status = finalStatus;

                // Step F: Frontend ko data bhej do
                socket.emit("chacha_response", {
                    message: chachaMessage,
                    gameState: {
                        productName: session.productName,
                        listPrice: session.listPrice,
                        currentOffer: session.currentOffer,
                        currentRound: session.currentRound,
                        maxRounds: session.maxRounds,
                        moodScore: session.moodScore,
                        status: session.status,
                        priceDrop: drop,
                        tactic: intent.tactic,
                    },
                    gameOver: finalStatus !== "active",
                    reason: finalStatus
                });

            } catch (error) {
                console.error("Game Error:", error);
                socket.emit("error", { message: "Bhai network mein kuch dikat hai, firse bolo." });
            } finally {
                socket.emit("chacha_typing", false);
            }
        });

        // ─── 3. DEAL ACCEPTED ───────────────────────────
        socket.on("deal_accepted", async (data = {}) => {
            const session = socket.session;
            if (!session || (session.status !== "active" && session.status !== "completed")) {
                return socket.emit("error", { message: "Koi active session nahi hai!" });
            }

            try {
                session.status = "deal";
                session.finalDealPrice = session.currentOffer;

                const scoreData = calculateScore(session);

                // Persist to DB if we have a real userId (not socket.id)
                let leaderboardId = null;
                if (data.userId && data.userId !== socket.id) {
                    try {
                        const dbSession = await SessionModel.create({
                            userId: data.userId,
                            sellerId: session._sellerId,
                            productId: session._productId,
                            productName: session.productName,
                            listPrice: session.listPrice,
                            floorPrice: session.floorPrice,
                            targetPrice: session.targetPrice,
                            stubbornness: session.stubbornness,
                            currentOffer: session.currentOffer,
                            concessionGiven: session.concessionGiven || 0,
                            moodScore: session.moodScore,
                            currentRound: session.currentRound,
                            maxRounds: session.maxRounds,
                            messages: session.messages,
                            status: "deal",
                            finalDealPrice: session.finalDealPrice,
                        });

                        const entry = await leaderboardModel.create({
                            userId: data.userId,
                            playerName: data.playerName || "Player",
                            listPrice: session.listPrice,
                            dealPrice: session.finalDealPrice,
                            savedAmount: scoreData.savedAmount,
                            savedPercent: scoreData.savedPercent,
                            baseScore: scoreData.baseScore,
                            efficiencyBonus: scoreData.efficiencyBonus,
                            totalScore: scoreData.totalScore,
                            roundsUsed: session.currentRound,
                            sessionId: dbSession._id,
                            sellerId: session._sellerId,
                            productId: session._productId,
                        });

                        leaderboardId = entry._id;
                    } catch (dbErr) {
                        console.error("DB save error (deal):", dbErr);
                    }
                }

                socket.emit("deal_result", {
                    success: true,
                    message: "Deal ho gayi! 🎉",
                    scoreData: {
                        dealPrice: session.finalDealPrice,
                        listPrice: session.listPrice,
                        savedAmount: scoreData.savedAmount,
                        savedPercent: scoreData.savedPercent,
                        baseScore: scoreData.baseScore,
                        efficiencyBonus: scoreData.efficiencyBonus,
                        totalScore: scoreData.totalScore,
                        roundsUsed: session.currentRound,
                        productName: session.productName,
                        sellerName: data.sellerName || "Seller",
                    },
                    leaderboardId,
                });
            } catch (err) {
                console.error("deal_accepted error:", err);
                socket.emit("error", { message: "Deal save nahi ho payi!" });
            }
        });

        // ─── 4. WALK AWAY ───────────────────────────────
        socket.on("walk_away", async (data = {}) => {
            const session = socket.session;
            if (!session) {
                return socket.emit("error", { message: "Koi session nahi hai!" });
            }

            try {
                session.status = "walkaway";
                session.finalDealPrice = null;

                // Persist to DB if we have a real userId
                if (data.userId && data.userId !== socket.id) {
                    try {
                        await SessionModel.create({
                            userId: data.userId,
                            sellerId: session._sellerId,
                            productId: session._productId,
                            productName: session.productName,
                            listPrice: session.listPrice,
                            floorPrice: session.floorPrice,
                            targetPrice: session.targetPrice,
                            stubbornness: session.stubbornness,
                            currentOffer: session.currentOffer,
                            concessionGiven: session.concessionGiven || 0,
                            moodScore: session.moodScore,
                            currentRound: session.currentRound,
                            maxRounds: session.maxRounds,
                            messages: session.messages,
                            status: "walkaway",
                            finalDealPrice: null,
                        });
                    } catch (dbErr) {
                        console.error("DB save error (walkaway):", dbErr);
                    }
                }

                socket.emit("walk_away_result", {
                    success: true,
                    message: "Dukaan chhod di! 🚶",
                    gameState: {
                        productName: session.productName,
                        listPrice: session.listPrice,
                        currentOffer: session.currentOffer,
                        currentRound: session.currentRound,
                        maxRounds: session.maxRounds,
                        sellerName: data.sellerName || "Seller",
                    },
                });
            } catch (err) {
                console.error("walk_away error:", err);
                socket.emit("error", { message: "Walk away save nahi hua!" });
            }
        });

        // ─── 5. DISCONNECT ──────────────────────────────
        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
}