import logger from "../utils/logger.js";
import Chat from "../models/chat.schema.js";
import User from "../models/user.model.js";
import { getIfUserIsOnline, io } from "../main.js";
export class ChatService {
    async getChatByFriendAndUserIdsService(req, res) {
        try {
            const { friendId } = req.params;
            const userId = req.userId;
            const chat = await Chat.findOne({
                participants: { $all: [userId, friendId] },
            })
                .populate("participants")
                .populate({
                path: "messages.senderId",
                select: "-password",
            });
            if (!chat) {
                const usersExist = await User.exists({
                    _id: { $in: [userId, friendId] },
                });
                if (!usersExist) {
                    res.status(404).json({ message: "No Users found!" });
                    return;
                }
                res.status(404).json({ message: "No Chat found!" });
                return;
            }
            res.status(200).json(chat);
        }
        catch (error) {
            logger.error("❌ Failed to get chat:" + error);
            res
                .status(500)
                .json({ error: "Internal Server Error!", path: "Community" });
        }
    }
    async sendMessageToChatService(req, res) {
        try {
            const { chatId } = req.params;
            const { message } = req.body;
            const userId = req.userId;
            const chat = await Chat.findOne({ _id: chatId, participants: userId }, { _id: 1, participants: 1 });
            if (!chat) {
                res.status(404).json({ message: "No Chat found!" });
                return;
            }
            await Chat.findByIdAndUpdate(chatId, {
                $push: {
                    messages: { senderId: userId, content: message, isPending: false },
                },
            }, { new: true });
            const updatedChat = await Chat.findOne({ _id: chatId }, { messages: { $slice: -1 } }).populate({
                path: "messages.senderId",
                select: "-password",
            });
            if (!updatedChat || updatedChat.messages.length === 0) {
                res.status(500).json({ error: "Failed to retrieve latest message" });
                return;
            }
            const newMessage = updatedChat.messages[0];
            const receiverId = chat.participants.find((participantId) => participantId.toString() !== userId);
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
        }
        catch (error) {
            logger.error("❌ Failed to send message:" + error);
            res
                .status(500)
                .json({ error: "Internal Server Error!", path: "Community" });
        }
    }
    async markMessageAsReadService(req, res) {
        try {
            const { chatId } = req.params;
            const userId = req.userId;
            await Chat.updateOne({ _id: chatId }, { $set: { "messages.$[msg].isRead": true } }, {
                arrayFilters: [
                    { "msg.senderId": { $ne: userId }, "msg.isRead": false },
                ],
            });
            res.status(200).json({ message: "Messages marked as read." });
        }
        catch (error) {
            console.error("❌ Failed to mark messages as read:", error);
            res.status(500).json({ error: "Internal Server Error!" });
        }
    }
    async getUnreadMessagesService(req, res) {
        try {
            const { friendId } = req.params;
            const userId = req.userId;
            const chat = await Chat.findOne({ participants: { $all: [userId, friendId] } }, { messages: 1 });
            if (!chat) {
                res.status(404).json({ error: "Chat not found" });
                return;
            }
            const unreadCount = chat.messages.filter((msg) => msg.senderId.toString() !== userId && !msg.isRead).length || 0;
            res.status(200).json(unreadCount);
        }
        catch (error) {
            console.error("❌ Failed to get unread messages count:", error);
            res.status(500).json({ error: "Internal Server Error!" });
        }
    }
}
