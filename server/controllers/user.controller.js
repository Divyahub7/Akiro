import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculateCareerScore } from "../utils/careerScoreCalculator.js";
import { uploadAvatar, deleteFromCloudinary } from "../services/fileService.js";

// ─── @GET /api/users/profile ──────────────────────────────────────────────────
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.statusCode = 404;
    throw new Error("User not found.");
  }

  const { total, breakdown } = calculateCareerScore(user);

  res.status(200).json({
    success: true,
    user: {
      ...user.toJSON(),
      careerScore: total,
      careerScoreBreakdown: breakdown,
    },
  });
});

// ─── @PUT /api/users/profile ──────────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "headline", "bio", "skills", "projects", "internships", "certificates"];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  const { total, breakdown } = calculateCareerScore(user);
  user.careerScore = total;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: {
      ...user.toJSON(),
      careerScore: total,
      careerScoreBreakdown: breakdown,
    },
  });
});

// ─── @POST /api/users/avatar ──────────────────────────────────────────────────
export const uploadUserAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.statusCode = 400;
    throw new Error("No image file provided.");
  }

  const user = await User.findById(req.user._id);

  // Delete old avatar if it exists
  if (user.avatarPublicId) {
    await deleteFromCloudinary(user.avatarPublicId, "image");
  }

  const result = await uploadAvatar(req.file.buffer);

  user.avatar = result.secure_url;
  user.avatarPublicId = result.public_id;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Avatar uploaded successfully.",
    avatar: user.avatar,
  });
});

// ─── @GET /api/users/dashboard ────────────────────────────────────────────────
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.statusCode = 404;
    throw new Error("User not found.");
  }

  const { total, breakdown } = calculateCareerScore(user);

  res.status(200).json({
    success: true,
    dashboard: {
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      careerScore: total,
      careerScoreBreakdown: breakdown,
      skillsCount: user.skills.length,
      projectsCount: user.projects.length,
      internshipsCount: user.internships.length,
      certificatesCount: user.certificates.length,
      memberSince: user.createdAt,
    },
  });
});

// ─── @GET /api/users/:id (Admin only) ─────────────────────────────────────────
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.statusCode = 404;
    throw new Error("User not found.");
  }
  res.status(200).json({ success: true, user: user.toJSON() });
});
