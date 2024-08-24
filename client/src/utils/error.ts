import { clearAuth } from "@/slices/auth";
import { Dispatch } from "@reduxjs/toolkit";

export const handleError = (
    error: Error | unknown,
    dispatch: Dispatch
): string | undefined => {
    const message = (error as Error).message;
    const splitted = message.split(":");
    console.log(error);
    switch (splitted[0]) {
        case "500":
            sessionStorage.setItem("error", JSON.stringify({ error: message }));
            window.location.reload();
            break;
        case "401" || "403":
            localStorage.removeItem("token");
            dispatch(clearAuth());
            window.location.href = "/";
            break;
        case "400":
            return splitted[1];
        default:
            sessionStorage.setItem("error", JSON.stringify({ error: message }));
            window.location.reload();
    }
};
