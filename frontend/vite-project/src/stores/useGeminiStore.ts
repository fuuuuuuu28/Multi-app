import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { Texts } from "../types/type";

interface GeminiStore {
  isLoading: boolean;
  error: string | null;
  texts: Texts[];

  fetchText: () => Promise<void>;
  saveText: (role: string, text: string) => Promise<void>;
  callGeminiApi: (messages: Texts[]) => Promise<void>;
}

export const useGeminiStore = create<GeminiStore>((set) => ({
  isLoading: false,
  error: null,
  texts: [],

  fetchText: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/gemini/history");
      const history = res.data.history.map((h: any) => ({
        role: h.role,
        text: h.text,
      }));

      set({ texts: history });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  saveText: async (role, text) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/gemini/save", { role, text });
      const saved = res.data.saveText;

      set((state) => ({
        texts: [...state.texts, { role: saved.role, text: saved.text }],
      }));
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  callGeminiApi: async (messages) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/gemini", {
        messages,
      });
      const reply = res.data.reply;

      await axiosInstance.post("/gemini/save", {
        role: "model",
        text: reply,
      });
      set((state) => ({
        texts: [...state.texts, { role: "model", text: reply }],
      }));

      return reply;
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
