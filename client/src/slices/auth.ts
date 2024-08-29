import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    token: string | undefined;
    userId: string | null;
    photo: string | null;
    isVerified: boolean;
}

const initialState: AuthState = {
    token: undefined,
    userId: null,
    photo: null,
    isVerified: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<AuthState>) => {
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.photo = action.payload.photo;
            state.isVerified = action.payload.isVerified;
        },
        clearAuth: (state) => {
            state.token = "";
            state.userId = "";
            state.photo = "";
        },
        setPhoto: (state, action: PayloadAction<string>) => {
            state.photo = action.payload;
        },
    },
});

export const { setAuth, clearAuth, setPhoto } = authSlice.actions;
export default authSlice.reducer;
