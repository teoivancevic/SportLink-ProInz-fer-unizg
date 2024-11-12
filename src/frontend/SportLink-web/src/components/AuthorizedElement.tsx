import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

interface UserData {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

const AuthorizedElement: React.FC<{ children: (props: { userData: UserData }) => React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userData: UserData = {
        id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        firstName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
        lastName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
      };
      setUserData(userData);
    }
  }, []);

  if (!userData) {
    return null;
  }

  return <>{children({ userData })}</>;
};

export default AuthorizedElement;