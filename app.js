import express from "express";
import dotenv from "dotenv";

import { connect_database } from "./config/database.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Manager API is running",
  });
});

const start_server = async () => {
  try {
    await connect_database();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error.message);

    process.exit(1);
  }
};

start_server();
