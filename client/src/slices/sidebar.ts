import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
    location: string;
}

const initialState: SidebarState = {
    location: "login",
};

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        setLocation: (state, action: PayloadAction<string>) => {
            state.location = action.payload;
        },
    },
});

export const { setLocation } = sidebarSlice.actions;
export default sidebarSlice.reducer;
