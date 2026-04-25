import { config } from "dotenv";
config();

export const CONFIG = {
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(","),
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  sessionTTL: 30 * 60 * 1000, // 30 minutes
};
