import React from 'react';

const UnauthorizedElement: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <>{children}</>;
  }

  return null;
};

export default UnauthorizedElement;