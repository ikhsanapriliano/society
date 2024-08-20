import { NextFunction, Request, Response } from "express";
import { SendErrorResponse } from "../utils/response.util";
import { ValidateToken } from "../utils/jwt.util";
import logger from "../utils/winston.util";

export const AuthHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token = req.headers.authorization;
        if (token === undefined) {
            throw new Error("Token not found.");
        }

        token = token.split(" ")[1];
        const isValidate = ValidateToken(token);
        res.locals.userId = isValidate.userId;

        next();
    } catch (error: Error | unknown) {
        logger.error(error);
        SendErrorResponse(res, 401, (error as Error).message);
    }
};
