import { NextFunction, Request, Response } from "express";
import { CommentPayload, PostPayload } from "../types/post.type";
import {
    AddOrEditComment,
    Create,
    Delete,
    DeleteComment,
    FindMany,
    FindSingle,
    Update,
} from "../services/post.service";
import { NewResponse } from "../utils/response.util";

export const FindManyHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const username = req.query.username as string | undefined;

        const data = await FindMany(username);
        return NewResponse(res, 200, data);
    } catch (error) {
        next(error);
    }
};

export const FindSingleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const postId = req.params.id;

        const data = await FindSingle(postId);
        return NewResponse(res, 200, data);
    } catch (error) {
        next(error);
    }
};

export const CreateHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const userId = res.locals.userId as string;
        const payload: PostPayload = req.body;

        const data = await Create(userId, payload);
        return NewResponse(res, 201, data);
    } catch (error) {
        next(error);
    }
};

export const UpdateHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const userId = res.locals.userId as string;
        const payload: PostPayload = req.body;
        const postId = req.params.id;

        const data = await Update(userId, postId, payload);
        return NewResponse(res, 200, data);
    } catch (error) {
        next(error);
    }
};

export const DeleteHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const postId = req.params.id;
        const userId = res.locals.userId as string;

        await Delete(postId, userId);
        return NewResponse(res, 200);
    } catch (error) {
        next(error);
    }
};

export const AddOrEditCommentHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const userId = res.locals.userId;
        const postId = req.params.id;
        const payload: CommentPayload = req.body;

        await AddOrEditComment(postId, userId, payload);
        return NewResponse(res, 201);
    } catch (error) {
        next(error);
    }
};

export const DeleteCommentHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const userId = res.locals.userId;
        const postId = req.params.id;

        await DeleteComment(postId, userId);
        return NewResponse(res, 201);
    } catch (error) {
        next(error);
    }
};
