import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import { verifyEmailConfig } from "./services/emailService.js";
import "./config/passport.js";

dotenv.config();

const app = express();

// Connect to DB and verify email config on startup
connectDB();
verifyEmailConfig();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);

// Health check
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", project: "Akiro", timestamp: new Date().toISOString() })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Akiro server running on http://localhost:${PORT}`);
  console.log(`📡 API base: http://localhost:${PORT}/api\n`);
});
