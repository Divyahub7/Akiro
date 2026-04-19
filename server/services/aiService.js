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
};
