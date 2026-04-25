import express from "express";
import cors from "cors";
import multer from "multer";
import { CONFIG } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";
import analyzeRoute from "./routes/analyze";
import { extractTextFromPDF } from "./services/pdfParser";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

app.use(cors({ origin: CONFIG.allowedOrigins, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(apiLimiter);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/analyze", analyzeRoute);

app.post("/api/upload/resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const text = await extractTextFromPDF(req.file.buffer);
    res.json({ text });
  } catch (err: any) {
    console.error("[Upload]", err.message);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});

app.use(errorHandler);

app.listen(CONFIG.port, () => {
  console.log(`✓ Server running on http://localhost:${CONFIG.port}`);
});

export default app;
