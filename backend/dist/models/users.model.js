"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const users = new mongoose_1.default.Schema({
    clerkId: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    lastMessage: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Message",
        default: null,
    },
    lastMessageAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model("User", users);
