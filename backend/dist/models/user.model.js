import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    description: {
        type: String,
        minlength: 5,
        maxlength: 150,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true,
});
userSchema.index({ username: "text", email: "text" });
const User = mongoose.model("User", userSchema);
export default User;
