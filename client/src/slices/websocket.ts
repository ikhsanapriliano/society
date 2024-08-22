import { ChatFormat } from "@/types/chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WebsocketState {
    socket: WebSocket | null;
    data: ChatFormat | null;
}

const initialState: WebsocketState = {
    socket: null,
    data: null,
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
    },
});

export const { setSocket, setMessage } = websocketSlice.actions;
export default websocketSlice.reducer;
