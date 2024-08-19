import { Response } from "express";
import { SuccessResponse } from "../types/response.type";

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
