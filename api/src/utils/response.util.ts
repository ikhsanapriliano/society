import { Response } from "express";
import { ErrorResponse, SuccessResponse } from "../types/response.type";

export const NewResponse = <T>(
    res: Response,
    status: number,
    data?: T
): Response => {
    const response: SuccessResponse<T> = {
        status,
        message: "success",
        data,
    };

    return res.status(status).json(response);
};

export const SendErrorResponse = (
    res: Response,
    status: number,
    message: string
): void => {
    const response: ErrorResponse = {
        status,
        message,
    };

    res.status(status).json(response);
};
