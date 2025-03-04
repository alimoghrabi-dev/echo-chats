import mongoose, { Schema, Document } from "mongoose";

interface IMessage extends Document {
  chatId: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  content: string;
  image: string;
  isPending?: boolean;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String },
    image: { type: String },
    isPending: { type: Boolean },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
