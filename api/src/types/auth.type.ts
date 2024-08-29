export interface RegisterPayload {
    username: string;
    password: string;
    confirmPassword: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}
