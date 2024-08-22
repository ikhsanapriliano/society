import { ChatResponse } from "../types/chat.type";
import {
    CreateRoomResponse,
    RoomPayload,
    RoomResponse,
    UserRoomResponse,
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
            username:
                chats.firstUserId === userId
                    ? chats.secondUser.username
                    : chats.firstUser.username,
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

export const FindByUserId = async (
    userId: string
): Promise<UserRoomResponse[]> => {
    const firstRooms = await prisma.room.findMany({
        where: { firstUserId: userId },
        include: {
            roomChat: {
                orderBy: {
                    createdAt: "desc",
                },
            },
            secondUser: {
                include: {
                    profile: true,
                },
            },
        },
    });

    const secondRooms = await prisma.room.findMany({
        where: { secondUserId: userId },
        include: {
            roomChat: {
                orderBy: {
                    createdAt: "desc",
                },
            },
            firstUser: {
                include: {
                    profile: true,
                },
            },
        },
    });

    const rooms: UserRoomResponse[] = [];

    if (firstRooms.length !== 0) {
        firstRooms.forEach((item) => {
            let temp: UserRoomResponse = {
                id: item.id,
                username: item.secondUser.username,
                photo: item.secondUser.profile!.photo,
                message:
                    item.roomChat.length !== 0
                        ? item.roomChat[0].message
                        : undefined,
            };

            if (temp.message !== undefined) {
                if (temp.message?.length > 20) {
                    temp = {
                        ...temp,
                        message: `${temp.message.substring(0, 16)}....`,
                    };
                }
            }

            rooms.push(temp);
        });
    }

    if (secondRooms.length !== 0) {
        secondRooms.forEach((item) => {
            let temp: UserRoomResponse = {
                id: item.id,
                username: item.firstUser.username,
                photo: item.firstUser.profile!.photo,
                message:
                    item.roomChat.length !== 0
                        ? item.roomChat[0].message
                        : undefined,
            };

            if (temp.message !== undefined) {
                if (temp.message?.length > 20) {
                    temp = {
                        ...temp,
                        message: `${temp.message.substring(0, 16)}....`,
                    };
                }
            }

            rooms.push(temp);
        });
    }

    return rooms;
};

export const Create = async (
    userid: string,
    payload: RoomPayload
): Promise<CreateRoomResponse> => {
    let room = await prisma.room.findFirst({
        where: { firstUserId: userid, secondUserId: payload.secondUserId },
    });

    if (!room) {
        room = await prisma.room.findFirst({
            where: { firstUserId: payload.secondUserId, secondUserId: userid },
        });
    }

    if (!room) {
        room = await prisma.room.create({
            data: { firstUserId: userid, secondUserId: payload.secondUserId },
        });
    }

    const response: CreateRoomResponse = {
        roomId: room.id,
    };

    return response;
};
