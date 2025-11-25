"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = require("./lib/mongoose");
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./lib/socket");
const express_2 = require("@clerk/express");
const users_route_1 = __importDefault(require("./routes/users.route"));
const messages_route_1 = __importDefault(require("./routes/messages.route"));
const todos_route_1 = __importDefault(require("./routes/todos.route"));
const gemini_route_1 = __importDefault(require("./routes/gemini.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
(0, mongoose_1.connected)();
(0, socket_1.initializeSocket)(httpServer);
app.use((0, express_2.clerkMiddleware)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URI : "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/user", users_route_1.default);
app.use("/api/message", messages_route_1.default);
app.use("/api/todo", todos_route_1.default);
app.use("/api/gemini", gemini_route_1.default);
httpServer.listen(5000, () => {
    console.log("is running");
});
