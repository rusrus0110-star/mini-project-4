import { Router } from "express";

import {
  get_current_user,
  login_user,
  register_user,
} from "../controllers/auth_controller.js";
import { protect } from "../middleware/auth_middleware.js";

const auth_router = Router();

auth_router.post("/register", register_user);
auth_router.post("/login", login_user);
auth_router.get("/me", protect, get_current_user);

export default auth_router;
