import { Request, Response } from "express";
import { ChatService } from "../services/chat.service.js";

const chatService = new ChatService();

export const getChatByFriendAndUserIds = async (
  req: Request,
  res: Response
) => {
  return await chatService.getChatByFriendAndUserIdsService(req, res);
};

export const sendMessageToChat = async (req: Request, res: Response) => {
  return await chatService.sendMessageToChatService(req, res);
};

export const markMessageAsRead = async (req: Request, res: Response) => {
  return await chatService.markMessageAsReadService(req, res);
};

export const getUnreadMessages = async (req: Request, res: Response) => {
  return await chatService.getUnreadMessagesService(req, res);
};
