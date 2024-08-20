export interface RoomChatPayload {
    message: string;
    mediaUrl: string;
    roomId?: string;
    receiverId: string;
}

export interface RoomResponse {
    id: string;
    firstUserId: string;
    secondUser: {
        id: string;
        photo: string;
    };
    chats: ChatResponse[];
}

export interface ChatResponse {
    id: string;
    senderId: string;
    message?: string;
    mediaUrl?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
