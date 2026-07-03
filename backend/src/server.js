import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet"; // Security headers
import compression from "compression"; // Response compression
import connectDB from "./config/db.js";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter.js";

connectDB();

const app = express();

// ========== SECURITY MIDDLEWARE ==========
app.use(helmet()); // Adds secure HTTP headers

// ========== COMPRESSION ==========
app.use(compression()); // Gzip compress responses

// ========== CORS ==========
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ========== BODY PARSING ==========
app.use(express.json({ limit: "10mb" })); // Limit payload size
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ========== RATE LIMITING ==========
app.use("/api/", apiLimiter);

// ========== ROUTES ==========
app.use("/api/health", healthRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);

// ========== HEALTH CHECK ==========
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "AI Finance Tracker API is running" });
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === "production" 
    ? "Internal Server Error" 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { error: err.message }),
  });
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${NODE_ENV}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});