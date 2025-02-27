import mongoose, { Schema } from "mongoose";
const chatSchema = new Schema({
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
}, { timestamps: true });
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
