import {
    ChatResponse,
    RoomChatPayload,
    RoomResponse,
} from "../types/room.type";
import prisma from "../utils/prisma.util";

export const FindById = async (
    userId: string,
    id: string
): Promise<RoomResponse> => {
    const chats = await prisma.room.findUnique({
        where: { id },
        include: {
            roomChat: true,
            firstUser: {
                include: {
                    profile: true,
                },
            },
            secondUser: {
                include: {
                    profile: true,
                },
            },
        },
    });

    if (chats === null) {
        throw new Error("400:Room not find.");
    }

    const data: RoomResponse = {
        id: chats.id,
        firstUserId: userId,
        secondUser: {
            id: chats.firstUserId === userId ? chats.secondUserId : userId,
            photo:
                chats.firstUserId === userId
                    ? chats.secondUser.profile!.photo
                    : chats.firstUser.profile!.photo,
        },
        chats: chats.roomChat.map(
            (chat): ChatResponse => ({
                id: chat.id,
                senderId: chat.senderId,
                message: chat.message !== "" ? chat.message : undefined,
                mediaUrl: chat.mediaUrl !== "" ? chat.mediaUrl : undefined,
                status: chat.status,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
            })
        ),
    };

    return data;
};

export const Create = async (
    userid: string,
    payload: RoomChatPayload
): Promise<void> => {
    if (!payload.roomId) {
        const { id } = await prisma.room.create({
            data: {
                firstUserId: userid,
                secondUserId: payload.receiverId,
            },
        });

        payload.roomId = id;
    }

    await prisma.roomChat.create({
        data: {
            roomId: payload.roomId,
            senderId: userid,
            message: payload.message,
            mediaUrl: payload.mediaUrl,
        },
    });
};
