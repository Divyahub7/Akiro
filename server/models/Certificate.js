import mongoose from "mongoose";

const certificateSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    issuingOrganization: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      default: null, // null = no expiry
    },
    credentialUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Certificate", certificateSchema);
