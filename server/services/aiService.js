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
};
