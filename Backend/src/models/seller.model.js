import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    category: {
      type: String,
      required: true,
    },
    themeColor: {
      type: String,
      required: true,
    },
    personalityTags: {
      type: [String],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    playersCount: {
      type: Number,
      default: 0,
    },
    bestDealAmount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const SellerModel = mongoose.model("Seller", sellerSchema);
export default SellerModel;
