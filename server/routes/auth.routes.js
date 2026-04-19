import express from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  verifyMFA,
  resendOTP,
  enableMFA,
  disableMFA,
  forgotPassword,
  resetPassword,
  oauthCallback,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Local Auth ──────────────────────────────────────────────
router.post("/register", registerUser);
router.post("/login", loginUser);

// ── MFA (works for ALL users, not hardcoded) ────────────────
router.post("/verify-mfa", verifyMFA);
router.post("/resend-otp", resendOTP);

// ── MFA Settings (protected) ────────────────────────────────
router.post("/enable-mfa", protect, enableMFA);
router.post("/disable-mfa", protect, disableMFA);

// ── Password Reset ──────────────────────────────────────────
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ── Google OAuth ────────────────────────────────────────────
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth` }),
  oauthCallback
);

// ── GitHub OAuth ────────────────────────────────────────────
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth` }),
  oauthCallback
);

export default router;
