import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";
import { connected } from "./lib/mongoose";
import cors from "cors";
import { initializeSocket } from "./lib/socket";
import { clerkMiddleware } from "@clerk/express";

import userRouter from "./routes/users.route";
import messageRouter from "./routes/messages.route"
import todoRouter from "./routes/todos.route"
import geminiRouter from "./routes/gemini.route"

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

connected();

initializeSocket(httpServer)
app.use(clerkMiddleware())
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URI : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/message",messageRouter)
app.use("/api/todo", todoRouter)
app.use("/api/gemini", geminiRouter)

httpServer.listen(PORT, () => {
  console.log("is running");
});
