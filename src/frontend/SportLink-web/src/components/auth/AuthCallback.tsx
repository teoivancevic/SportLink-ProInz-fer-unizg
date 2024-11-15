// src/components/auth/GoogleCallback.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/api';

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        navigate('/login?error=auth_failed');
        return;
      }

      try {
        await authService.handleAuthCallback(token);
        navigate('/'); 
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return null; // processing login, no UI needed
};