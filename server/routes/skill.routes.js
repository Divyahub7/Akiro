import { Router } from "express";
import mockAuth from "../middleware/auth.js";
import {
  addSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "../controllers/skill.controller.js";

const router = Router();

router.use(mockAuth);

router.post("/", addSkill);
router.get("/", getSkills);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
