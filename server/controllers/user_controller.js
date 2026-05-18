import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import fs from "fs";

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    //  Mongoose validation error — bad email format, short password, etc.
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    //  Mongoose duplicate key error — race condition on unique email
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // everything else is a genuine server error
    console.error("Error in register:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register.",
    });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    if (email !== email.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }
    // select("+password") needed because schema has select: false on password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login.",
    });
  }
};

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
export const logout = async (_, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        sameSite: isProduction ? "None" : "Lax",
        secure: isProduction,
        maxAge: 0, // expire immediately
      })
      .json({
        success: true,
        message: "Logged out successfully.",
      });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout.",
    });
  }
};

// ─── GET PROFILE ──────────────────────────────────────────────────────────────
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "enrolledCourses",
        select:
          "courseTitle courseThumbnail coursePrice courseLevel category creator",
        populate: {
          path: "creator",
          select: "name photoUrl",
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let photoUrl = user.photoUrl;
    let photoPublicId = user.photoPublicId;

    if (profilePhoto) {
      try {
        // Delete old photo from Cloudinary using stored publicId
        if (user.photoPublicId) {
          await deleteMediaFromCloudinary(user.photoPublicId);
        }

        const cloudResponse = await uploadMedia(profilePhoto.path);

        if (!cloudResponse?.secure_url) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload profile photo.",
          });
        }

        photoUrl = cloudResponse.secure_url;
        photoPublicId = cloudResponse.public_id; // store for future deletion
      } finally {
        // Always clean up temp file — even if Cloudinary fails
        if (profilePhoto?.path && fs.existsSync(profilePhoto.path)) {
          fs.unlinkSync(profilePhoto.path);
        }
      }
    }

    // Only update fields that were actually provided
    const updateData = {};
    if (name) updateData.name = name;
    if (photoUrl) updateData.photoUrl = photoUrl;
    if (photoPublicId) updateData.photoPublicId = photoPublicId;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};
