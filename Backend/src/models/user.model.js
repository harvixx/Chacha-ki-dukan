import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: 3,
            maxlength: 30,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
            index: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            maxlength: 100,
            select: false,
        },

        verified: {
            type: Boolean,
            default: false,
        },

        avatar: {
            type: String,
            default: "",
        },

        sessions: [
            {
                refreshTokenHash: {
                    type: String,
                    required: true,
                },
                userAgent: String,
                ip: String,
                expiresAt: {
                    type: Date,
                    required: true,
                },
            },
        ],

        stats: {
            gamesCount: { type: Number, default: 0 },
            totalSaved: { type: Number, default: 0 },
            bestSavingPercent: { type: Number, default: 0 },
            winRate: { type: Number, default: 0 }
        },

        sellerPerformance: [{
            sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
            sellerName: String,
            gamesPlayed: { type: Number, default: 0 },
            bestDeal: { type: String, default: '₹0' },
            globalRank: { type: Number, default: 0 },
            themeColor: String // blue, amber, pink, yellow
        }],

        negotiationHistory: [{
            productName: String,
            productIcon: String, // Smartphone, Laptop, Gem
            sellerName: String,
            timeAgo: { type: Date, default: Date.now },
            xpEarned: { type: Number, default: 0 },
            dealPrice: { type: Number },
            savedAmount: { type: Number },
            savedPercent: { type: String },
            status: { type: String, enum: ['success', 'walkaway'] }
        }]
    },
    {
        timestamps: true,
    }
);


// 🔐 Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password, 10);

});


// 🔑 Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User", userSchema);

export default User;