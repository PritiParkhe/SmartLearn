import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
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
