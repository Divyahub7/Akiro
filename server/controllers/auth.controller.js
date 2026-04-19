import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOTPEmail, sendWelcomeEmail } from "../services/emailService.js";
import crypto from "crypto";

// ─────────────────────────────────────────────────────────────
// HELPER: Generate a cryptographically secure 6-digit OTP
// ─────────────────────────────────────────────────────────────
const generateOTP = () => {
  // Use crypto for security — NOT Math.random()
  const buffer = crypto.randomBytes(3); // 3 bytes = 24 bits
  const otp = (parseInt(buffer.toString("hex"), 16) % 900000) + 100000;
  return otp.toString();
};

// ─────────────────────────────────────────────────────────────
// @POST /api/auth/register
// ─────────────────────────────────────────────────────────────
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.statusCode = 400;
    throw new Error("Please provide name, email, and password.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.statusCode = 409;
    throw new Error("An account with this email already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "student",
  });

  // Send welcome email to the newly registered user
  try {
    await sendWelcomeEmail(user.email, user.name);
  } catch (emailErr) {
    // Don't fail registration if email fails — just log
    console.error("Welcome email failed:", emailErr.message);
  }

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: "Registration successful.",
    token,
    user: user.toJSON(),
  });
});

// ─────────────────────────────────────────────────────────────
// @POST /api/auth/login
// Supports: password login + MFA trigger for ALL users
// ─────────────────────────────────────────────────────────────
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.statusCode = 400;
    throw new Error("Please provide email and password.");
  }

  // Fetch user — include password for comparison
  const user = await User.findOne({ email }).select("+password +mfaEnabled");
  if (!user || !(await user.matchPassword(password))) {
    res.statusCode = 401;
    throw new Error("Invalid email or password.");
  }

  // ── MFA FLOW: if user has MFA enabled ──
  if (user.mfaEnabled) {
    // Generate secure OTP for THIS specific user's email
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to DB (hashed for security)
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    user.mfaOtp = hashedOtp;
    user.mfaOtpExpiry = expiry;
    await user.save({ validateBeforeSave: false });

    // Send OTP to THIS user's registered email — dynamically
    await sendOTPEmail(user.email, user.name, otp);

    return res.status(200).json({
      success: true,
      mfaRequired: true,
      message: `A verification code has been sent to ${user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}`,
      userId: user._id,
    });
  }

  // ── Normal login ──
  const token = generateToken(user._id, user.role);
  res.status(200).json({
    success: true,
    token,
    user: user.toJSON(),
  });
});

// ─────────────────────────────────────────────────────────────
// @POST /api/auth/verify-mfa
// Verifies OTP for ANY user — not hardcoded
// ─────────────────────────────────────────────────────────────
export const verifyMFA = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    res.statusCode = 400;
    throw new Error("User ID and OTP are required.");
  }

  const user = await User.findById(userId).select("+mfaOtp +mfaOtpExpiry");
  if (!user) {
    res.statusCode = 404;
    throw new Error("User not found.");
  }

  // Check expiry first
  if (!user.mfaOtpExpiry || user.mfaOtpExpiry < new Date()) {
    user.mfaOtp = null;
    user.mfaOtpExpiry = null;
    await user.save({ validateBeforeSave: false });
    res.statusCode = 401;
    throw new Error("OTP has expired. Please login again to receive a new code.");
  }

  // Hash the incoming OTP and compare (never store plain OTPs)
  const hashedInput = crypto.createHash("sha256").update(otp.toString()).digest("hex");
  if (user.mfaOtp !== hashedInput) {
    res.statusCode = 401;
    throw new Error("Invalid OTP. Please check your email and try again.");
  }

  // Clear OTP after successful verification
  user.mfaOtp = null;
  user.mfaOtpExpiry = null;
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id, user.role);
  res.status(200).json({
    success: true,
    message: "MFA verified successfully.",
    token,
    user: user.toJSON(),
  });
});

// ─────────────────────────────────────────────────────────────
// @POST /api/auth/resend-otp
// Resends OTP to the user's email
// ─────────────────────────────────────────────────────────────
export const resendOTP = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.statusCode = 400;
    throw new Error("User ID is required.");
  }

  const user = await User.findById(userId).select("+mfaOtp +mfaOtpExpiry +mfaEnabled");
  if (!user) {
    res.statusCode = 404;
    throw new Error("User not found.");
  }

  if (!user.mfaEnabled) {
    res.statusCode = 400;
    throw new Error("MFA is not enabled for this account.");
  }

  // Rate limit: don't allow resend if OTP was issued < 60 seconds ago
  if (user.mfaOtpExpiry && user.mfaOtpExpiry > new Date(Date.now() + 9 * 60 * 1000)) {
    res.statusCode = 429;
    throw new Error("Please wait 60 seconds before requesting a new code.");
  }

  const otp = generateOTP();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  user.mfaOtp = hashedOtp;
  user.mfaOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  await sendOTPEmail(user.email, user.name, otp);

  res.status(200).json({
    success: true,
    message: `A new code has been sent to ${user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}`,
  });
});

// ─────────────────────────────────────────────────────────────
// @POST /api/auth/enable-mfa  (protected)
// ─────────────────────────────────────────────────────────────
export const enableMFA = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.mfaEnabled = true;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, message: "Two-factor authentication enabled." });
});

// ─────────────────────────────────────────────────────────────
// @POST /api/auth/disable-mfa  (protected)
// ─────────────────────────────────────────────────────────────
export const disableMFA = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.mfaEnabled = false;
  user.mfaOtp = null;
  user.mfaOtpExpiry = null;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, message: "Two-factor authentication disabled." });
});

// ─────────────────────────────────────────────────────────────
// @POST /api/auth/forgot-password
// Sends password reset link to user's email
// ─────────────────────────────────────────────────────────────
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.statusCode = 400;
    throw new Error("Email is required.");
  }

  const user = await User.findOne({ email });

  // Always return success — don't reveal if email exists (security)
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const { sendPasswordResetEmail } = await import("../services/emailService.js");
  await sendPasswordResetEmail(user.email, user.name, resetUrl);

  res.status(200).json({
    success: true,
    message: "If that email exists, a reset link has been sent.",
  });
});

// ─────────────────────────────────────────────────────────────
// @POST /api/auth/reset-password/:token
// ─────────────────────────────────────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    res.statusCode = 400;
    throw new Error("Password must be at least 6 characters.");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: new Date() },
  });

  if (!user) {
    res.statusCode = 400;
    throw new Error("Reset token is invalid or has expired.");
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successfully. Please login." });
});

// ─────────────────────────────────────────────────────────────
// OAuth Callback (Google + GitHub)
// ─────────────────────────────────────────────────────────────
export const oauthCallback = asyncHandler(async (req, res) => {
  const token = generateToken(req.user._id, req.user.role);
  res.redirect(`${process.env.CLIENT_URL}/auth/oauth-success?token=${token}`);
});
