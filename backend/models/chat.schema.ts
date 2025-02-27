import mongoose, { Schema, Document } from "mongoose";

interface IMessage {
  _id: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  content: string;
  isPending?: boolean;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IChat extends Document {
  participants: Schema.Types.ObjectId[];
  messages: IMessage[];
}

const chatSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        isPending: { type: Boolean },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
