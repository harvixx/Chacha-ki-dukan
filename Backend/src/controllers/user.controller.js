import User from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import SellerModel from "../models/seller.model.js";

export const updateUserSession = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            productId, sellerId, productName, productIcon,
            sellerName, dealPrice, listPrice, savedAmount,
            savedPercent, status, score, sellerThemeColor
        } = req.body;

        const isSuccess = status === 'success';
        const cleanSellerName = sellerName?.trim() || 'Dukandar'; // Clean Name

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Win Rate Calculation
        const currentGames = user.stats.gamesCount || 0;
        const currentWins = Math.round((user.stats.winRate / 100) * currentGames);
        const newWins = currentWins + (isSuccess ? 1 : 0);
        const newGamesCount = currentGames + 1;
        const newWinRate = Math.round((newWins / newGamesCount) * 100);

        // Dynamic Query Building
        const updateQuery = {
            $inc: { 'stats.gamesCount': 1, 'stats.totalSaved': savedAmount || 0 },
            $max: { 'stats.bestSavingPercent': parseFloat(savedPercent) || 0 },
            $set: { 'stats.winRate': newWinRate },
            $push: {
                negotiationHistory: {
                    $each: [{
                        productName: productName || 'Product',
                        productIcon: productIcon || 'Smartphone',
                        sellerName: cleanSellerName,
                        xpEarned: score || 0,
                        dealPrice: dealPrice || 0,
                        savedAmount: savedAmount || 0,
                        savedPercent: savedPercent ? `${savedPercent}%` : '0%',
                        status: isSuccess ? 'success' : 'walkaway',
                        timeAgo: new Date() // Timestamp zaroori hai
                    }],
                    $slice: -15,
                }
            }
        };

        const sellerIndex = user.sellerPerformance.findIndex(s => s.sellerName === cleanSellerName);

        if (sellerIndex > -1) {
            // Update Existing Seller
            updateQuery.$inc[`sellerPerformance.${sellerIndex}.gamesPlayed`] = 1;
            const currentBest = parseFloat(user.sellerPerformance[sellerIndex].bestDeal.replace(/[^0-9.]/g, '')) || 0;
            const newPercent = parseFloat(savedPercent) || 0;
            if (isSuccess && newPercent > currentBest) {
                updateQuery.$set[`sellerPerformance.${sellerIndex}.bestDeal`] = `${savedPercent}%`;
            }
        } else {
            // Add New Seller to User Profile
            updateQuery.$push.sellerPerformance = {
                sellerName: cleanSellerName,
                gamesPlayed: 1,
                bestDeal: isSuccess ? `${savedPercent}%` : '0%',
                themeColor: sellerThemeColor || 'blue'
            };
        }

        // 1. Update User (Atomic)
        const updatedUser = await User.findByIdAndUpdate(userId, updateQuery, { new: true });

        const numericPercent = parseFloat(savedPercent) || 0;

        // 2. Update Global Models (Parallel execution for speed)
        const globalUpdates = [];
        if (sellerId) {
            globalUpdates.push(SellerModel.findByIdAndUpdate(sellerId, {
                $inc: { playersCount: 1 },
                $max: { bestDealAmount: numericPercent }
            }));
        }
        if (productId) {
            const product = await ProductModel.findById(productId);
            if (product) {
                const totalPlays = (product.plays || 0) + 1;
                const newAvg = (( (product.avgDeal || 0) * (totalPlays - 1)) + numericPercent) / totalPlays;
                globalUpdates.push(ProductModel.findByIdAndUpdate(productId, {
                    $inc: { plays: 1 },
                    $max: { bestDeal: numericPercent },
                    $set: { avgDeal: newAvg }
                }));
            }
        }
        await Promise.all(globalUpdates);

        res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
        console.error("Critical Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
