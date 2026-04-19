import { Router } from "express";
import {
  addCertificate,
  getCertificate,
  updateCertificate,
  deleteCertificate,
} from "../controllers/certificate.controller.js";
import mockAuth from "../middleware/auth.js";

const router = Router();

router.use(mockAuth);

router.post("/", addCertificate);
router.get("/", getCertificate);
router.put("/:id", updateCertificate);
router.delete("/:id", deleteCertificate);

export default router;
