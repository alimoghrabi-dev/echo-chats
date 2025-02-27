import { CommunityService } from "../services/community.service.js";
const communityService = new CommunityService();
export const getUsersQueried = async (req, res) => {
    return await communityService.getUsersQueriedService(req, res);
};
export const sendFriendRequest = async (req, res) => {
    return await communityService.sendFriendRequestService(req, res);
};
export const applyOrDenyFriendRequest = async (req, res) => {
    return await communityService.acceptOrDenyFriendRequestService(req, res);
};
