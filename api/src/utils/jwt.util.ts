import { Claims } from "../types/jwt.type";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export const GenerateToken = (payload: Claims): string => {
    return sign(payload, String(process.env.JWT_SECRET_KEY), {
        expiresIn: String(process.env.JWT_EXPIRES_IN),
        algorithm: "HS256",
    });
};

export const ValidateToken = (token: string): JwtPayload => {
    return verify(token, String(process.env.JWT_SECRET_KEY)) as JwtPayload;
};
