import { ChatResponse } from "./chat.type";

export interface RoomPayload {
    secondUserId: string;
}

export interface CreateRoomResponse {
    roomId: string;
}

export interface RoomResponse {
    id: string;
    firstUserId: string;
    secondUser: {
        id: string;
        username: string;
        photo: string;
    };
    chats: ChatResponse[];
}

export interface UserRoomResponse {
    id: string;
    username: string;
    photo: string;
    message?: string;
    updatedAt: Date;
}
