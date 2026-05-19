import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUDINARY_NAME,
});

const validateCloudinaryConfig = () => {
  const missing = ["API_KEY", "API_SECRET", "CLOUDINARY_NAME"].filter(
    (key) => !process.env[key]
  );
  if (missing.length > 0) {
    throw new Error(`Missing Cloudinary env vars: ${missing.join(", ")}`);
  }
};

export const uploadMedia = async (file) => {
  validateCloudinaryConfig();
  const uploadResponse = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return uploadResponse;
};

export const deleteMediaFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

export const deleteVideoFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
};