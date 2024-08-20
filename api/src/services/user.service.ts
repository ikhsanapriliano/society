import { UpdateUserPayload, UserResponse } from "../types/user.type";
import prisma from "../utils/prisma.util";

export const FindMany = async (
    username?: string,
    email?: string
): Promise<UserResponse[]> => {
    const users = await prisma.user.findMany({
        where: {
            username: {
                contains: username,
                mode: "insensitive",
            },
            email,
        },
        include: { profile: true },
    });

    const data: UserResponse[] = users.map(
        (user): UserResponse => ({
            id: user.id,
            username: user.username,
            email: user.email,
            photo: user.profile!.photo,
            bio: user.profile!.bio,
        })
    );

    return data;
};

export const Update = async (
    userId: string,
    payload: UpdateUserPayload
): Promise<void> => {
    await prisma.profile.update({
        where: { userId },
        data: payload,
    });
};

export const Delete = async (userId: string): Promise<void> => {
    await prisma.user.delete({
        where: { id: userId },
    });
};
