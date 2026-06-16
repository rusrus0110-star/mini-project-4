import { Router } from "express";

import { login_user, register_user } from "../controllers/auth_controller.js";

const auth_router = Router();

auth_router.post("/register", register_user);
auth_router.post("/login", login_user);

export default auth_router;
