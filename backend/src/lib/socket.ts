import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { Message } from "../models/messages.model";
import { User } from "../models/users.model";
import dotenv from "dotenv";

dotenv.config();

export const initializeSocket = (server: HTTPServer): void => {
  const io = new Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.CLIENT_URI
          : "http://localhost:5173",
      credentials: true,
    },
  });

  const userOnline = new Map();
  io.on("connection", (socket) => {
    console.log("socket is connect", socket.id);

    socket.on("user_connected", (userId) => {
      //Lên danh sách user online
      userOnline.set(userId, socket.id);

      //Gửi userId của ta cho toàn bị người dùng, thông báo rằng ta đang online
      io.emit("user_connected", userId);

      //Gửi danh sách online cho ta
      socket.emit("user_online", Array.from(userOnline.keys()));
    });

    //Xử lý send_messages
    socket.on("send_messages", async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        await Promise.all([
          User.findOneAndUpdate(
            { clerkId: senderId },
            { lastMessage: message._id, lastMessageAt: message.createdAt },
            { new: true }
          ),
          User.findOneAndUpdate(
            { clerkId: receiverId },
            { lastMessage: message._id, lastMessageAt: message.createdAt },
            { new: true }
          ),
        ]);

        const receiverSocketId = userOnline.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiver_message", message);
        }
        socket.emit("message_sent", message);
        io.emit("last_message", { senderId, receiverId, message });
      } catch (error: any) {
        console.error("Message error: ", error);
        socket.emit("message_error", error.message);
      }
    });

    // Socket.IO quy định: disconnect
    socket.on("disconnect", () => {
      for (var [userId, socketId] of userOnline) {
        if (socketId == socket.id) {
          userOnline.delete(userId);
          io.emit("user_disconnect", userId);
          break;
        }
      }
      console.log("disconnect", socket.id);
    });
  });
};
