<<<<<<< HEAD
import { GoogleGenerativeAI } from "@google/generative-ai";
import Skill from "../models/Skill.js";
import Certificate from "../models/Certificate.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildSystemPrompt = (skills, certificates) => {
  return `
You are a smart AI assistant embedded in Akiro, a personal portfolio platform.
You have access to the user's portfolio data below.
Answer questions about their profile using this data when relevant.
For general questions not related to the portfolio, answer normally as a helpful assistant.

--- USER PORTFOLIO DATA ---

SKILLS:
${
  skills.length > 0
    ? skills
        .map(
          (s) =>
            `- ${s.name} (${s.level}) ${s.category ? `| ${s.category}` : ""}`,
        )
        .join("\n")
    : "No skills added yet."
}

CERTIFICATES:
${
  certificates.length > 0
    ? certificates
        .map(
          (c) =>
            `- ${c.title} by ${c.issuingOrganization} (Issued: ${new Date(c.issueDate).toDateString()})`,
        )
        .join("\n")
    : "No certificates added yet."
}

--- END OF DATA ---

Always be concise, helpful, and professional.
If asked about something not in the portfolio data, say so honestly and answer based on general knowledge if possible.
  `.trim();
};

export const getChatResponse = async (userId, userMessage, history = []) => {
  // 1. Fetch user's portfolio data from DB
  const [skills, certificates] = await Promise.all([
    Skill.find({ userId }),
    Certificate.find({ userId }),
  ]);

  // 2. Build system prompt with their data
  const systemPrompt = buildSystemPrompt(skills, certificates);

  // 3. Initialize Gemini model
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: systemPrompt,
  });

  // 4. Start chat with history (for multi-turn conversation)
  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role, // "user" or "model"
      parts: [{ text: msg.text }],
    })),
  });

  // 5. Send message and get response
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
=======
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Analyzes resume text and returns ATS score + suggestions
 */
export const analyzeResumeWithAI = async (resumeText) => {
  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach.

Analyze the following resume text and return a JSON response with this exact structure:
{
  "atsScore": <number 0-100>,
  "sectionScores": {
    "contact": <number 0-100>,
    "summary": <number 0-100>,
    "skills": <number 0-100>,
    "experience": <number 0-100>,
    "education": <number 0-100>,
    "projects": <number 0-100>
  },
  "strengths": [<list of 3-5 strength strings>],
  "suggestions": [<list of 5-8 actionable improvement suggestions>],
  "missingKeywords": [<list of important missing keywords/skills>],
  "overallFeedback": "<2-3 sentence overall feedback>"
}

Resume Text:
---
${resumeText}
---

Respond ONLY with the JSON object. No preamble, no markdown, no explanation.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.content[0].text.trim();
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
>>>>>>> dev
};
