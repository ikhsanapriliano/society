import { PeopleResponse } from "@/types/people";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PeopleResponse = {
    id: "",
    username: "",
    email: "",
    photo: "",
    bio: "",
};

const peopleDetailSlice = createSlice({
    name: "peopleDetail",
    initialState,
    reducers: {
        setPeopleDetail: (state, action: PayloadAction<PeopleResponse>) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.photo = action.payload.photo;
            state.bio = action.payload.bio;
        },
        clearPeopleDetail: (state) => {
            state = {
                id: "",
                username: "",
                email: "",
                photo: "",
                bio: "",
            };
        },
    },
});

export const { setPeopleDetail, clearPeopleDetail } = peopleDetailSlice.actions;
export default peopleDetailSlice.reducer;
