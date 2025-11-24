"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.get("/", (req, res) => {
    res.send("hello");
});
httpServer.listen(5000, () => {
    console.log("is running");
});
