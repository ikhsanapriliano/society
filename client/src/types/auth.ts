export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface JwtClaims {
    userId: string;
    photo: string;
    isVerified: boolean;
}

export interface RegisterPayload {
    username: string;
    password: string;
    confirmPassword: string;
}
