import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";
import fs from "fs";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file.path);
    res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      data: result,
    });
    // Safe delete file from storage
     
     try {
      fs.unlinkSync(req.file.path);
      // console.log("file deleted successfully");
      
    } catch (err) {
      console.error("Error deleting temp file:", err.message);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error uploading file",
    });
  }
});
export default router;
