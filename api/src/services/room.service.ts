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
            id:
                chats.firstUserId === userId
                    ? chats.secondUserId
                    : chats.firstUserId,
            username:
                chats.firstUserId === userId
                    ? chats.secondUser.username
                    : chats.firstUser.username,
            photo:
                chats.firstUserId === userId
                    ? chats.secondUser.profile!.photo
                    : chats.firstUser.profile!.photo,
        },
        chats: chats.roomChat
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
            .map((chat): ChatResponse => {
                const cHour = String(chat.createdAt.getHours()).padStart(
                    2,
                    "0"
                );
                const cMinute = String(chat.createdAt.getMinutes()).padStart(
                    2,
                    "0"
                );
                const uHour = String(chat.updatedAt.getHours()).padStart(
                    2,
                    "0"
                );
                const uMinute = String(chat.updatedAt.getMinutes()).padStart(
                    2,
                    "0"
                );

                const cTime = `${cHour}:${cMinute}`;
                const uTime = `${uHour}:${uMinute}`;

                return {
                    id: chat.id,
                    senderId: chat.senderId,
                    message: chat.message !== "" ? chat.message : undefined,
                    mediaUrl: chat.mediaUrl !== "" ? chat.mediaUrl : undefined,
                    status: chat.status,
                    createdAt: cTime,
                    updatedAt: uTime,
                };
            }),
    };

    return data;
};

export const FindByUserId = async (
    userId: string,
    history?: string,
    isUnread?: boolean
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

    let rooms: UserRoomResponse[] = [];

    if (firstRooms.length !== 0) {
        firstRooms.forEach((item) => {
            const temp: UserRoomResponse = {
                id: item.id,
                userId: item.secondUserId,
                username: item.secondUser.username,
                photo: item.secondUser.profile!.photo,
                message:
                    item.roomChat.length !== 0
                        ? item.roomChat[0].message
                        : undefined,
                updatedAt: item.updatedAt,
            };

            let unread = 0;
            if (item.roomChat.length !== 0) {
                for (const chat of item.roomChat) {
                    if (chat.status === "sent" && chat.senderId !== userId) {
                        unread++;
                    }

                    if (history) {
                        if (chat.message.includes(history)) {
                            temp.message = chat.message;
                            break;
                        } else {
                            temp.message = undefined;
                        }
                    }
                }
            }

            temp.unread = unread;

            if (isUnread && temp.unread === 0) {
                temp.message = undefined;
            }

            if (temp.message !== "" && temp.message !== undefined) {
                rooms.push(temp);
            }
        });
    }

    if (secondRooms.length !== 0) {
        secondRooms.forEach((item) => {
            const temp: UserRoomResponse = {
                id: item.id,
                userId: item.firstUserId,
                username: item.firstUser.username,
                photo: item.firstUser.profile!.photo,
                message:
                    item.roomChat.length !== 0
                        ? item.roomChat[0].message
                        : undefined,
                updatedAt: item.updatedAt,
            };

            let unread = 0;
            if (item.roomChat.length !== 0) {
                for (const chat of item.roomChat) {
                    if (chat.status === "sent" && chat.senderId !== userId) {
                        unread++;
                    }

                    if (history) {
                        if (chat.message.includes(history)) {
                            temp.message = chat.message;
                            break;
                        } else {
                            temp.message = undefined;
                        }
                    }
                }
            }

            temp.unread = unread;

            if (isUnread && temp.unread === 0) {
                temp.message = undefined;
            }

            if (temp.message !== "" && temp.message !== undefined) {
                rooms.push(temp);
            }
        });
    }

    rooms = rooms
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .map((item) => {
            const day = item.updatedAt.getDate().toString().padStart(2, "0");
            const month = (item.updatedAt.getMonth() + 1)
                .toString()
                .padStart(2, "0");
            const year = item.updatedAt.getFullYear();
            const date = `${day}/${month}/${year}`;
            return { ...item, date };
        });

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
