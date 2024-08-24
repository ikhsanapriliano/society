/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../types/response.type";
import logger from "../utils/winston.util";

export const ErrorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    logger.error(err.message);

    let response: ErrorResponse = {
        status: 500,
        message: "Internal Server Error",
    };

    const message = err.message.split(":");
    switch (message[0]) {
        case "400":
            response = { status: 400, message: message[1] };
            res.status(400).json(response);
            break;
        case "401":
            response = { status: 401, message: message[1] };
            res.status(401).json(response);
            break;
        case "403":
            response = { status: 403, message: message[1] };
            res.status(403).json(response);
            break;
        default:
            res.status(500).json(response);
            break;
    }
};

export const NotFoundHandler = (_req: Request, res: Response): void => {
    try {
        const response: ErrorResponse = {
            status: 404,
            message: "Not Found",
        };

        res.status(404).json(response);
    } catch (error) {
        logger.error(error);
    }
};
