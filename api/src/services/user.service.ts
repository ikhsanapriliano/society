import { UpdateUserPayload } from "../types/user.type";
import prisma from "../utils/prisma.util";

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
