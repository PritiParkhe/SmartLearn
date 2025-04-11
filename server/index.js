import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connnectDB from "./database/db.js";
import userRoute from "./routes/user_routes.js";
import courseRoute from "./routes/course_routes.js";
import mediaRoute from "./routes/media_routes.js";
import purchaseRoute from "./routes/purchase_routes.js";
import courseProgressRoute from "./routes/courseProgress_routes.js";

dotenv.config({});

const app = express();

const PORT = process.env.PORT || 3000;

// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// api
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

connnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
  });
});
