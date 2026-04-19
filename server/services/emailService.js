import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ─────────────────────────────────────────────────────────────
// Create transporter — works for Gmail (free) and any SMTP
// ─────────────────────────────────────────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (NOT your real password)
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// ─────────────────────────────────────────────────────────────
// Shared HTML email wrapper — professional branded template
// ─────────────────────────────────────────────────────────────
const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Akiro</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #0f172a; font-family: 'Segoe UI', Arial, sans-serif; color: #e2e8f0; }
    .wrapper { max-width: 560px; margin: 40px auto; }
    .card { background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 40px; text-align: center; }
    .logo { display: inline-flex; align-items: center; gap: 10px; }
    .logo-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 10px;
                 display: inline-flex; align-items: center; justify-content: center;
                 font-size: 22px; font-weight: 900; color: white; }
    .logo-text { font-size: 24px; font-weight: 900; color: white; letter-spacing: -0.5px; }
    .body { padding: 40px; }
    .greeting { font-size: 22px; font-weight: 700; color: #f1f5f9; margin-bottom: 12px; }
    .text { font-size: 15px; color: #94a3b8; line-height: 1.7; margin-bottom: 20px; }
    .otp-box { background: #0f172a; border: 2px dashed #4f46e5; border-radius: 12px;
               text-align: center; padding: 28px 20px; margin: 28px 0; }
    .otp-label { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 10px; }
    .otp-code { font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #818cf8;
                font-family: 'Courier New', monospace; }
    .otp-timer { font-size: 13px; color: #64748b; margin-top: 10px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed);
           color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px;
           font-weight: 600; font-size: 15px; margin: 16px 0; }
    .divider { border: none; border-top: 1px solid #334155; margin: 28px 0; }
    .warning { background: #422006; border: 1px solid #92400e; border-radius: 8px;
               padding: 14px 18px; font-size: 13px; color: #fbbf24; margin-top: 20px; line-height: 1.6; }
    .footer { text-align: center; padding: 24px 40px; background: #0f172a; }
    .footer-text { font-size: 12px; color: #475569; line-height: 1.8; }
    .footer-link { color: #6366f1; text-decoration: none; }
    .badge { display: inline-block; background: #1e3a5f; border: 1px solid #1e40af;
             color: #60a5fa; font-size: 11px; font-weight: 600; padding: 3px 10px;
             border-radius: 999px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
    .check-item { display: flex; gap: 10px; margin-bottom: 10px; font-size: 14px; color: #94a3b8; }
    .check-icon { color: #10b981; flex-shrink: 0; font-weight: bold; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo">
          <div class="logo-icon">A</div>
          <div class="logo-text">Akiro</div>
        </div>
        <div style="margin-top:8px; font-size:13px; color:rgba(255,255,255,0.7);">
          AI Career Intelligence Platform
        </div>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <div class="footer-text">
          © ${new Date().getFullYear()} Akiro. All rights reserved.<br/>
          This is an automated email — please do not reply.<br/>
          <a href="${process.env.CLIENT_URL}" class="footer-link">Visit Akiro</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// ─────────────────────────────────────────────────────────────
// 1. OTP Email — sent to ANY user who logs in with MFA enabled
//    The OTP is generated fresh each time — fully dynamic
// ─────────────────────────────────────────────────────────────
export const sendOTPEmail = async (toEmail, userName, otp) => {
  const transporter = createTransporter();

  const content = `
    <div class="badge">Security Alert</div>
    <div class="greeting">Your login verification code</div>
    <p class="text">Hi <strong style="color:#e2e8f0">${userName}</strong>,</p>
    <p class="text">
      A login attempt was made on your Akiro account. Use the code below to complete sign-in.
      This code is unique to you and expires in <strong style="color:#f1f5f9">10 minutes</strong>.
    </p>
    <div class="otp-box">
      <div class="otp-label">One-Time Password</div>
      <div class="otp-code">${otp}</div>
      <div class="otp-timer">⏱ Expires in 10 minutes</div>
    </div>
    <div class="warning">
      ⚠️ <strong>Security Notice:</strong> Never share this code with anyone.
      Akiro will never ask for your OTP by phone or email.
      If you didn't attempt to log in, please <a href="${process.env.CLIENT_URL}/login" style="color:#fbbf24">secure your account</a> immediately.
    </div>
  `;

  await transporter.sendMail({
    from: `"Akiro Security" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${otp} is your Akiro verification code`,
    html: emailWrapper(content),
  });

  console.log(`✅ OTP email sent to ${toEmail}`);
};

// ─────────────────────────────────────────────────────────────
// 2. Welcome Email — sent on registration to every new user
// ─────────────────────────────────────────────────────────────
export const sendWelcomeEmail = async (toEmail, userName) => {
  const transporter = createTransporter();

  const content = `
    <div class="greeting">Welcome to Akiro, ${userName}! 🎉</div>
    <p class="text">
      You've successfully created your account. Akiro helps you land your dream career with
      AI-powered resume analysis, career scoring, and personalized insights.
    </p>
    <hr class="divider" />
    <p style="font-size:14px; color:#64748b; margin-bottom:16px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">
      What you can do now:
    </p>
    <div class="check-item"><span class="check-icon">✓</span> Build your profile and career score</div>
    <div class="check-item"><span class="check-icon">✓</span> Upload your resume for AI analysis</div>
    <div class="check-item"><span class="check-icon">✓</span> Get ATS score and improvement tips</div>
    <div class="check-item"><span class="check-icon">✓</span> Enable two-factor authentication for security</div>
    <hr class="divider" />
    <div style="text-align:center">
      <a href="${process.env.CLIENT_URL}/dashboard" class="btn">Go to Dashboard →</a>
    </div>
  `;

  await transporter.sendMail({
    from: `"Akiro" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Welcome to Akiro, ${userName}!`,
    html: emailWrapper(content),
  });
};

// ─────────────────────────────────────────────────────────────
// 3. Password Reset Email
// ─────────────────────────────────────────────────────────────
export const sendPasswordResetEmail = async (toEmail, userName, resetUrl) => {
  const transporter = createTransporter();

  const content = `
    <div class="badge">Password Reset</div>
    <div class="greeting">Reset your password</div>
    <p class="text">Hi <strong style="color:#e2e8f0">${userName}</strong>,</p>
    <p class="text">
      We received a request to reset your Akiro account password.
      Click the button below to set a new password. This link expires in <strong style="color:#f1f5f9">15 minutes</strong>.
    </p>
    <div style="text-align:center; margin: 28px 0;">
      <a href="${resetUrl}" class="btn">Reset Password →</a>
    </div>
    <p class="text" style="font-size:13px;">
      Or copy this link into your browser:<br/>
      <span style="color:#6366f1; word-break:break-all;">${resetUrl}</span>
    </p>
    <div class="warning">
      ⚠️ If you didn't request a password reset, ignore this email.
      Your password will remain unchanged. The link expires automatically.
    </div>
  `;

  await transporter.sendMail({
    from: `"Akiro Security" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your Akiro password",
    html: emailWrapper(content),
  });
};

// ─────────────────────────────────────────────────────────────
// Verify email transporter on startup
// ─────────────────────────────────────────────────────────────
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email service connected successfully");
  } catch (err) {
    console.error("❌ Email service error:", err.message);
    console.error("   Check EMAIL_USER and EMAIL_PASS in your .env file");
  }
};
