import logger from "../utils/logger.js";
import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import { io } from "../main.js";
import Chat from "../models/chat.schema.js";
export class CommunityService {
    async getUsersQueriedService(req, res) {
        try {
            const { query } = req.query;
            const userId = req.userId;
            let users;
            if (query) {
                users = await User.find({
                    $and: [
                        {
                            $or: [
                                { username: { $regex: `^${query}`, $options: "i" } },
                                { email: { $regex: `^${query}`, $options: "i" } },
                                { firstName: { $regex: `^${query}`, $options: "i" } },
                                { lastName: { $regex: `^${query}`, $options: "i" } },
                            ],
                        },
                        { _id: { $ne: userId } },
                    ],
                })
                    .select("-password")
                    .lean();
            }
            else {
                users = await User.find({ _id: { $ne: userId } })
                    .select("-password")
                    .lean();
            }
            res.status(200).json(users);
        }
        catch (error) {
            logger.error("❌ Failed to get users:" + error);
            res
                .status(500)
                .json({ error: "Internal Server Error!", path: "Community" });
        }
    }
    async sendFriendRequestService(req, res) {
        try {
            const { requestedTo, requestedFrom } = req.body;
            const requestedToUser = await User.findById(requestedTo);
            const requestedFromUser = await User.findById(requestedFrom);
            if (!requestedToUser || !requestedFromUser) {
                res.status(404).json({ message: "User Not Found" });
                return;
            }
            await FriendRequest.create({
                requestedTo: requestedToUser._id,
                requestedFrom: requestedFromUser._id,
            });
            await User.findByIdAndUpdate(requestedToUser._id, {
                $push: { friendRequests: requestedFromUser._id },
            });
            io.to(String(requestedToUser._id)).emit("friendRequest", {
                message: "You have a new friend request!",
                from: String(requestedToUser._id),
                fromUsername: requestedFromUser.username,
            });
            res.status(201).json({ message: "Friend Request Sent!" });
        }
        catch (error) {
            logger.error("❌ Failed to send request:" + error);
            res
                .status(500)
                .json({ error: "Internal Server Error!", path: "Community" });
        }
    }
    async acceptOrDenyFriendRequestService(req, res) {
        try {
            const { requestSenderId, status } = req.body;
            const userId = req.userId;
            const user = await User.findById(userId);
            if (user?.friends.includes(requestSenderId)) {
                res.status(404).json({ message: "Already Friends!" });
                return;
            }
            if (!requestSenderId || !user) {
                res.status(404).json({ message: "User Not Found" });
                return;
            }
            const actions = [];
            const friendRequest = await FriendRequest.findOne({
                requestedFrom: requestSenderId,
                requestedTo: userId,
            });
            if (!friendRequest) {
                res.status(404).json({ message: "No Friend request found!" });
                return;
            }
            if (status === "accept") {
                actions.push(User.findByIdAndUpdate(user._id, {
                    $push: { friends: requestSenderId },
                }), User.findByIdAndUpdate(requestSenderId, {
                    $push: { friends: user._id },
                }), await Chat.create({
                    participants: [user._id, requestSenderId],
                }));
            }
            actions.push(FriendRequest.findByIdAndDelete(friendRequest._id), User.findByIdAndUpdate(user._id, {
                $pull: { friendRequests: requestSenderId },
            }));
            await Promise.all(actions);
            res.status(200).json({ message: "Friend Request Sent!" });
        }
        catch (error) {
            logger.error("❌ Failed to update request:" + error);
            res
                .status(500)
                .json({ error: "Internal Server Error!", path: "Community" });
        }
    }
}
