import express from "express";
import { uploadMedia } from "../utils/cloudinary.js";
import upload from "../utils/multer.js";
import fs from "fs";
import isAuthenticated from "../middleware/isAuthenticated.js";
import authorizeRole from "../middleware/authorizeRole.js";
const router = express.Router();
router.post(
  "/upload-video",
  isAuthenticated,
  authorizeRole("instructor"),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const result = await uploadMedia(req.file.path);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload media",
      });
    } finally {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
  },
);
export default router;
