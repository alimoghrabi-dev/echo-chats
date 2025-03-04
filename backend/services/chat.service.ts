import { Request, Response } from "express";
import { getIfUserIsOnline, io } from "../main.js";
import logger from "../utils/logger.js";
import Chat from "../models/chat.schema.js";
import User from "../models/user.model.js";
import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, s3 } from "../lib/s3-bucket.js";
import { randomName } from "../utils/validators.js";
import envConfig from "../config/env.js";
import Message from "../models/message.schema.js";

export class ChatService {
  async getUserChatsService(req: Request, res: Response) {
    try {
      const userId = req.userId;

      const chats = await Chat.find({
        participants: userId,
      })
        .populate("lastMessage")
        .lean();

      const chatData = await Promise.all(
        chats.map(async (chat) => {
          const otherUserId = chat.participants.find(
            (pId) => pId.toString() !== userId.toString()
          );

          const friend = await User.findOne(
            { _id: otherUserId },
            "_id firstName lastName profilePicture"
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

      const chat = await Chat.findById(chatId).populate({
        path: "participants",
        select: "_id firstName lastName profilePicture",
      });

      if (!chat) {
        res.status(404).json({ message: "No Chat found!" });
        return;
      }

      const chatMessages = await Message.find({
        chatId: chat._id,
      }).populate({
        path: "senderId",
        select: "_id firstName lastName profilePicture",
      });

      res.status(200).json({
        chat,
        chatMessages,
      });
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

      if (!message && !req.file) {
        res.status(404).json({ message: "Message cannot be empty!" });
        return;
      }

      if (!req.file) {
        if (message.trim() === "") {
          res.status(404).json({ message: "Message cannot be empty!" });
          return;
        }
      }

      const chat = await Chat.findOne({ _id: chatId, participants: userId });

      if (!chat) {
        res.status(404).json({ message: "No Chat found!" });
        return;
      }

      let imageUrl = null;

      if (req.file) {
        const buffer = await sharp(req.file?.buffer)
          .resize({
            width: 350,
            height: 400,
            fit: "inside",
          })
          .toFormat("webp")
          .webp({ quality: 80 })
          .toBuffer();

        const randomGeneratedName = randomName();

        const params = {
          Bucket: BUCKET_NAME,
          Key: randomGeneratedName,
          Body: buffer,
          ContentType: req.file?.mimetype,
        };

        const command = new PutObjectCommand(params);

        await s3.send(command);

        imageUrl = `https://${BUCKET_NAME}.s3.${envConfig.S3_BUCKET_REGION}.amazonaws.com/${randomGeneratedName}`;
      }

      const newMessage = await Message.create({
        chatId: chat._id,
        senderId: userId,
        content: message || "",
        image: imageUrl || "",
        isPending: false,
      });

      const receiverId = chat.participants.find(
        (participantId) => participantId.toString() !== userId
      );

      if (!receiverId) {
        res.status(406).json({ error: "Failed to send message" });
        return;
      }

      await Chat.findByIdAndUpdate(chat._id, {
        lastMessage: newMessage._id,
        $inc: { [`unreadCounts.${receiverId}`]: 1 },
      });

      await newMessage.populate({
        path: "senderId",
        select: "_id firstName lastName profilePicture",
      });

      if (getIfUserIsOnline(receiverId.toString())) {
        io.to(receiverId.toString()).emit("newMessage", newMessage);
      }

      res.status(201).json(newMessage);
    } catch (error) {
      logger.error("❌ Failed to send message:" + error);
      res.status(500).json({ error: "Internal Server Error!", path: "Chat" });
    }
  }

  async markMessageAsReadService(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const userId = req.userId;

      const chat = await Chat.findById(chatId);
      if (!chat) {
        res.status(404).json({ error: "Chat not found!" });
        return;
      }

      const unreadCount = chat.unreadCounts.get(userId) || 0;

      if (unreadCount > 0) {
        await Chat.findByIdAndUpdate(chat._id, {
          $set: { [`unreadCounts.${userId}`]: 0 },
        });
      }

      res.status(201).json({ message: "Messages marked as read." });
    } catch (error) {
      console.error("❌ Failed to mark messages as read:", error);
      res.status(500).json({ error: "Internal Server Error!", path: "Chat" });
    }
  }
}
