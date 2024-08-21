import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    token: string | undefined;
    userId: string | null;
    photo: string | null;
}

const initialState: AuthState = {
    token: undefined,
    userId: null,
    photo: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<AuthState>) => {
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.photo = action.payload.photo;
        },
        clearAuth: (state) => {
            state = { token: undefined, userId: null, photo: null };
        },
    },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
