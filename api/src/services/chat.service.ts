import { RoomChatPayload } from "../types/chat.type";
import prisma from "../utils/prisma.util";

export const CreateRoomChat = async (
    userId: string,
    payload: RoomChatPayload
): Promise<void> => {
    await prisma.$transaction(async (prisma) => {
        await prisma.roomChat.create({
            data: {
                roomId: payload.roomId,
                senderId: userId,
                message: payload.message ? payload.message : "",
                mediaUrl: payload.mediaUrl ? payload.mediaUrl : "",
            },
        });

        await prisma.room.update({
            where: {
                id: payload.roomId,
            },
            data: {
                updatedAt: new Date(),
            },
        });
    });
};

export const UpdateRoomChat = async (roomId: string, userId: string) => {
    await prisma.roomChat.updateMany({
        where: {
            roomId,
            senderId: {
                not: userId,
            },
            status: "sent",
        },
        data: {
            status: "read",
        },
    });
};
