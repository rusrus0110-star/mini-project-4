import express from "express";
import dotenv from "dotenv";

import { connect_database } from "./config/database.js";
import auth_router from "./routes/auth_routes.js";
import task_router from "./routes/task_routes.js";
import { not_found_middleware } from "./middleware/not_found_middleware.js";
import { error_middleware } from "./middleware/error_middleware.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Task Manager API is running",
  });
});

app.use("/api/auth", auth_router);
app.use("/api/tasks", task_router);

app.use(not_found_middleware);
app.use(error_middleware);

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
