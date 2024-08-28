import { NextFunction, Request, Response } from "express";
import { UpdateBioPayload, UpdatePhotoPayload } from "../types/user.type";
import { NewResponse } from "../utils/response.util";
import {
    Delete,
    FindMany,
    UpdateBio,
    UpdatePhoto,
} from "../services/user.service";
import {
    UpdateBioValidation,
    UpdatePhotoValidation,
} from "../validations/user.validation";

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

export const UpdatePhotoHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const userId: string = res.locals.userId;
        const payload: UpdatePhotoPayload = req.body;

        const { value, error } = UpdatePhotoValidation(payload);
        if (error !== undefined) throw new Error(`400:${error.message}`);

        const data = await UpdatePhoto(userId, value);
        return NewResponse(res, 200, data);
    } catch (error) {
        next(error);
    }
};

export const UpdateBioHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const userId: string = res.locals.userId;
        const payload: UpdateBioPayload = req.body;

        const { value, error } = UpdateBioValidation(payload);
        if (error !== undefined) throw new Error(`400:${error.message}`);

        const data = await UpdateBio(userId, value);
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
        const userId: string = res.locals.userId;

        await Delete(userId);
        return NewResponse(res, 200);
    } catch (error) {
        next(error);
    }
};
