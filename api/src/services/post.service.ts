import {
    PostResponse,
    PostPayload,
    ManyPostResponse,
    SinglePostResponse,
    CommentPayload,
    CommentFormat,
} from "../types/post.type";
import { post } from "../utils/mongoose.util";
import prisma from "../utils/prisma.util";
// import logger from "../utils/winston.util";

export const FindMany = async (
    username?: string
): Promise<ManyPostResponse[]> => {
    const query = username ? { username } : {};
    const posts = await post.find(query).sort({ updatedAt: -1 });

    const resPosts: ManyPostResponse[] = posts.map((item) => {
        const day = String(item.updatedAt.getDate()).padStart(2, "0");
        const month = String(item.updatedAt.getMonth()).padStart(2, "0");
        const year = item.updatedAt.getFullYear();
        const hour = String(item.updatedAt.getHours()).padStart(2, "0");
        const minute = String(item.updatedAt.getMinutes()).padStart(2, "0");
        const date = `${day}/${month}/${year} ${hour}:${minute}`;

        return {
            id: item._id,
            username: item.username,
            photo: item.photo,
            url: item.url,
            description: item.description,
            likes: item.likes,
            date,
        };
    });

    return resPosts;
};

export const FindSingle = async (
    postId: string
): Promise<SinglePostResponse> => {
    const data = await post.findById(postId);
    if (!data) {
        throw new Error("400:Post not found.");
    }

    const day = String(data.updatedAt.getDate()).padStart(2, "0");
    const month = String(data.updatedAt.getMonth()).padStart(2, "0");
    const year = data.updatedAt.getFullYear();
    const hour = String(data.updatedAt.getHours()).padStart(2, "0");
    const minute = String(data.updatedAt.getMinutes()).padStart(2, "0");
    const date = `${day}/${month}/${year} ${hour}:${minute}`;

    const newData: SinglePostResponse = {
        id: data._id,
        username: data.username,
        photo: data.photo,
        url: data.url,
        description: data.description,
        likes: data.likes,
        date,
        comments: data.comments.map((item): CommentFormat => {
            const day = String(item.updatedAt.getDate()).padStart(2, "0");
            const month = String(item.updatedAt.getMonth()).padStart(2, "0");
            const year = item.updatedAt.getFullYear();
            const hour = String(item.updatedAt.getHours()).padStart(2, "0");
            const minute = String(item.updatedAt.getMinutes()).padStart(2, "0");
            const commentDate = `${day}/${month}/${year} ${hour}:${minute}`;

            return {
                userId: item.userId,
                username: item.username,
                photo: item.photo,
                comment: item.comment,
                isLike: item.isLike,
                date: commentDate,
            };
        }),
    };

    return newData;
};

export const Create = async (
    userId: string,
    payload: PostPayload
): Promise<PostResponse> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
    });
    if (!user) {
        throw new Error("400:User not found.");
    }

    const newPost = new post({
        userId: user.id,
        username: user.username,
        photo: user.profile?.photo,
        url: payload.url,
        description: payload.description,
        comments: [],
    });

    const savedPost = await newPost.save();
    const response: PostResponse = {
        postId: savedPost._id,
    };

    return response;
};

export const Update = async (
    userId: string,
    postId: string,
    payload: PostPayload
): Promise<PostResponse> => {
    const oldPost = await post.findOne({ _id: postId, userId: userId });
    if (!oldPost) {
        throw new Error("400:Post not found.");
    }

    oldPost.description = payload.description;
    oldPost.url = payload.url ? payload.url : "";
    const newPost = await oldPost.save();
    const response: PostResponse = {
        postId: newPost._id,
    };

    return response;
};

export const Delete = async (postid: string, userId: string): Promise<void> => {
    const oldPost = await post.findOne({ _id: postid, userId });
    if (!oldPost) {
        throw new Error("400:Post not found.");
    }

    await oldPost.deleteOne();
};

export const AddOrEditComment = async (
    postId: string,
    userId: string,
    payload: CommentPayload
): Promise<void> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
    });
    if (!user) {
        throw new Error("400:User not found.");
    }

    const oldPost = await post.findById(postId);
    if (!oldPost) {
        throw new Error("400:Post not found.");
    }

    let isExist = false;
    oldPost.comments.forEach((item) => {
        if (item.userId === user.id) {
            isExist = true;
        }
    });

    if (!isExist) {
        oldPost.comments.push({
            userId: user.id,
            username: user.username,
            photo: user.profile!.photo,
            comment: payload.comment,
            isLike: payload.isLike,
        });
    } else {
        const newComments = oldPost.comments.map((item) => {
            if (item.userId === user.id) {
                item.comment = payload.comment;
                item.isLike = payload.isLike;
                item.updatedAt = new Date();
            }

            return item;
        });

        oldPost.comments.length = 0;
        oldPost.comments.push(...newComments);
    }

    await oldPost.save();
};

export const DeleteComment = async (
    postId: string,
    userId: string
): Promise<void> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
    });
    if (!user) {
        throw new Error("400:User not found.");
    }

    const oldPost = await post.findById(postId);
    if (!oldPost) {
        throw new Error("400:Post not found.");
    }

    let index = -1;
    oldPost.comments.forEach((item, i) => {
        if (item.userId === user.id) {
            index = i;
        }
    });

    if (index !== -1) {
        oldPost.comments.splice(index, 1);
        await oldPost.save();
    } else {
        throw new Error("400:User on post not found.");
    }
};
