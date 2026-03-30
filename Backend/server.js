import "dotenv/config";
import http from "http";
import connectToDb from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";
import seedData from "./src/utils/seedDatabase.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;
let isDbConnected = false;

const httpServer = http.createServer(app);
initSocket(httpServer)
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

async function initDb() {
    try {
        await connectToDb();
        isDbConnected = true;
        console.log("✅ Database connected");
        await seedData();
    } catch (err) {
        console.error("❌ DB connection failed:", err.message);


    }
}

initDb();


app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        db: isDbConnected ? "connected" : "disconnected",
        uptime: process.uptime(),
        timestamp: new Date()
    });
});


process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err.message);
    process.exit(1); // crash → let process manager restart
});

process.on("unhandledRejection", (err) => {
    console.error("💥 Unhandled Rejection:", err.message);
    process.exit(1);
});


process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("🛑 Shutting down server...");

    httpServer.close(() => {
        console.log("💤 Server closed");

        process.exit(0);
    });

    setTimeout(() => {
        console.error("⚠️ Force shutdown");
        process.exit(1);
    }, 10000);
}