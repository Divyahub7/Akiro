import Resume from "../models/Resume.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadResumePDF, extractTextFromPDF, deleteFromCloudinary } from "../services/fileService.js";
import { analyzeResumeWithAI } from "../services/aiService.js";

// ─── @POST /api/resumes/upload ────────────────────────────────────────────────
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.statusCode = 400;
    throw new Error("No PDF file provided.");
  }

  if (req.file.mimetype !== "application/pdf") {
    res.statusCode = 400;
    throw new Error("Only PDF files are accepted.");
  }

  // Upload to Cloudinary
  const uploadResult = await uploadResumePDF(req.file.buffer);

  // Extract text from PDF
  const parsedText = await extractTextFromPDF(req.file.buffer);

  const resume = await Resume.create({
    user: req.user._id,
    fileName: req.file.originalname,
    fileUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    parsedText,
  });

  res.status(201).json({
    success: true,
    message: "Resume uploaded successfully.",
    resume,
  });
});

// ─── @POST /api/resumes/:id/analyze ──────────────────────────────────────────
export const analyzeResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

  if (!resume) {
    res.statusCode = 404;
    throw new Error("Resume not found.");
  }

  if (!resume.parsedText || resume.parsedText.trim().length < 50) {
    res.statusCode = 400;
    throw new Error("Resume text too short or empty for analysis.");
  }

  const analysis = await analyzeResumeWithAI(resume.parsedText);

  resume.atsScore = analysis.atsScore;
  resume.sectionScores = analysis.sectionScores;
  resume.strengths = analysis.strengths;
  resume.suggestions = analysis.suggestions;
  resume.missingKeywords = analysis.missingKeywords;
  resume.overallFeedback = analysis.overallFeedback;
  resume.isAnalyzed = true;

  await resume.save();

  res.status(200).json({
    success: true,
    message: "Resume analyzed successfully.",
    resume,
  });
});

// ─── @GET /api/resumes ────────────────────────────────────────────────────────
export const getUserResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: resumes.length, resumes });
});

// ─── @GET /api/resumes/:id ────────────────────────────────────────────────────
export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.statusCode = 404;
    throw new Error("Resume not found.");
  }
  res.status(200).json({ success: true, resume });
});

// ─── @DELETE /api/resumes/:id ─────────────────────────────────────────────────
export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.statusCode = 404;
    throw new Error("Resume not found.");
  }

  await deleteFromCloudinary(resume.publicId, "raw");
  await resume.deleteOne();

  res.status(200).json({ success: true, message: "Resume deleted successfully." });
});
