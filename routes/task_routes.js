import { Router } from "express";

import { create_task } from "../controllers/task_controller.js";
import { protect } from "../middleware/auth_middleware.js";

const task_router = Router();

task_router.post("/", protect, create_task);

export default task_router;
