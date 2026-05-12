// controllers/media_controller.js
import { uploadMedia } from "../utils/cloudinary.js";
import fs from "fs";

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const result = await uploadMedia(req.file.path);

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading file",
    });
  } finally {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};
