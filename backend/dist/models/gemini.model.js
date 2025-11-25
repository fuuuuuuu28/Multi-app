"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gemini = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const gemini = new mongoose_1.default.Schema({
    clerkId: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["model", "user"],
        required: true,
    },
}, {
    timestamps: true
});
exports.Gemini = mongoose_1.default.model("Gemini", gemini);
