import { ChatFormat } from "@/types/chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WebsocketState {
    socket: WebSocket | null;
    data: ChatFormat | null;
    users: string[];
}

const initialState: WebsocketState = {
    socket: null,
    data: null,
    users: [],
};

const websocketSlice = createSlice({
    name: "webscoket",
    initialState,
    reducers: {
        setSocket: (state, action: PayloadAction<WebSocket | null>) => {
            state.socket = action.payload;
        },
        setMessage: (state, action: PayloadAction<ChatFormat>) => {
            state.data = action.payload;
        },
        setUsers: (state, action: PayloadAction<string[]>) => {
            state.users = action.payload;
        },
    },
});

export const { setSocket, setMessage, setUsers } = websocketSlice.actions;
export default websocketSlice.reducer;
