import express from "express";
import multer from "multer";
import {
  uploadResume,
  analyzeResume,
  getUserResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resume.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

router.get("/", protect, getUserResumes);
router.post("/upload", protect, upload.single("resume"), uploadResume);
router.post("/:id/analyze", protect, analyzeResume);
router.get("/:id", protect, getResumeById);
router.delete("/:id", protect, deleteResume);

export default router;
