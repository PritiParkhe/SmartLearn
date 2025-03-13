import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import fs from "fs";
const saltRounds = 10;
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User alredy exist with this email.",
      });
    }
    try {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashed = bcrypt.hashSync(password, salt);

      if (!hashed) {
        throw new Error(`Something went wrong`);
      }
      await User.create({
        name,
        email,
        password: hashed,
      });
      return res.status(201).json({
        success: true,
        message: "Account created successfully.",
      });
    } catch (error) {
      console.log("error in hasedPassword", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log("error in register", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incoreect email or password",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(500).json({
        success: false,
        message: "Incoreect password",
      });
    }
    generateToken(res, user, `welcome back ${user.name}`);
  } catch (error) {
    console.log("error in login", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log("error in logout", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("error in getting userprofile", error);
    return res.status(500).json({
      success: false,
      message: "Failed to find user",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    // console.log(userId, name, profilePhoto);

    // Check if file exists
    if (!profilePhoto) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // ✅ Delete old image from Cloudinary if it exists
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0]; // Extract public ID
      await deleteMediaFromCloudinary(publicId);
    }

    // Upload new photo

    const cloudResponse = await uploadMedia(profilePhoto.path);
    //handelling cloudresponse if it fails
    if (!cloudResponse || !cloudResponse.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload profile photo",
      });
    }
    const photoUrl = cloudResponse.secure_url;

    // ✅ Delete the uploaded file from local storage
    fs.unlinkSync(profilePhoto.path);

    // console.log(cloudResponse, "cloudres");
    // console.log(cloudResponse.secure_url, "cloudres");

    const updateData = { name, photoUrl };
    const updateUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      user: updateUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
