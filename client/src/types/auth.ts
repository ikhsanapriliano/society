export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface JwtClaims {
    userId: string;
    photo: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}
