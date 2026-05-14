import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./database/db.js";
import userRoute from "./routes/user_routes.js";
import courseRoute from "./routes/course_routes.js";
import { uploadMedia } from "./utils/cloudinary.js";
import purchaseRoute from "./routes/purchase_routes.js";
import courseProgressRoute from "./routes/courseProgress_routes.js";
import {
  stripeWebhook,
} from "./controllers/coursePurschase_controller.js";
dotenv.config({});

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// Stripe webhook needs raw body — BEFORE express.json()
app.post(
  "/api/v1/purchase/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many attempts. Try again in 15 minutes.",
  },
});
app.use("/api/v1/user/login", authLimiter);
app.use("/api/v1/user/register", authLimiter);

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", uploadMedia);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
    );
  });
});
