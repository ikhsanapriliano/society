import { NextFunction, Request, Response } from "express";
import { Create, FindById } from "../services/room.service";
import { NewResponse } from "../utils/response.util";
import { RoomChatPayload } from "../types/room.type";

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

export const CreateHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const userId = res.locals.userId;
        const payload: RoomChatPayload = req.body;

        await Create(userId, payload);
        return NewResponse(res, 201);
    } catch (error) {
        next(error);
    }
};
