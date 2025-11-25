"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyText = exports.saveText = exports.callGeminiApi = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const gemini_model_1 = require("../models/gemini.model");
dotenv_1.default.config();
const apiKey = process.env.apiKey;
const modelName = "gemini-2.5-flash-preview-09-2025";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
const callGeminiApi = async (req, res, next) => {
    try {
        const { messages } = req.body;
        const formatted = messages.map((m) => ({
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
        const resp = await axios_1.default.post(apiUrl, payload, {
            headers: { "Content-Type": "application/json" },
        });
        if (!resp.data?.candidates || resp.data.candidates.length === 0) {
            return res.status(500).json({
                reply: "Xin lỗi, tôi không thể hiểu câu hỏi của bạn. Vui lòng thử lại!",
            });
        }
        const reply = resp.data.candidates[0].content.parts[0].text;
        res.json({ reply });
    }
    catch (error) {
        console.log("callGeminiApi controller error", error.message);
        next(error);
    }
};
exports.callGeminiApi = callGeminiApi;
const saveText = async (req, res, next) => {
    try {
        const { role, text } = req.body;
        const clerkId = req.clerkId;
        if (!clerkId) {
            return res.status(400).json({ message: "Not found user" });
        }
        const saveText = await gemini_model_1.Gemini.create({
            clerkId,
            role,
            text,
        });
        // console.log("save: ", saveText);
        res.status(200).json({ saveText });
    }
    catch (error) {
        console.log("saveText controller error", error.message);
        next(error);
    }
};
exports.saveText = saveText;
const historyText = async (req, res, next) => {
    try {
        const clerkId = req.clerkId;
        if (!clerkId) {
            return res.status(400).json({ message: "Not found user" });
        }
        const history = await gemini_model_1.Gemini.find({ clerkId }).sort({ createdAt: 1 });
        res.status(200).json({ history });
    }
    catch (error) {
        console.log("saveText controller error", error.message);
        next(error);
    }
};
exports.historyText = historyText;
