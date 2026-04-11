import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advance", "expert"],
      default: "beginner",
    },
    category: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Skill", skillSchema);
