import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the authentication token from local storage
    localStorage.removeItem('authToken');
    // Redirect to the login page
    navigate('/');
  }, [navigate]);

  return null;
};

export default Logout;