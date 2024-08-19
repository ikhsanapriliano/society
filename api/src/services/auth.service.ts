import { RegisterPayload } from "../types/auth.type";
import prisma from "../utils/prisma.util";

export const Register = async (payload: RegisterPayload): Promise<void> => {
    await prisma.user.create({
        data: {
            username: payload.username,
            email: payload.email,
            password: payload.password,
        },
    });
};
