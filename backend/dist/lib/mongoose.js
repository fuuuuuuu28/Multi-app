"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connected = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connected = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("Success connection");
    }
    catch (error) {
        console.log("Fail connection", error.message);
    }
};
exports.connected = connected;
