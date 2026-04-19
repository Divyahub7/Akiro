import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import skillRoutes from "./routes/skill.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));

app.use("/api/skills", skillRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
