import { AnalysisResult } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  analyze: (jd: string, resume: string) =>
    post<AnalysisResult>("/analyze", { jd, resume }),

  uploadResume: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("resume", file);
    const res = await fetch(`${API_URL}/upload/resume`, { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.text;
  },
};
