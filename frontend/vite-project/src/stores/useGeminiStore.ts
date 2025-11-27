import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { Texts } from "../types/type";

interface GeminiStore {
  isLoading: {
    call: boolean;
    history: boolean;
  };
  error: string | null;
  texts: Texts[];

  fetchText: () => Promise<void>;
  saveText: (role: string, text: string) => Promise<void>;
  callGeminiApi: (messages: Texts[]) => Promise<void>;
}

export const useGeminiStore = create<GeminiStore>((set) => ({
  isLoading: {
    call: false,
    history: false,
  },
  error: null,
  texts: [],

  fetchText: async () => {
    set((state) => ({ isLoading: { ...state.isLoading, history: true } }));
    try {
      const res = await axiosInstance.get("/gemini/history");
      const history = res.data.history.map((h: any) => ({
        role: h.role,
        text: h.text,
      }));
      // console.log(first)
      set({ texts: history });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, history: false } }));
    }
  },
  saveText: async (role, text) => {
    set((state) => ({ isLoading: { ...state.isLoading, call: true } }));
    try {
      const res = await axiosInstance.post("/gemini/save", { role, text });
      const saved = res.data.saveText;

      set((state) => ({
        texts: [...state.texts, { role: saved.role, text: saved.text }],
      }));
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, call: false } }));
    }
  },
  callGeminiApi: async (messages) => {
    set((state) => ({ isLoading: { ...state.isLoading, call: true } }));
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
      set((state) => ({ isLoading: { ...state.isLoading, call: false } }));
    }
  },
}));
