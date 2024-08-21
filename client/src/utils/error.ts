import { clearAuth } from "@/slices/auth";
import { setLocation } from "@/slices/sidebar";
import { Dispatch } from "@reduxjs/toolkit";

export const handleError = (
    error: Error | unknown,
    dispatch: Dispatch
): string | undefined => {
    const message = (error as Error).message;
    const splitted = message.split(":");
    switch (splitted[0]) {
        case "500":
            console.log(error);
            window.location.href = "/";
            break;
        case "401" || "403":
            dispatch(clearAuth());
            dispatch(setLocation("/login"));
            window.location.href = "/";
            break;
        case "400":
            return splitted[1];
        default:
            console.log(error);
            window.location.href = "/";
    }
};
