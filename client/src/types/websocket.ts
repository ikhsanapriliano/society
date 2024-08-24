import { ChatFormat } from "./chat";

export interface RegisterWebsocket {
    userId: string;
}

export interface WebsocketMessage {
    sender: string;
    receiver: string;
    data: ChatFormat;
}

export interface WebsocketMessageRead {
    sender: string;
    receiver: string;
    isRead: boolean;
}
