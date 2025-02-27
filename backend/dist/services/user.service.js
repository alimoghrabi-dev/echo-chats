import logger from "../utils/logger.js";
import User from "../models/user.model.js";
export class UserSerivce {
    async getUserByIdService(req, res) {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId).select("-password");
            if (!user) {
                res.status(404).json({ message: "User Not Found" });
                return;
            }
            res.status(200).json(user);
        }
        catch (error) {
            logger.error("❌ Failed to get user:" + error);
            res.status(500).json({ error: "Internal Server Error!", path: "User" });
        }
    }
    async editUserService(req, res) {
        try {
            const { profileId, firstName, lastName, username, description } = req.body;
            const userId = req.userId;
            if (userId !== profileId) {
                res.status(404).json({ message: "User Not Found" });
                return;
            }
            const updatedUser = await User.findByIdAndUpdate(userId, { $set: { firstName, lastName, username, description } }, { new: true, select: "-password" });
            if (!updatedUser) {
                res.status(404).json({ message: "User Not Found" });
                return;
            }
            res.status(201).json("User Updated Successfully!");
        }
        catch (error) {
            logger.error("❌ Failed to edit user:" + error);
            res.status(500).json({ error: "Internal Server Error!", path: "User" });
        }
    }
}
