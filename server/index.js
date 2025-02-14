import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connnectDB from "./database/db.js";
import userRoute from "./routes/user_routes.js";


dotenv.config({});

const app = express();

const PORT = process.env.PORT || 3000;

// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:8080",
  credentials: true,
}));

// api
app.use("/api/v1/user", userRoute);

connnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
  });
});
