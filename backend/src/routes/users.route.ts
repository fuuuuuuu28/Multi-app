import { Router } from "express";
import { clerkProvider, getProfile } from "../controllers/users.controller";
import { getUser } from "../middlewares/middleware";

const router = Router();

router.post("/clerkProvider",clerkProvider)
router.get("/",getUser ,getProfile)

export default router;