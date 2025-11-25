import dotenv from "dotenv";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { Gemini } from "../models/gemini.model";
dotenv.config();

const apiKey = process.env.apiKey;
const modelName = "gemini-2.5-flash-preview-09-2025";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

export const callGeminiApi = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messages } = req.body;

    const formatted = messages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));
    // console.log("formatted: ", formatted);

    const payload = {
      contents: formatted,
      systemInstruction: {
        parts: [{ text: "You are a friendly coding tutor." }],
      },
    };
    // console.log("payload", payload);
    const resp = await axios.post(apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });
    
    const reply = resp.data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (error: any) {
    console.log("callGeminiApi controller error", error.message);
    const reply = "Xin lỗi, tôi không thể hiểu câu hỏi của bạn. Vui lòng thử lại!"
    res.json({ reply})
    next(error);
  }
};

export const saveText = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, text } = req.body;
    const clerkId = req.clerkId;
    if (!clerkId) {
      return res.status(400).json({ message: "Not found user" });
    }
    const saveText = await Gemini.create({
      clerkId,
      role,
      text,
    });
    // console.log("save: ", saveText);
    res.status(200).json({ saveText });
  } catch (error: any) {
    console.log("saveText controller error", error.message);
    next(error);
  }
};

export const historyText = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clerkId = req.clerkId;
    if (!clerkId) {
      return res.status(400).json({ message: "Not found user" });
    }

    const history = await Gemini.find({ clerkId }).sort({ createdAt: 1 });
    res.status(200).json({ history });
  } catch (error: any) {
    console.log("saveText controller error", error.message);
    next(error);
  }
};
