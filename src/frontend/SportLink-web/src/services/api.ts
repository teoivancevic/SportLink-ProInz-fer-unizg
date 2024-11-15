// src/services/api.ts
import axios from 'axios';
import { LoginRequest, LoginResponse,RegistrationRequest, RegistrationResponse, VerifRequest, VerifResponse, ResendOTPRequest, ResendOTPResponse } from '../types/auth'
import { CreateOrgRequest, CreateOrgResponse, GetOrganizationResponse } from '../types/org';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Example API functions
export const apiService = {
  get: <T>(url: string) => apiClient.get<T>(url).then((res) => res.data),
  post: <T>(url: string, data: unknown) => apiClient.post<T>(url, data).then((res) => res.data),
  put: <T>(url: string, data: unknown) => apiClient.put<T>(url, data).then((res) => res.data),
  delete: <T>(url: string) => apiClient.delete<T>(url).then((res) => res.data),
};

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export const authService = {
  login: (data: LoginRequest) => 
    apiClient.post<LoginResponse>('/api/Auth/login', data),
  loginGoogle: () => {
    window.location.href = `${apiClient.defaults.baseURL}/api/Auth/externalLogin/Google`;
  },
  register: (data: RegistrationRequest) => 
    apiClient.post<RegistrationResponse>('/api/Auth/register', data),
  verify: (userId: number, otpCode: string, data: VerifRequest) => 
    apiClient.put<VerifResponse>(
      `/api/Auth/verify`,
      data,
      {
        params: { userId, otpCode },
        headers: {
          'accept': 'text/plain',
        },
      }
    ),
  resendOTP: (userId: number, data: ResendOTPRequest) => 
    apiClient.put<ResendOTPResponse>('/api/Auth/resendOTP', data,
       {
        params: { userId },
        headers: {
          'accept': 'text/plain',
        },
        }),

  handleAuthCallback: async (token: string) => {
      // Store the token
      localStorage.setItem('authToken', token);
      
      // Optionally fetch user data
      try {
          // const response = await apiClient.get<ApiResponse<{ user: AuthState['user'] }>>(
          // '/api/Auth/me'
          // );
          //return response.data;
      } catch (error) {
          localStorage.removeItem('authToken');
          throw error;
      }
  },
};

export const orgService = {
  createOrganization: (name: string, description:string, contactEmail: string, contactPhoneNumber:string, location: string, data: CreateOrgRequest) =>
    apiClient.post<CreateOrgResponse>('/api/Organization/CreateOrganization', data,
      {
        params: { name,
          description,
          contactEmail,
          contactPhoneNumber,
          location},
        headers: {
          'accept': 'text/plain',
        },
      }
    ),
  getOrganizations: (verified: boolean) =>
    apiClient.get<GetOrganizationResponse>(`/api/Organization/Organizations?isVerified=${verified}`),
  acceptOrganization: (id: number) =>
    apiClient.put(`/api/Organization/${id}/verify/`),
  rejectOrganization: (id: number) =>
    apiClient.put(`/api/Organization/${id}/decline/`), // todo add reason
};
