import { NextFunction, Request, Response } from "express";
import { Message } from "../models/messages.model";

export const getMessages = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const { userId } = req.params;
    const myId = req.clerkId;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt:1});
    res.status(200).json({messages});
  } catch (error) {
    next(error)
  }
};
