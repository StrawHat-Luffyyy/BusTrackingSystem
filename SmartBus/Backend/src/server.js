import "dotenv/config";
import app from "./app.js";
import { prisma } from "./prismaClient.js";
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL database successfully.");

    const server = app.listen(PORT, "0.0.0.0",() => {
      console.log(`SmartBus API is running on http://localhost:${PORT}`);
    });

    process.on("SIGTERM", async () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(async () => {
        console.log("HTTP server closed.");
        await prisma.$disconnect();
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT (Ctrl+C) received. Shutting down...");
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
