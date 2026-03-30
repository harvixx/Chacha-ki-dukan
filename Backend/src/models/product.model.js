import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: "Unknown",
    },
    category: {
      type: String,
      required: true,
    },
    listPrice: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    specs: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Very Hard"],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    plays: {
      type: Number,
      default: 0,
    },
    bestDeal: {
      type: Number,
      default: 0,
    },
    avgDeal: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
