import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    parsedText: { type: String, default: "" },

    // AI Analysis Results
    atsScore: { type: Number, default: 0, min: 0, max: 100 },
    suggestions: [{ type: String }],
    strengths: [{ type: String }],
    missingKeywords: [{ type: String }],
    sectionScores: {
      contact: { type: Number, default: 0 },
      summary: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
    },
    overallFeedback: { type: String, default: "" },
    isAnalyzed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
