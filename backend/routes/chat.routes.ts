import { Router } from "express";
import {
  getChatById,
  getUserChats,
  markMessageAsRead,
  sendMessageToChat,
} from "../controllers/chat.controller.js";
import upload from "../lib/multer.js";

const chatRouter = Router();

chatRouter.post("/get-user-chats", getUserChats);
chatRouter.post("/get-chat-by-id/:chatId", getChatById);
chatRouter.post(
  "/send-message/:chatId",
  upload.single("file"),
  sendMessageToChat
);
chatRouter.patch("/mark-message-as-read/:chatId", markMessageAsRead);

export default chatRouter;
