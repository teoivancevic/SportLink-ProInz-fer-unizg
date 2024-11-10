// src/services/api.ts
import axios from 'axios';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: 'https://api-sportlink-test.azurewebsites.net',
  headers: {
    'Content-Type': 'application/json',
  },
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
      localStorage.removeItem('token');
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

// Example usage with TypeScript
interface UserLoginData {
  name: string;
  email: string;
}

export const userService = {
  getUser: (id: number) => apiService.get<ApiResponse<UserLoginData>>(`/api/users/${id}`),
  updateUser: (id: number, data: Partial<UserLoginData>) => apiService.put<ApiResponse<UserLoginData>>(`/api/users/${id}`, data),
};