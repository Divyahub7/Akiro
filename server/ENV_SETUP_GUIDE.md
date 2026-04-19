# 🔐 AKIRO — COMPLETE .ENV SETUP GUIDE
## From Zero to Fully Working — Step by Step

---

## ✅ YOUR FINAL .env FILE (backend/.env)

```env
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/akiro

JWT_SECRET=akiro_super_secret_2024_change_this_to_random_64_chars
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

GOOGLE_CLIENT_ID=123456789-abcdefgh.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop

GITHUB_CLIENT_ID=Iv1.abcdef1234567890
GITHUB_CLIENT_SECRET=abcdef1234567890abcdef1234567890abcdef12

EMAIL_USER=youremail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxx
```

---

# ═══════════════════════════════════════════════════════
# STEP 1 — MONGODB ATLAS (FREE — No Credit Card)
# ═══════════════════════════════════════════════════════

## 1.1 Create Account
1. Go to → https://cloud.mongodb.com
2. Click "Try Free" → Sign up with Google or Email
3. Verify your email

## 1.2 Create a FREE Cluster
1. After login → Click "Build a Database"
2. Choose "M0 FREE" (the free tier)
3. Provider: AWS | Region: closest to you (e.g. Mumbai, Singapore, US East)
4. Cluster Name: leave as "Cluster0"
5. Click "Create"

## 1.3 Create Database User
1. You'll see "Security Quickstart"
2. Under "Username and Password":
   - Username: akiro_user
   - Click "Autogenerate Secure Password" → COPY this password
3. Click "Create User"

## 1.4 Set Network Access (Allow all IPs for dev)
1. Click "Add My Current IP Address" (for local dev)
2. OR enter: 0.0.0.0/0 (allow all — ok for development)
3. Click "Finish and Close"

## 1.5 Get Connection String
1. Go to your cluster → Click "Connect"
2. Click "Drivers"
3. Copy the connection string, it looks like:
   mongodb+srv://akiro_user:<password>@cluster0.xxxxx.mongodb.net/
4. Replace <password> with your actual password
5. Add database name: /akiro at the end

✅ RESULT:
MONGO_URI=mongodb+srv://akiro_user:YourPassword@cluster0.xxxxx.mongodb.net/akiro

---

# ═══════════════════════════════════════════════════════
# STEP 2 — JWT SECRET (Generate a Strong One)
# ═══════════════════════════════════════════════════════

## Option A: Using Node.js (run in terminal):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

## Option B: Online generator:
Go to → https://generate-secret.vercel.app/64
Copy the output

✅ RESULT:
JWT_SECRET=a8f3d1e9b2c4f6a8d2e4b6c8f0a2d4e6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8

---

# ═══════════════════════════════════════════════════════
# STEP 3 — CLOUDINARY (FREE — 25GB storage)
# ═══════════════════════════════════════════════════════

## 3.1 Create Account (FREE — No Credit Card)
1. Go to → https://cloudinary.com/users/register_free
2. Sign up with Google or Email
3. Verify email

## 3.2 Get Your Credentials
1. After login → You're on the Dashboard
2. Look for "Product Environment Credentials" section
3. You'll see:
   - Cloud Name: (e.g. "dxyz123abc")
   - API Key: (e.g. "123456789012345")
   - API Secret: Click the eye icon to reveal it

✅ RESULT:
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

No additional setup needed — Cloudinary works out of the box.

---

# ═══════════════════════════════════════════════════════
# STEP 4 — GMAIL / EMAIL (For OTP — FREE)
# ═══════════════════════════════════════════════════════

## IMPORTANT: You need an App Password, NOT your Gmail password
## This allows ANY user who signs up to receive OTP emails

## 4.1 Enable 2-Step Verification on Gmail
1. Go to → https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the steps to enable it
4. (You need this to generate App Passwords)

## 4.2 Generate Gmail App Password
1. Go to → https://myaccount.google.com/apppasswords
   (If you don't see this, search "App passwords" in Google Account)
2. App name: type "Akiro"
3. Click "Create"
4. Google shows you a 16-character password like: "xxxx xxxx xxxx xxxx"
5. COPY IT IMMEDIATELY — Google won't show it again

✅ RESULT:
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

## HOW OTP WORKS FOR ALL USERS:
When ANY user registers and enables MFA → they get their own OTP sent
to their own email. It's fully dynamic — not hardcoded to one email.
Each OTP is:
  ✓ Cryptographically random (crypto.randomBytes)
  ✓ Hashed before storing in DB (SHA-256)
  ✓ Unique per login attempt
  ✓ Expires in 10 minutes automatically
  ✓ Deleted from DB after use

## Alternative: Use Resend (better for production — 3000 free emails/month)
1. Go to → https://resend.com → Sign up free
2. Get API key
3. Change emailService.js to use Resend SDK instead of nodemailer

---

# ═══════════════════════════════════════════════════════
# STEP 5 — GOOGLE OAUTH (FREE)
# ═══════════════════════════════════════════════════════

## 5.1 Go to Google Cloud Console
1. Go to → https://console.cloud.google.com
2. Sign in with your Google account
3. Create a new project:
   - Click the project dropdown (top left, next to Google Cloud logo)
   - Click "New Project"
   - Name: "Akiro"
   - Click "Create"

## 5.2 Enable Google OAuth API
1. In left sidebar → "APIs & Services" → "Library"
2. Search "Google+ API" or "Google Identity"
3. Click "Google+ API" → "Enable"

## 5.3 Create OAuth Credentials
1. Left sidebar → "APIs & Services" → "Credentials"
2. Click "+ Create Credentials" → "OAuth client ID"
3. First time: Click "Configure Consent Screen"
   - User Type: External → Create
   - App name: Akiro
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue" through all steps
4. Back to Credentials → Create Credentials → OAuth client ID
5. Application type: "Web application"
6. Name: "Akiro Web"
7. Authorized JavaScript origins:
   → http://localhost:5173
8. Authorized redirect URIs:
   → http://localhost:5000/api/auth/google/callback
9. Click "Create"
10. Copy Client ID and Client Secret

✅ RESULT:
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop

---

# ═══════════════════════════════════════════════════════
# STEP 6 — GITHUB OAUTH (FREE)
# ═══════════════════════════════════════════════════════

## 6.1 Create GitHub OAuth App
1. Go to → https://github.com/settings/developers
2. Click "OAuth Apps" in left sidebar
3. Click "New OAuth App"
4. Fill in:
   - Application name: Akiro
   - Homepage URL: http://localhost:5173
   - Authorization callback URL: http://localhost:5000/api/auth/github/callback
5. Click "Register application"
6. Copy Client ID
7. Click "Generate a new client secret" → Copy it

✅ RESULT:
GITHUB_CLIENT_ID=Iv1.abcdef1234567890
GITHUB_CLIENT_SECRET=abcdef1234567890abcdef1234567890abcdef12

---

# ═══════════════════════════════════════════════════════
# STEP 7 — ANTHROPIC API (AI Resume Analysis)
# ═══════════════════════════════════════════════════════

## 7.1 Check if Purchase is Needed
Free tier: Anthropic gives $5 free credit to new accounts
$5 = roughly 2,500–5,000 resume analyses
For a student project or demo: FREE tier is enough

## 7.2 Create Account
1. Go to → https://console.anthropic.com
2. Sign up with email
3. Verify your email

## 7.3 Get API Key
1. After login → Click "API Keys" in left sidebar
2. Click "+ Create Key"
3. Name: "Akiro"
4. Copy the key (starts with sk-ant-)

## 7.4 Add Billing (If Free Credits Run Out)
1. Left sidebar → "Billing"
2. Add a credit card
3. Set a spending limit (e.g. $10/month) for safety
4. Minimum top-up: $5

## Pricing Reference (as of 2024):
claude-sonnet → ~$3 per million input tokens
One resume analysis ≈ 1,000 tokens = $0.003 (less than half a cent)
$5 credit = ~1,600 analyses

✅ RESULT:
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxx

---

# ═══════════════════════════════════════════════════════
# STEP 8 — RUN THE PROJECT
# ═══════════════════════════════════════════════════════

## 8.1 Setup Backend
cd backend
cp .env.example .env
# Fill in all values from Steps 1-7 above
npm install
npm run dev

## Expected output:
# 🚀 Akiro server running on http://localhost:5000
# MongoDB connected: cluster0.xxxxx.mongodb.net
# ✅ Email service connected successfully

## 8.2 Setup Frontend
cd frontend
npm install
npm run dev

## Open browser: http://localhost:5173

---

# ═══════════════════════════════════════════════════════
# STEP 9 — COST SUMMARY
# ═══════════════════════════════════════════════════════

| Service      | Free Plan Limit        | Paid Plan Start |
|--------------|------------------------|-----------------|
| MongoDB      | 512MB storage, forever | $57/month       |
| Cloudinary   | 25GB storage, forever  | $89/month       |
| Gmail SMTP   | 500 emails/day, free   | Use Resend $20  |
| Google OAuth | Unlimited, free        | N/A             |
| GitHub OAuth | Unlimited, free        | N/A             |
| Anthropic    | $5 free credit         | $5 top-up       |

## For a student project: ALL FREE (or just $5 for Anthropic)
## For production with 1000+ users: ~$20-30/month total

---

# ═══════════════════════════════════════════════════════
# SECURITY CHECKLIST
# ═══════════════════════════════════════════════════════

✅ JWT secret is 64+ random characters
✅ OTPs are hashed with SHA-256 before storing
✅ OTPs expire in 10 minutes automatically
✅ OTPs are deleted from DB after use
✅ Passwords hashed with bcrypt (12 rounds)
✅ Email masked in API responses (jo***@gmail.com)
✅ Reset tokens hashed before storing
✅ Rate limiting on OTP resend (60 second cooldown)
✅ Never commit .env to Git — add to .gitignore
✅ Google/GitHub secrets kept server-side only

## Add to your .gitignore:
.env
node_modules/
