import { NextFunction, Request, Response } from "express";
import { Login, Register } from "../services/auth.service";
import { LoginPayload, RegisterPayload } from "../types/auth.type";
import { NewResponse } from "../utils/response.util";
import {
    LoginValidation,
    RegisterValidation,
} from "../validations/auth.validation";

export const RegisterHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const payload: RegisterPayload = req.body;
        const { value, error } = RegisterValidation(payload);
        if (error !== undefined) throw new Error(`400:${error.message}`);

        const data = await Register(value);
        return NewResponse(res, 201, data);
    } catch (error) {
        next(error);
    }
};

export const LoginHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const payload: LoginPayload = req.body;
        const { value, error } = LoginValidation(payload);
        if (error !== undefined) throw new Error(`400:${error.message}`);

        const data = await Login(value);
        return NewResponse(res, 200, data);
    } catch (error) {
        next(error);
    }
};
