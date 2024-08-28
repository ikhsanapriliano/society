import { LoginResponse } from "../types/auth.type";
import { Claims } from "../types/jwt.type";
import {
    UpdateBioPayload,
    UpdatePhotoPayload,
    UserResponse,
} from "../types/user.type";
import { GenerateToken } from "../utils/jwt.util";
import prisma from "../utils/prisma.util";

export const FindMany = async (username?: string): Promise<UserResponse[]> => {
    if (username === undefined) {
        return [];
    }

    const users = await prisma.user.findMany({
        where: {
            username: {
                contains: username,
                mode: "insensitive",
            },
            profile: {
                bio: {
                    not: "",
                },
            },
        },
        include: { profile: true },
    });

    const data: UserResponse[] = users.map(
        (user): UserResponse => ({
            id: user.id,
            username: user.username,
            photo: user.profile!.photo,
            bio: user.profile!.bio,
        })
    );

    return data;
};

export const FindById = async (userId: string): Promise<UserResponse> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
    });

    const response: UserResponse = {
        id: user!.id,
        username: user!.username,
        photo: user!.profile!.photo,
        bio: user!.profile!.bio,
    };

    return response;
};

export const UpdatePhoto = async (
    userId: string,
    payload: UpdatePhotoPayload
): Promise<LoginResponse> => {
    const user = await prisma.profile.update({
        where: { userId },
        data: payload,
    });

    const claims: Claims = {
        userId,
        photo: user.photo,
        isVerified: user.bio !== "" ? true : false,
    };
    const token = GenerateToken(claims);

    const result: LoginResponse = {
        token,
    };

    return result;
};

export const UpdateBio = async (
    userId: string,
    payload: UpdateBioPayload
): Promise<LoginResponse> => {
    const user = await prisma.profile.update({
        where: { userId },
        data: payload,
    });

    const claims: Claims = {
        userId,
        photo: user.photo,
        isVerified: user.bio !== "" ? true : false,
    };
    const token = GenerateToken(claims);

    const result: LoginResponse = {
        token,
    };

    return result;
};

export const Delete = async (userId: string): Promise<void> => {
    await prisma.user.delete({
        where: { id: userId },
    });
};
