import auth from "@/slices/auth";
import peopledetail from "@/slices/peopledetail";
import websocket from "@/slices/websocket";
import error from "@/slices/error";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        auth,
        websocket,
        peopledetail,
        error,
    },
    middleware: (defaultMiddleware) =>
        defaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
