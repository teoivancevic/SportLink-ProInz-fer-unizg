// src/services/api.ts
import axios from 'axios';
import { LoginRequest, LoginResponse,RegistrationRequest, RegistrationResponse, VerifRequest, VerifResponse, ResendOTPRequest, ResendOTPResponse } from '../types/auth'
import { CreateOrgRequest, CreateOrgResponse } from '../types/org';

export const apiClient = axios.create({
  baseURL: 'https://api-sportlink-test-02.azurewebsites.net',
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
  resendOTP: (data: ResendOTPRequest) => 
    apiClient.put<ResendOTPResponse>('/api/Auth/resendOTP', data)
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
    )
};
