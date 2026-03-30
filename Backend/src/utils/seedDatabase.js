import mongoose from "mongoose";
import SellerModel from "../models/seller.model.js";
import ProductModel from "../models/product.model.js";

const seedData = async () => {
    try {
        const sellerCount = await SellerModel.countDocuments();
        if (sellerCount > 0) {
            console.log("✅ Database already seeded.");
            return;
        }

        console.log("🌱 Seeding database...");

        // Sellers
        const sellersData = [
            {
                name: "Chacha",
                location: "Palika Bazaar",
                difficulty: 1,
                category: "Electronics",
                themeColor: "blue",
                personalityTags: ["Friendly", "Gullible", "Old-school"],
                imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-pM_RarIfM-O46b4o_00yq-Jc8_D6ZlE0hQ7v4E4mF9lQcW6LszBpeM_-s1f08M47pXfX3u68TqW0O986aPibT203L48gD8M5-lC3pB-Q-7kXGzWvwG7E0D3Zq8m6y9rR3y1QzOON8s7g5aXJwKw0-HjH9N4e4G7H_Qy6lQ8pBq2H2X6Z8p1hX9-Gf6A8D0-409v9A",
                avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-pM_RarIfM-O46b4o_00yq-Jc8_D6ZlE0hQ7v4E4mF9lQcW6LszBpeM_-s1f08M47pXfX3u68TqW0O986aPibT203L48gD8M5-lC3pB-Q-7kXGzWvwG7E0D3Zq8m6y9rR3y1QzOON8s7g5aXJwKw0-HjH9N4e4G7H_Qy6lQ8pBq2H2X6Z8p1hX9-Gf6A8D0-409v9A"
            },
            {
                name: "Sharma Ji",
                location: "Nehru Place",
                difficulty: 3,
                category: "Computer Hardware",
                themeColor: "emerald",
                personalityTags: ["Clever", "Sarcastic", "Tech-savvy"],
                imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE9vI1v1J_1TjP9bK0q5uG4l3G2r1R1qTj_9T9QJ9bK0q5uG4l3G2r1R1qTj_9T9QJ9bK0q5uG4l3G2r1R1qTj_9T9Q",
                avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE9vI1v1J_1TjP9bK0q5uG4l3G2r1R1qTj_9T9QJ9bK0q5uG4l3G2r1R1qTj_9T9QJ9bK0q5uG4l3G2r1R1qTj_9T9Q"
            },
            {
                name: "Meena Aunty",
                location: "Sarojini Nagar",
                difficulty: 2,
                category: "Clothing",
                themeColor: "pink",
                personalityTags: ["Loud", "Stubborn", "Dramatic"],
                imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf_u0O_b3W_Fz9eH6Hq7G9_v5K8sK4y_3u3z9J_H5X2b1r2P4v9K_X2P4v9K_X2P4v9K_X2P4v9K_X2P4v9K_X2P",
                avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf_u0O_b3W_Fz9eH6Hq7G9_v5K8sK4y_3u3z9J_H5X2b1r2P4v9K_X2P4v9K_X2P4v9K_X2P4v9K_X2P4v9K_X2P"
            },
            {
                name: "Rajesh Bhai",
                location: "Karol Bagh",
                difficulty: 4,
                category: "Mobile Accessories",
                themeColor: "amber",
                personalityTags: ["Bossy", "No-nonsense", "Hustler"],
                imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQq7X3Y0M2W_H7Y4W5L2v_2Y_G2Q_1P_2v3K9G8B6B3h6q_7h6q_7h6q_7h6q_7h6q_7h6q_7h6q_7h6q_7h6q",
                avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQq7X3Y0M2W_H7Y4W5L2v_2Y_G2Q_1P_2v3K9G8B6B3h6q_7h6q_7h6q_7h6q_7h6q_7h6q_7h6q_7h6q_7h6q"
            }
        ];

        const insertedSellers = await SellerModel.insertMany(sellersData);
        const chachaId = insertedSellers.find(s => s.name === "Chacha")._id;
        const sharmaId = insertedSellers.find(s => s.name === "Sharma Ji")._id;
        const meenaId = insertedSellers.find(s => s.name === "Meena Aunty")._id;
        const rajeshId = insertedSellers.find(s => s.name === "Rajesh Bhai")._id;

        const productsData = [
            {
                sellerId: chachaId,
                name: "Samsung Galaxy S23",
                brand: "Samsung",
                category: "Electronics",
                listPrice: 45000,
                originalPrice: 75000,
                specs: "8GB RAM, 256GB ROM, 50MP Camera",
                difficulty: "Medium",
                imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQq7X3Y0M2W_H7Y4W5L2v_2Y_G2Q_1P_2v3K9G8B6B3h6q_7h6q_7h6q_7h6q_7h6q_7h6q_7h6q_7h6q_7h6q"
            },
            {
                sellerId: chachaId,
                name: "iPhone 14 Pro Max",
                brand: "Apple",
                category: "Electronics",
                listPrice: 72000,
                originalPrice: 120000,
                specs: "6GB RAM, 256GB ROM, A16 Bionic",
                difficulty: "Hard",
                imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf_u0O_b3W_Fz9eH6Hq7G9_v5K8sK4y_3u3z9J_H5X2b1r2P4v9K_X2P4v9K_X2P4v9K_X2P4v9K_X2P4v9K_X2P"
            },
            {
                sellerId: sharmaId,
                name: "Dell Inspiron 15",
                brand: "Dell",
                category: "Laptops",
                listPrice: 55000,
                originalPrice: 65000,
                specs: "16GB RAM, i5 12th Gen",
                difficulty: "Hard",
                imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE9vI1v1J_1TjP9bK0q5uG4l3G2r1R1qTj_9T9QJ9bK0q5uG4l3G2r1R1qTj_9T9QJ9bK0q5uG4l3G2r1R1qTj_9T9Q"
            },
            {
                sellerId: meenaId,
                name: "Designer Lehenga",
                brand: "Local",
                category: "Clothing",
                listPrice: 15000,
                originalPrice: 25000,
                specs: "Heavy Embroidery, Bridal Wear",
                difficulty: "Easy",
                imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-pM_RarIfM-O46b4o_00yq-Jc8_D6ZlE0hQ7v4E4mF9lQcW6LszBpeM_-s1f08M47pXfX3u68TqW0O986aPibT203L48gD8M5-lC3pB-Q-7kXGzWvwG7E0D3Zq8m6y9rR3y1QzOON8s7g5aXJwKw0-HjH9N4e4G7H_Qy6lQ8pBq2H2X6Z8p1hX9-Gf6A8D0-409v9A"
            },
            {
                sellerId: rajeshId,
                name: "Airpods Pro Clone",
                brand: "Generic",
                category: "Accessories",
                listPrice: 1200,
                originalPrice: 3500,
                specs: "ANC, Space Audio",
                difficulty: "Very Hard",
                imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE9vI1v1J_1TjP9bK0q5uG4l3G2r1R1qTj_9T9QJ9bK0q5uG4l3G2r1R1qTj_9T9QJ9bK0q5uG4l3G2r1R1qTj_9T9Q"
            }
        ];

        await ProductModel.insertMany(productsData);
        console.log("🌱 Added Chacha, Sharma Ji, Meena Aunty, Rajesh Bhai and their products.");

    } catch (err) {
        console.error("❌ Seed error", err);
    }
};

export default seedData;
