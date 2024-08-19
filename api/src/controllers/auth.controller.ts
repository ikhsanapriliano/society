import { NextFunction, Request, Response } from "express";
import { Register } from "../services/auth.service";
import { RegisterPayload } from "../types/auth.type";
import { NewResponse } from "../utils/response.util";

export const RegisterHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const payload = req.body;

        await Register(payload as RegisterPayload);
        return NewResponse(res, 201);
    } catch (error) {
        next(error);
    }
};
