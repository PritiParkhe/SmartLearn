import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});
cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRTET,
  cloud_name: process.env.CLOUDINARY_NAME,
});

export const uploadMedia = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadResponse; // ✅ Return the response
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    return null; // ✅ Handle errors gracefully
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log(error);
  }
};
