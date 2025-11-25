"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = void 0;
const messages_model_1 = require("../models/messages.model");
const getMessages = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const myId = req.clerkId;
        const messages = await messages_model_1.Message.find({
            $or: [
                { senderId: userId, receiverId: myId },
                { senderId: myId, receiverId: userId },
            ],
        }).sort({ createdAt: 1 });
        res.status(200).json({ messages });
    }
    catch (error) {
        next(error);
    }
};
exports.getMessages = getMessages;
