import { Request, Response } from "express";
import { CommunityService } from "../services/community.service.js";

const communityService = new CommunityService();

export const getUsersQueried = async (req: Request, res: Response) => {
  return await communityService.getUsersQueriedService(req, res);
};

export const sendFriendRequest = async (req: Request, res: Response) => {
  return await communityService.sendFriendRequestService(req, res);
};

export const applyOrDenyFriendRequest = async (req: Request, res: Response) => {
  return await communityService.acceptOrDenyFriendRequestService(req, res);
};
