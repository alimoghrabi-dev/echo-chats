import { Request, Response } from "express";
import { ChatService } from "../services/chat.service.js";

const chatService = new ChatService();

export const getUserChats = async (req: Request, res: Response) => {
  return await chatService.getUserChatsService(req, res);
};

export const getChatById = async (req: Request, res: Response) => {
  return await chatService.getChatByIdService(req, res);
};

export const sendMessageToChat = async (req: Request, res: Response) => {
  return await chatService.sendMessageToChatService(req, res);
};

export const markMessageAsRead = async (req: Request, res: Response) => {
  return await chatService.markMessageAsReadService(req, res);
};
