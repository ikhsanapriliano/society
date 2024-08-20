import {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
} from "../types/auth.type";
import { ComparePassword, HashPassword } from "../utils/bcrypt.util";
import prisma from "../utils/prisma.util";
import { GenerateToken } from "../utils/jwt.util";
import { Claims } from "../types/jwt.type";

export const Register = async (payload: RegisterPayload): Promise<void> => {
    const user = await prisma.user.findUnique({
        where: { username: payload.username, email: payload.email },
    });

    if (user) {
        throw new Error("400:Username or email already exist.");
    }

    payload.password = HashPassword(payload.password);

    await prisma.$transaction(async (prisma) => {
        const { id } = await prisma.user.create({
            data: {
                username: payload.username,
                email: payload.email,
                password: payload.password,
            },
        });

        await prisma.profile.create({
            data: {
                userId: id,
                bio: "",
            },
        });
    });
};

export const Login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const user = await prisma.user.findUnique({
        where: { email: payload.email },
        include: { profile: true },
    });

    if (!user) {
        throw new Error("400:Email not found.");
    }

    const isPasswordValid = ComparePassword(payload.password, user.password);
    if (!isPasswordValid) {
        throw new Error("400:Incorrect password.");
    }

    const claims: Claims = { userId: user.id, photo: user.profile?.photo };
    const token = GenerateToken(claims);

    const result: LoginResponse = {
        token,
    };

    return result;
};
