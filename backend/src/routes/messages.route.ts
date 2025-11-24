import { Router } from "express";
import { getUser } from "../middlewares/middleware";
import { getMessages } from "../controllers/messages.controller";

const router = Router();
router.get("/:userId", getUser,getMessages);

export default router;