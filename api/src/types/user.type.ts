export interface UpdateUserPayload {
    photo: string;
    bio: string;
}

export interface UserResponse {
    id: string;
    username: string;
    email: string;
    photo: string;
    bio: string;
}
