import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isInternalError: false,
};

const errorSlice = createSlice({
    name: "error",
    initialState,
    reducers: {
        setInternalError: (state) => {
            state.isInternalError = true;
        },
    },
});

export const { setInternalError } = errorSlice.actions;
export default errorSlice.reducer;
