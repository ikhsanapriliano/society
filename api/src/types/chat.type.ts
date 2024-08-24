export interface RoomChatPayload {
    message?: string;
    mediaUrl?: string;
    roomId: string;
}

export interface ChatResponse {
    id: string;
    senderId: string;
    message?: string;
    mediaUrl?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}
