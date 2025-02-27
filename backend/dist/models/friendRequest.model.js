import mongoose, { Schema } from "mongoose";
const friendRequestSchema = new Schema({
    requestedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestedFrom: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
