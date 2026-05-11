import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

// Validate required env vars at startup
const requiredEnvVars = ["API_KEY", "API_SECRET", "CLOUDINARY_NAME"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUDINARY_NAME,
});

export const uploadMedia = async (file) => {
  const uploadResponse = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return uploadResponse;
};

// Guard against empty publicId
export const deleteMediaFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

export const deleteVideoFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
};
