import jwt from "jsonwebtoken";

export const generate_token = (user_id) => {
  const jwt_secret = process.env.JWT_SECRET;
  const jwt_expires_in = process.env.JWT_EXPIRES_IN || "7d";

  if (!jwt_secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      user_id,
    },
    jwt_secret,
    {
      expiresIn: jwt_expires_in,
    },
  );
};
