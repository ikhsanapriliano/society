import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    photo: { type: String, required: true },
    url: { type: String, default: "" },
    description: { type: String, required: true },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [
        {
            userId: { type: String, required: true },
            username: { type: String, required: true },
            photo: { type: String, required: true },
            comment: { type: String, required: true },
            isLike: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
        },
    ],
});

export const post = mongoose.model("Post", postSchema);
