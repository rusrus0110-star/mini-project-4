import { Router } from "express";

import {
  create_task,
  delete_task,
  get_task_by_id,
  get_tasks,
  update_task,
} from "../controllers/task_controller.js";
import { protect } from "../middleware/auth_middleware.js";

const task_router = Router();

task_router.use(protect);

task_router.route("/").post(create_task).get(get_tasks);

task_router
  .route("/:task_id")
  .get(get_task_by_id)
  .put(update_task)
  .delete(delete_task);

export default task_router;
