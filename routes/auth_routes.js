import { Router } from "express";

import { register_user } from "../controllers/auth_controller.js";

const auth_router = Router();

auth_router.post("/register", register_user);

export default auth_router;
