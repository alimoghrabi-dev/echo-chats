import mongoose, { Schema, Document } from "mongoose";

interface IFriendRequest extends Document {
  requestedTo: Schema.Types.ObjectId;
  requestedFrom: Schema.Types.ObjectId;
}

const friendRequestSchema = new Schema(
  {
    requestedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestedFrom: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model<IFriendRequest>(
  "FriendRequest",
  friendRequestSchema
);

export default FriendRequest;
