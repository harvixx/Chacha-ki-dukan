import "dotenv/config";
import http from "http";
import connectToDb from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";
import seedData from "./src/utils/seedDatabase.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;
let isDbConnected = false;

// 🔗 Create server
const httpServer = http.createServer(app);

// 🔌 Init socket
initSocket(httpServer);

// 🚀 Start server
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 🧠 DB Init (NON-BLOCKING)
async function initDb() {
  try {
    await connectToDb();
    isDbConnected = true;
    console.log("✅ Database connected");

    await seedData();
    console.log("✅ Database already seeded.");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
}

initDb();

// ❤️ Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    db: isDbConnected ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// 🛡️ Error handling (NO CRASH)
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err?.message || err);
});