import { Request, Response } from "express";
import { getIfUserIsOnline, io } from "../main.js";
import logger from "../utils/logger.js";
import Chat from "../models/chat.schema.js";
import User from "../models/user.model.js";

export class ChatService {
  async getUserChatsService(req: Request, res: Response) {
    try {
      const userId = req.userId;

      const chats = await Chat.find({
        participants: userId,
      }).lean();

      const chatData = await Promise.all(
        chats.map(async (chat) => {
          const otherUserId = chat.participants.find(
            (pId) => pId.toString() !== userId.toString()
          );

          const friend = await User.findOne(
            { _id: otherUserId },
            "_id firstName lastName profilePic"
          ).lean();

          return { chat, friend };
        })
      );

      res.status(200).json(chatData);
    } catch (error) {
      logger.error("❌ Failed to get chats:" + error);
      res.status(500).json({ error: "Internal Server Error!", path: "Chat" });
    }
  }

  async getChatByIdService(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const userId = req.userId;

      const chat = await Chat.findById(chatId)
        .populate("participants")
        .populate({
          path: "messages.senderId",
          select: "-password",
        });

      if (!chat) {
        res.status(404).json({ message: "No Chat found!" });
        return;
      }

      res.status(200).json(chat);
    } catch (error) {
      logger.error("❌ Failed to get chat:" + error);
      res.status(500).json({ error: "Internal Server Error!", path: "Chat" });
    }
  }

  async sendMessageToChatService(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const { message } = req.body;
      const userId = req.userId;

      const chat = await Chat.findOne(
        { _id: chatId, participants: userId },
        { _id: 1, participants: 1 }
      );

      if (!chat) {
        res.status(404).json({ message: "No Chat found!" });
        return;
      }

      await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: {
            messages: { senderId: userId, content: message, isPending: false },
          },
        },
        { new: true }
      );

      const updatedChat = await Chat.findOne(
        { _id: chatId },
        { messages: { $slice: -1 } }
      ).populate({
        path: "messages.senderId",
        select: "-password",
      });

      if (!updatedChat || updatedChat.messages.length === 0) {
        res.status(500).json({ error: "Failed to retrieve latest message" });
        return;
      }

      const newMessage = {
        ...updatedChat.messages[0],
        chatId: updatedChat._id,
      };

      const receiverId = chat.participants.find(
        (participantId) => participantId.toString() !== userId
      );

      if (!receiverId) {
        res.status(406).json({ error: "Failed to send message" });
        return;
      }

      const receiverIdString = receiverId.toString();

      const isUserOnline = getIfUserIsOnline(receiverIdString);

      if (isUserOnline) {
        io.to(receiverIdString).emit("newMessage", newMessage);
      }

      res.status(201).json(newMessage);
    } catch (error) {
      logger.error("❌ Failed to send message:" + error);
      res
        .status(500)
        .json({ error: "Internal Server Error!", path: "Community" });
    }
  }

  async markMessageAsReadService(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const userId = req.userId;

      await Chat.updateOne(
        { _id: chatId },
        { $set: { "messages.$[msg].isRead": true } },
        {
          arrayFilters: [
            { "msg.senderId": { $ne: userId }, "msg.isRead": false },
          ],
        }
      );

      res.status(200).json({ message: "Messages marked as read." });
    } catch (error) {
      console.error("❌ Failed to mark messages as read:", error);
      res.status(500).json({ error: "Internal Server Error!" });
    }
  }
}
