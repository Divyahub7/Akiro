import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["student", "faculty", "admin"], default: "student" },
    avatar: { type: String, default: "" },
    avatarPublicId: { type: String, default: "" },

    // OAuth
    googleId: { type: String, default: null },
    githubId: { type: String, default: null },

    // Profile fields (M2)
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: [{ type: String }],
    projects: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],
    internships: [
      {
        company: String,
        role: String,
        duration: String,
      },
    ],
    certificates: [
      {
        name: String,
        issuer: String,
        year: Number,
      },
    ],
    careerScore: { type: Number, default: 0 },

    // MFA
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String, default: null },
    mfaOtp: { type: String, default: null },
    mfaOtpExpiry: { type: Date, default: null },

    // Account
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Exclude sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.mfaSecret;
  delete obj.mfaOtp;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
