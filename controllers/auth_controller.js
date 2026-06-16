import User from "../models/user_model.js";
import { generate_token } from "../utils/generate_token.js";

export const register_user = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name must be a string",
      });
    }

    if (typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email must be a string",
      });
    }

    if (typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Password must be a string",
      });
    }

    const normalized_email = email.trim().toLowerCase();

    const existing_user = await User.findOne({
      email: normalized_email,
    });

    if (existing_user) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalized_email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    next(error);
  }
};

export const login_user = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email and password must be strings",
      });
    }

    const normalized_email = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalized_email,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const is_password_valid = await user.compare_password(password);

    if (!is_password_valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generate_token(user._id.toString());

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
