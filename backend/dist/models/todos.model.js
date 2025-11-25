"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const todos = new mongoose_1.default.Schema({
    task: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
    clerkId: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});
exports.Todo = mongoose_1.default.model("Todo", todos);
