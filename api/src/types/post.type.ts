import { Types } from "mongoose";

export interface PostPayload {
    url?: string;
    description: string;
}

export interface PostResponse {
    postId: Types.ObjectId;
}

export interface CommentFormat {
    userId: string;
    username: string;
    photo: string;
    comment: string;
    isLike: boolean;
    date: string;
}

export interface SinglePostResponse {
    id: Types.ObjectId;
    username: string;
    photo: string;
    url: string;
    description: string;
    likes: number;
    date: string;
    comments: CommentFormat[];
}

export interface ManyPostResponse {
    id: Types.ObjectId;
    username: string;
    photo: string;
    url: string;
    likes: number;
    date: string;
}

export interface CommentPayload {
    comment: string;
    isLike: boolean;
}
