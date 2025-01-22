

export interface UserDetailed {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  lastLoginAt: string;
  isEmailVerified: boolean;
  externalUserSource?: number;
  createdAt: string;
  updatedAt: string;
  organizations: OrganizationForAdmin[];
}

export interface OrganizationForAdmin {
  id: number;
  name: string;
  location: string;
  // jos nekih stvari, ostavio prazno
  verificationStatus: VerificationStatusEnum;
}

export enum VerificationStatusEnum
{
    Unverified = 0,
    Accepted = 1,
    Rejected = 2
}

export interface getAllUsersResponse {
  data: UserDetailed[]
}