import authReducer from "@/slices/auth";
import sidebarReducer from "@/slices/sidebar";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
