import express from "express";
import dotenv from "dotenv";
import connnectDB from "./database/db.js";
dotenv.config({});

const app = express();

const PORT = process.env.PORT || 3000;

connnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
  });
});
