import { GoogleGenerativeAI } from "@google/generative-ai";
import { CONFIG } from "../config";

const genAI = new GoogleGenerativeAI(CONFIG.geminiApiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    temperature: 0.4,
    maxOutputTokens: 4096,
    responseMimeType: "application/json",
  },
});

export async function callGemini(prompt: string, retries = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[Gemini] Calling gemini-2.5-flash-lite (attempt ${i + 1})...`);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log(`[Gemini] OK — response length: ${text.length} chars`);
      return text;
    } catch (err: any) {
      const msg: string = err?.message || "";
      console.error(`[Gemini] Error on attempt ${i + 1}:`, msg.slice(0, 200));

      if (err?.status === 429 && i < retries - 1) {
        // Parse retryDelay from error message e.g. "retryDelay":"49s"
        const delayMatch = msg.match(/"retryDelay":"(\d+)s"/);
        const waitMs = delayMatch ? parseInt(delayMatch[1]) * 1000 : Math.pow(2, i + 1) * 3000;
        console.log(`[Gemini] Rate limited — waiting ${waitMs / 1000}s before retry...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Gemini call failed after retries");
}

export function parseJSON<T>(text: string): T {
  const trimmed = text.trim();

  try { return JSON.parse(trimmed); } catch { /* continue */ }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch { /* continue */ }
  }

  const braceStart = trimmed.indexOf("{");
  const braceEnd = trimmed.lastIndexOf("}");
  if (braceStart !== -1 && braceEnd !== -1) {
    try { return JSON.parse(trimmed.slice(braceStart, braceEnd + 1)); } catch { /* continue */ }
  }

  console.error("[parseJSON] Full raw response:\n", trimmed);
  throw new Error("Could not parse JSON from Gemini response");
}
