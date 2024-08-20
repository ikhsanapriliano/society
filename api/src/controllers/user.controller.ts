import { NextFunction, Request, Response } from "express";
import { UpdateUserPayload } from "../types/user.type";
import { NewResponse } from "../utils/response.util";
import { Delete, Update } from "../services/user.service";
import { UpdateUserValidation } from "../validations/user.validation";

export const UpdateHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const userId: string = res.locals.userId;
        const payload: UpdateUserPayload = req.body;

        const { value, error } = UpdateUserValidation(payload);
        if (error !== undefined) throw new Error(`400:${error.message}`);

        await Update(userId, value);
        return NewResponse(res, 200);
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
