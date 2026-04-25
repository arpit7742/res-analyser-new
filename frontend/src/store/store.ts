import { create } from "zustand";
import { AnalysisResult } from "@/types";

interface Store {
  result: AnalysisResult | null;
  setResult: (r: AnalysisResult) => void;
  clear: () => void;
}

export const useStore = create<Store>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
  clear: () => set({ result: null }),
}));
