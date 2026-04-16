import express from "express";
import multer from "multer";
import {
  getProfile,
  updateProfile,
  uploadUserAvatar,
  getDashboardSummary,
  getUserById,
} from "../controllers/user.controller.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/avatar", protect, upload.single("avatar"), uploadUserAvatar);
router.get("/dashboard", protect, getDashboardSummary);
router.get("/:id", protect, authorize("admin"), getUserById);

export default router;
