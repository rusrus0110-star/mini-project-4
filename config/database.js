import mongoose from "mongoose";

export const connect_database = async () => {
  const mongodb_uri = process.env.MONGODB_URI;

  if (!mongodb_uri) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }

  try {
    const connection = await mongoose.connect(mongodb_uri);

    console.log(
      `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`,
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    throw error;
  }
};
