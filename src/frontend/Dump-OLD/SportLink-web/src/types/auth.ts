export interface LoginRequest {
    email: string;
    password: string;
}

export type LoginResponse = string;
// export interface LoginResponse {
//     token: string
// }

export interface VerifRequest {
    userId: number,
    otpCode: string,
}

export interface VerifResponse {
    verified: boolean,
}

export interface RegistrationRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface RegistrationResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    // lastLoginAt: "2024-11-11T08:15:26.152Z",
    // createdAt: "2024-11-11T08:15:26.152Z",
    // updatedAt: "2024-11-11T08:15:26.152Z",
    isEmailVerified: boolean;
}

export interface ResendOTPRequest {
    userId: number,
}

export interface ResendOTPResponse {
}