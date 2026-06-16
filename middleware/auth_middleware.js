import jwt from "jsonwebtoken";

import User from "../models/user_model.js";

export const protect = async (req, res, next) => {
  try {
    const authorization_header = req.headers.authorization;

    if (!authorization_header || !authorization_header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const token = authorization_header.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const jwt_secret = process.env.JWT_SECRET;

    if (!jwt_secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded_token = jwt.verify(token, jwt_secret);

    const user = await User.findById(decoded_token.user_id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User associated with this token no longer exists",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authorization token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization token",
      });
    }

    if (error.name === "CastError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization token",
      });
    }

    next(error);
  }
};
