// types/auth.ts
import { UserRole } from '@/types/roles'




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

// export interface VerifResponse {
//     verified: boolean,
// }

export type VerifResponse = string;

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

export type ResendOTPResponse = string;






export interface UserData {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
}

export interface JWTPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': UserRole
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': string
  exp: number
  iss: string
  aud: string
}