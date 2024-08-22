import { RoomChatPayload } from "../types/chat.type";
import prisma from "../utils/prisma.util";

export const CreateRoomChat = async (
    userId: string,
    payload: RoomChatPayload
): Promise<void> => {
    await prisma.roomChat.create({
        data: {
            roomId: payload.roomId,
            senderId: userId,
            message: payload.message ? payload.message : "",
            mediaUrl: payload.mediaUrl ? payload.mediaUrl : "",
        },
    });
};
