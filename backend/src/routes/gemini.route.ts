import { Router } from "express";
import { getUser } from "../middlewares/middleware";
import { callGeminiApi, historyText, saveText } from "../controllers/gemini.controller";

const router = Router();
router.post("/", callGeminiApi);
router.post("/save",getUser ,saveText);
router.get("/history", getUser, historyText)
export default router;