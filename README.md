<div align="center">

<br/>

```
 █████╗ ██╗  ██╗██╗██████╗  ██████╗
██╔══██╗██║ ██╔╝██║██╔══██╗██╔═══██╗
███████║█████╔╝ ██║██████╔╝██║   ██║
██╔══██║██╔═██╗ ██║██╔══██╗██║   ██║
██║  ██║██║  ██╗██║██║  ██║╚██████╔╝
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝
```

**AI-Powered Internship & Career Advisor**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br/>

_Track your career. Analyze your resume. Chat with your AI mentor._

</div>

---

## 📌 Overview

**Akiro** is a full-stack AI-powered career platform built with the **MERN stack**. It helps students and early-career professionals manage their career journey — from tracking skills and internships to analyzing resumes and chatting with a personalized AI assistant that remembers your history.

> Built in 45 days. Powered by OpenAI / Claude API. Designed to get you hired.

---

## ✨ Features

| Feature                    | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| 🔐 **Authentication**      | Secure JWT-based login & registration with bcrypt          |
| 📊 **Career Dashboard**    | Career score, analytics charts, progress overview          |
| 🧠 **AI Chatbot**          | Personalized AI mentor with persistent memory via MongoDB  |
| 📄 **Resume Analyzer**     | Upload resume → get ATS score + AI improvement suggestions |
| 💼 **Job Tracker**         | Track applications with status updates (Kanban-style)      |
| 🏆 **Achievement Hub**     | Log skills, certificates, hackathons & internships         |
| 🎯 **Job Recommendations** | AI-matched job roles based on your profile                 |
| 🔍 **Skill Gap Analysis**  | Compare your skills vs industry requirements               |
| 🌐 **Multi-language**      | i18n support for global users                              |
| 🎙️ **Voice Commands**      | Hands-free interaction support                             |
| 🔔 **Notifications**       | In-app notification system                                 |
| 🎨 **Dark / Light Mode**   | Theme toggle with persistence                              |

---

## 🛠️ Tech Stack

```
Frontend        →  React (Vite) + Tailwind CSS + Framer Motion
State           →  Redux Toolkit + RTK Query
Routing         →  React Router v6
HTTP Client     →  Axios (via RTK Query base query)
Backend         →  Node.js + Express.js
Database        →  MongoDB Atlas + Mongoose
Authentication  →  JWT + bcryptjs
AI              →  OpenAI API / Claude API
File Storage    →  Multer + Cloudinary / AWS S3
Deployment      →  Vercel (Frontend) + Render (Backend)
```

---

## 📁 Folder Structure

```
akiro/
│
├── client/                                    # ⚛️  React Frontend (Vite)
│   ├── public/
│   │   └── akiro-logo.svg
│   │
│   └── src/
│       │
│       ├── app/                               # Redux store setup
│       │   ├── store.js                       # configureStore — root Redux store
│       │   └── rootReducer.js                 # Combined reducers
│       │
│       ├── features/                          # RTK slices (one per domain)
│       │   ├── auth/
│       │   │   ├── authSlice.js               # isAuthenticated, user, token state
│       │   │   └── authApi.js                 # RTK Query: login, register, logout
│       │   ├── user/
│       │   │   ├── userSlice.js               # Profile data, career score
│       │   │   └── userApi.js                 # RTK Query: getProfile, updateProfile
│       │   ├── skills/
│       │   │   ├── skillsSlice.js             # Skills list, active skill
│       │   │   └── skillsApi.js               # RTK Query: CRUD for skills
│       │   ├── certificates/
│       │   │   ├── certificatesSlice.js
│       │   │   └── certificatesApi.js
│       │   ├── internships/
│       │   │   ├── internshipsSlice.js
│       │   │   └── internshipsApi.js
│       │   ├── hackathons/
│       │   │   ├── hackathonsSlice.js
│       │   │   └── hackathonsApi.js
│       │   ├── resume/
│       │   │   ├── resumeSlice.js             # ATS score, suggestions, upload state
│       │   │   └── resumeApi.js               # RTK Query: upload resume, analyze
│       │   ├── jobs/
│       │   │   ├── jobsSlice.js               # Applications list, Kanban columns
│       │   │   └── jobsApi.js                 # RTK Query: CRUD + recommendations
│       │   ├── chat/
│       │   │   ├── chatSlice.js               # Messages, loading, active session
│       │   │   └── chatApi.js                 # RTK Query: send message, fetch history
│       │   ├── notifications/
│       │   │   ├── notificationsSlice.js      # Notification list, unread count
│       │   │   └── notificationsApi.js
│       │   └── skillGap/
│       │       ├── skillGapSlice.js           # Gap analysis results
│       │       └── skillGapApi.js
│       │
│       ├── components/                        # Reusable UI components
│       │   │
│       │   ├── layout/                        # App shell components
│       │   │   ├── Navbar.jsx                 # Top navigation bar
│       │   │   ├── Sidebar.jsx                # Left sidebar with nav links
│       │   │   ├── MobileSidebar.jsx          # Slide-out drawer for mobile
│       │   │   ├── PageWrapper.jsx            # Consistent page padding & layout
│       │   │   └── Footer.jsx
│       │   │
│       │   ├── ui/                            # Atomic UI primitives (design system)
│       │   │   ├── Button.jsx                 # Primary, secondary, ghost variants
│       │   │   ├── Input.jsx                  # Controlled input with validation state
│       │   │   ├── Textarea.jsx
│       │   │   ├── Modal.jsx                  # Reusable modal with backdrop
│       │   │   ├── Drawer.jsx                 # Slide-in side panel
│       │   │   ├── Tooltip.jsx
│       │   │   ├── Badge.jsx                  # Status tags ("Applied", "Expert")
│       │   │   ├── Avatar.jsx                 # User avatar with fallback initials
│       │   │   ├── Spinner.jsx                # Loading spinner
│       │   │   ├── Skeleton.jsx               # Skeleton loading placeholders
│       │   │   ├── Alert.jsx                  # Success / error / info banners
│       │   │   ├── ProgressBar.jsx            # Career score & skill level bars
│       │   │   ├── Tabs.jsx                   # Tab navigation component
│       │   │   ├── Dropdown.jsx               # Select / menu dropdown
│       │   │   ├── Toggle.jsx                 # On/off switches
│       │   │   ├── Card.jsx                   # Reusable card container
│       │   │   ├── EmptyState.jsx             # Illustration + message for empty lists
│       │   │   └── ConfirmDialog.jsx          # Delete confirmation dialog
│       │   │
│       │   ├── charts/                        # Data visualization components
│       │   │   ├── CareerScoreChart.jsx       # Radial/gauge chart for career score
│       │   │   ├── SkillsRadarChart.jsx       # Radar chart for skill distribution
│       │   │   ├── ActivityLineChart.jsx      # Timeline of user activity
│       │   │   ├── ApplicationPieChart.jsx    # Job application status breakdown
│       │   │   └── SkillGapBarChart.jsx       # Skill gap comparison bars
│       │   │
│       │   ├── forms/                         # Shared form building blocks
│       │   │   ├── FormField.jsx              # Label + Input + error message wrapper
│       │   │   ├── FileUpload.jsx             # Drag-and-drop file upload zone
│       │   │   ├── TagInput.jsx               # Multi-tag input (for skills)
│       │   │   ├── DatePicker.jsx
│       │   │   └── SearchBar.jsx             # Global search input with debounce
│       │   │
│       │   ├── cards/                         # Domain-specific display cards
│       │   │   ├── SkillCard.jsx              # Individual skill display card
│       │   │   ├── CertificateCard.jsx
│       │   │   ├── InternshipCard.jsx
│       │   │   ├── HackathonCard.jsx
│       │   │   ├── JobApplicationCard.jsx     # Kanban card for job tracker
│       │   │   └── RecommendedJobCard.jsx     # AI-recommended job card
│       │   │
│       │   ├── chat/                          # Chatbot UI components
│       │   │   ├── ChatWindow.jsx             # Main scrollable chat container
│       │   │   ├── ChatMessage.jsx            # Single message bubble (user / AI)
│       │   │   ├── ChatInput.jsx              # Textarea + send + voice button
│       │   │   ├── ChatTypingIndicator.jsx    # Animated "AI is typing..."
│       │   │   ├── ChatSessionList.jsx        # Past chat sessions sidebar
│       │   │   └── ChatWelcomeBanner.jsx      # First-time user greeting
│       │   │
│       │   ├── resume/                        # Resume analyzer UI components
│       │   │   ├── ResumeUploadZone.jsx       # PDF drag-and-drop area
│       │   │   ├── ATSScoreCard.jsx           # Score ring + percentage display
│       │   │   ├── SuggestionList.jsx         # AI improvement bullet points
│       │   │   └── ResumePreview.jsx          # Embedded PDF viewer
│       │   │
│       │   ├── jobs/                          # Job tracker UI components
│       │   │   ├── KanbanBoard.jsx            # Drag-and-drop Kanban board
│       │   │   ├── KanbanColumn.jsx           # Single status column
│       │   │   ├── AddJobModal.jsx            # Form modal to add new application
│       │   │   └── JobFilterBar.jsx           # Filter by status, date, company
│       │   │
│       │   ├── notifications/
│       │   │   ├── NotificationBell.jsx       # Bell icon with unread count badge
│       │   │   ├── NotificationPanel.jsx      # Dropdown notification list
│       │   │   └── NotificationItem.jsx       # Single notification row
│       │   │
│       │   └── common/                        # Miscellaneous shared components
│       │       ├── ThemeToggle.jsx            # Dark / light mode switch button
│       │       ├── LanguageSwitcher.jsx       # i18n language dropdown
│       │       ├── VoiceCommandButton.jsx     # Mic button for voice input
│       │       ├── ScrollToTop.jsx            # Auto-scroll to top on route change
│       │       └── ProtectedRoute.jsx         # Auth guard for private routes
│       │
│       ├── pages/                             # Route-level page components
│       │   ├── Auth/
│       │   │   ├── LoginPage.jsx
│       │   │   ├── RegisterPage.jsx
│       │   │   └── ForgotPasswordPage.jsx
│       │   ├── Dashboard/
│       │   │   └── DashboardPage.jsx          # Career score + all section summaries
│       │   ├── Profile/
│       │   │   └── ProfilePage.jsx            # View & edit user profile
│       │   ├── Skills/
│       │   │   └── SkillsPage.jsx             # Skills + certificates hub
│       │   ├── Internships/
│       │   │   └── InternshipsPage.jsx
│       │   ├── Hackathons/
│       │   │   └── HackathonsPage.jsx
│       │   ├── Resume/
│       │   │   └── ResumeAnalyzerPage.jsx
│       │   ├── Jobs/
│       │   │   ├── JobTrackerPage.jsx         # Kanban board view
│       │   │   └── RecommendedJobsPage.jsx    # AI job suggestions list
│       │   ├── SkillGap/
│       │   │   └── SkillGapPage.jsx
│       │   ├── Chatbot/
│       │   │   └── ChatbotPage.jsx
│       │   ├── Notifications/
│       │   │   └── NotificationsPage.jsx
│       │   ├── Settings/
│       │   │   └── SettingsPage.jsx           # Theme, language, account settings
│       │   └── NotFound/
│       │       └── NotFoundPage.jsx           # 404 page
│       │
│       ├── hooks/                             # Custom React hooks
│       │   ├── useAuth.js                     # Auth state + redirect logic
│       │   ├── useCareerScore.js              # Computed career score logic
│       │   ├── useVoiceCommand.js             # Web Speech API integration
│       │   ├── useTheme.js                    # Dark/light mode toggle
│       │   ├── useDebounce.js                 # Debounce input values
│       │   ├── useLocalStorage.js             # Persist small values to localStorage
│       │   └── useMediaQuery.js              # Responsive breakpoint detection
│       │
│       ├── context/                           # Lightweight React contexts (non-Redux)
│       │   ├── ThemeContext.jsx               # Dark / light mode provider
│       │   └── LanguageContext.jsx            # i18n active language provider
│       │
│       ├── services/                          # Axios base configuration
│       │   └── axiosBaseQuery.js              # RTK Query base query with auth headers
│       │
│       ├── utils/                             # Pure utility/helper functions
│       │   ├── formatDate.js
│       │   ├── calculateCareerScore.js        # Client-side career score algorithm
│       │   ├── atsParser.js                   # Resume text helpers
│       │   ├── validators.js                  # Form validation rules
│       │   └── constants.js                   # App-wide constants & enums
│       │
│       ├── locales/                           # i18n translation files
│       │   ├── en.json
│       │   ├── hi.json
│       │   └── ...
│       │
│       ├── assets/                            # Static assets
│       │   ├── images/
│       │   ├── icons/
│       │   └── fonts/
│       │
│       ├── styles/
│       │   ├── index.css                      # Tailwind base directives
│       │   └── animations.css                 # Custom keyframe animations
│       │
│       ├── App.jsx                            # Root component + all route definitions
│       └── main.jsx                           # Vite entry point + Redux Provider wrap
│
│
├── server/                                    # 🟢  Node.js + Express Backend
│   │
│   ├── controllers/                           # Route handlers & business logic
│   │   ├── auth.controller.js                 # Register, login, refresh token
│   │   ├── user.controller.js                 # Get/update profile, career score
│   │   ├── skill.controller.js                # CRUD for skills
│   │   ├── certificate.controller.js
│   │   ├── internship.controller.js
│   │   ├── hackathon.controller.js
│   │   ├── resume.controller.js               # Upload, parse, AI analyze resume
│   │   ├── job.controller.js                  # Application CRUD + status update
│   │   ├── recommendation.controller.js       # AI job recommendation engine
│   │   ├── skillGap.controller.js             # AI skill gap analysis
│   │   ├── chat.controller.js                 # Send message, fetch history
│   │   └── notification.controller.js         # Get & mark notifications read
│   │
│   ├── models/                                # Mongoose schemas
│   │   ├── User.js                            # name, email, password, avatar, bio
│   │   ├── Skill.js                           # name, level, category, userId
│   │   ├── Certificate.js                     # title, issuer, date, fileUrl, userId
│   │   ├── Internship.js                      # company, role, duration, userId
│   │   ├── Hackathon.js                       # name, result, date, userId
│   │   ├── Resume.js                          # fileUrl, atsScore, suggestions, userId
│   │   ├── Application.js                     # company, role, status, userId
│   │   ├── Chat.js                            # sessionId, messages[], userId
│   │   └── Notification.js                    # message, type, isRead, userId
│   │
│   ├── routes/                                # Express route definitions
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── skill.routes.js
│   │   ├── certificate.routes.js
│   │   ├── internship.routes.js
│   │   ├── hackathon.routes.js
│   │   ├── resume.routes.js
│   │   ├── job.routes.js
│   │   ├── recommendation.routes.js
│   │   ├── skillGap.routes.js
│   │   ├── chat.routes.js
│   │   └── notification.routes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js                  # Verify JWT, attach req.user
│   │   ├── errorHandler.js                    # Global error response handler
│   │   ├── rateLimiter.js                     # API rate limiting (express-rate-limit)
│   │   └── validateRequest.js                 # Request body validation (Zod/Joi)
│   │
│   ├── services/                              # External service integrations
│   │   ├── aiService.js                       # OpenAI / Claude API wrapper
│   │   ├── fileService.js                     # Cloudinary / S3 upload logic
│   │   ├── resumeParser.js                    # PDF text extraction (pdf-parse)
│   │   └── notificationService.js             # Create & dispatch notifications
│   │
│   ├── utils/
│   │   ├── generateToken.js                   # JWT sign & verify helpers
│   │   ├── careerScoreCalculator.js           # Score computation logic
│   │   ├── promptBuilder.js                   # Build AI prompts dynamically
│   │   └── asyncHandler.js                    # Wrap async route handlers (no try/catch)
│   │
│   ├── config/
│   │   ├── db.js                              # MongoDB Atlas connection
│   │   └── cloudinary.js                      # Cloudinary SDK config
│   │
│   └── index.js                               # Express app entry point
│
│
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB Atlas account
- OpenAI or Claude API key
- Cloudinary account (for resume & certificate uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/Divyahub7/akiro.git
cd akiro
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`

### 4. Key Frontend Packages

```bash
npm install @reduxjs/toolkit react-redux
npm install react-router-dom
npm install framer-motion
npm install recharts
npm install react-i18next i18next
npm install react-dropzone
npm install @hello-pangea/dnd
```

---

## 🗺️ Development Roadmap

```
Phase 1  ──────  Planning & Requirement Analysis     [Day 1–3]
Phase 2  ──────  Project Setup                       [Day 4–6]
Phase 3  ──────  Database Design (MongoDB Schemas)   [Day 7–9]
Phase 4  ──────  Backend Development (REST APIs)     [Day 10–18]
Phase 5  ──────  Frontend Development (React UI)     [Day 19–28]
Phase 6  ──────  AI Integration                      [Day 29–35]
Phase 7  ──────  Advanced Features (Voice, i18n)     [Day 36–40]
Phase 8  ──────  Testing (Postman, UI testing)       [Day 41–43]
Phase 9  ──────  Deployment (Vercel + Render)        [Day 44–45]
Phase 10 ──────  Optimization & Scaling              [Ongoing]
```

---

## 🗃️ MongoDB Collections

| Collection      | Purpose                                 |
| --------------- | --------------------------------------- |
| `users`         | User profiles & auth                    |
| `skills`        | User skill entries                      |
| `certificates`  | Uploaded certificates                   |
| `internships`   | Internship records                      |
| `hackathons`    | Hackathon participations                |
| `resumes`       | Uploaded resumes + ATS scores           |
| `applications`  | Job applications + Kanban status        |
| `chats`         | AI chat sessions + full message history |
| `notifications` | In-app notification records             |

---

## 🤖 AI Features Deep Dive

### Resume Analyzer

1. User uploads PDF resume via drag-and-drop
2. Text extracted server-side via `pdf-parse`
3. Sent to OpenAI/Claude with a structured prompt
4. Returns ATS score + categorized improvement suggestions

### AI Chatbot (with Memory)

1. User sends a message
2. Server fetches full session history from MongoDB
3. User profile data injected into prompt as context
4. AI response saved to DB and streamed back to frontend

### Job Recommendations

- Analyzes user skills, resume keywords, and internship history
- AI matches against industry role requirements
- Returns ranked job suggestions with match percentage

### Skill Gap Analysis

- User selects a target role
- AI compares current skills vs role requirements
- Returns missing skills + recommended learning resources

---

## 🚀 Deployment

| Service  | Platform                                   |
| -------- | ------------------------------------------ |
| Frontend | [Vercel](https://vercel.com)               |
| Backend  | [Render](https://render.com)               |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) |
| Files    | [Cloudinary](https://cloudinary.com)       |

---

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <b>Divya</b><br/>
      <a href="https://github.com/Divya">@Divyahub7</a>
    </td>
    <!-- <td align="center">
      <b>Teammate Name</b><br/>
      <a href="https://github.com/teammate-handle">@teammate-handle</a>
    </td> -->
  </tr>
</table>

<div align="center">
  <sub>Built with ❤️ by the Akiro team</sub>
</div>
