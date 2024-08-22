import auth from "@/slices/auth";
import peopledetail from "@/slices/peopledetail";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        auth,
        peopledetail,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
