import { Router } from "express";
import { getChatByFriendAndUserIds, getUnreadMessages, markMessageAsRead, sendMessageToChat, } from "../controllers/chat.controller.js";
const chatRouter = Router();
chatRouter.post("/get-one/:friendId", getChatByFriendAndUserIds);
chatRouter.post("/send-message/:chatId", sendMessageToChat);
chatRouter.patch("/mark-message-as-read/:chatId", markMessageAsRead);
chatRouter.post("/get-unread-messages/:friendId", getUnreadMessages);
export default chatRouter;
