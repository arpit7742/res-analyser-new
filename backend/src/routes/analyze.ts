import { Router, Request, Response } from "express";
import { analyzeResume } from "../agents/analyzer";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { jd, resume } = req.body;
    if (!jd?.trim() || !resume?.trim()) {
      return res.status(400).json({ error: "Both jd and resume are required." });
    }
    const result = await analyzeResume(jd, resume);
    res.json(result);
  } catch (err: any) {
    console.error("[Analyze]", err.message);
    res.status(500).json({ error: "Analysis failed. Please try again." });
  }
});

export default router;
