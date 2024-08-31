import {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
} from "../types/auth.type";
import { ComparePassword, HashPassword } from "../utils/bcrypt.util";
import prisma from "../utils/prisma.util";
import { GenerateToken } from "../utils/jwt.util";
import { Claims } from "../types/jwt.type";

export const Register = async (
    payload: RegisterPayload
): Promise<LoginResponse> => {
    const user = await prisma.user.findUnique({
        where: { username: payload.username },
    });

    if (user) {
        throw new Error("400:Username already exist.");
    }

    payload.password = HashPassword(payload.password);

    const profile = await prisma.$transaction(async (prisma) => {
        const { id } = await prisma.user.create({
            data: {
                username: payload.username,
                password: payload.password,
            },
        });

        const profile = await prisma.profile.create({
            data: {
                photo: "/profile.jpg",
                userId: id,
                bio: "",
            },
        });

        return profile;
    });

    const claims: Claims = {
        userId: profile.userId,
        photo: profile.photo,
        isVerified: profile.bio !== "" ? true : false,
    };

    const token = await GenerateToken(claims);

    const result: LoginResponse = {
        token,
    };

    return result;
};

export const Login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const user = await prisma.user.findUnique({
        where: { username: payload.username },
        include: { profile: true },
    });

    if (!user) {
        throw new Error("400:Username not found.");
    }

    const isPasswordValid = await ComparePassword(
        payload.password,
        user.password
    );
    if (!isPasswordValid) {
        throw new Error("400:Incorrect password.");
    }

    const claims: Claims = {
        userId: user.id,
        photo: user.profile?.photo,
        isVerified: user.profile?.bio !== "" ? true : false,
    };
    const token = await GenerateToken(claims);

    const result: LoginResponse = {
        token,
    };

    return result;
};
