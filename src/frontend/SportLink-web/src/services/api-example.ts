// src/services/api.ts
import axios from 'axios';

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
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
api.interceptors.response.use(
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
  get: <T>(url: string) => api.get<T>(url).then((res) => res.data),
  post: <T>(url: string, data: unknown) => api.post<T>(url, data).then((res) => res.data),
  put: <T>(url: string, data: unknown) => api.put<T>(url, data).then((res) => res.data),
  delete: <T>(url: string) => api.delete<T>(url).then((res) => res.data),
};

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Example usage with TypeScript
interface User {
  id: number;
  name: string;
  email: string;
}

export const userService = {
  getUser: (id: number) => apiService.get<ApiResponse<User>>(`/users/${id}`),
  updateUser: (id: number, data: Partial<User>) => apiService.put<ApiResponse<User>>(`/users/${id}`, data),
};