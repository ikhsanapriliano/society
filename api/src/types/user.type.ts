export interface UpdatePhotoPayload {
    photo: string;
}

export interface UpdateBioPayload {
    bio: string;
}

export interface UserResponse {
    id: string;
    username: string;
    photo: string;
    bio: string;
}
