import mongoose, { Schema, Document } from "mongoose";

interface IChat extends Document {
  participants: Schema.Types.ObjectId[];
  lastMessage: Schema.Types.ObjectId;
  unreadCounts: Map<string, number>;
}

const chatSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    unreadCounts: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
