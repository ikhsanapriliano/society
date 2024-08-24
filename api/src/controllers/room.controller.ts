import { NextFunction, Request, Response } from "express";
import { Create, FindById, FindByUserId } from "../services/room.service";
import { NewResponse } from "../utils/response.util";
import { RoomPayload } from "../types/room.type";

export const FindByIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const userId = res.locals.userId;
        const id = req.params.id;

        const data = await FindById(userId, id);
        return NewResponse(res, 200, data);
    } catch (error) {
        next(error);
    }
};

export const FindByUserIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const userId = res.locals.userId;
        const history = req.query.history as string | undefined;
        const isUnread = req.query.isUnread as boolean | undefined;

        const data = await FindByUserId(userId, history, isUnread);
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
        const userId = res.locals.userId;
        const payload: RoomPayload = req.body;

        const data = await Create(userId, payload);
        return NewResponse(res, 201, data);
    } catch (error) {
        next(error);
    }
};
