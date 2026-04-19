import { Router } from "express";
import mockAuth from "../middleware/auth.js";
import { chat } from "../controllers/chat.controller.js";

const router = Router();

router.use(mockAuth);

router.post("/", chat);

export default router;
