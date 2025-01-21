interface User {
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
  organizations: Organization[];
}

interface Organization {
  id: number;
  name: string;
  location: string;
  verificationStatus: string;
}