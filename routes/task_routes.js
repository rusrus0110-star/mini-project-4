import { Router } from "express";

import { create_task, get_tasks } from "../controllers/task_controller.js";
import { protect } from "../middleware/auth_middleware.js";

const task_router = Router();

task_router.use(protect);

task_router.route("/").post(create_task).get(get_tasks);

export default task_router;
