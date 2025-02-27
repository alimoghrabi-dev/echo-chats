import { ChatService } from "../services/chat.service.js";
const chatService = new ChatService();
export const getChatByFriendAndUserIds = async (req, res) => {
    return await chatService.getChatByFriendAndUserIdsService(req, res);
};
export const sendMessageToChat = async (req, res) => {
    return await chatService.sendMessageToChatService(req, res);
};
export const markMessageAsRead = async (req, res) => {
    return await chatService.markMessageAsReadService(req, res);
};
export const getUnreadMessages = async (req, res) => {
    return await chatService.getUnreadMessagesService(req, res);
};
