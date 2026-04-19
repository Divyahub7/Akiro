import { getChatResponse } from "../services/aiService.js";

export const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    const response = await getChatResponse(req.user.id, message, history || []);

    res.status(200).json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    res
      .status(500)
      .json({ message: " AI service error", error: error.message });
  }
};
