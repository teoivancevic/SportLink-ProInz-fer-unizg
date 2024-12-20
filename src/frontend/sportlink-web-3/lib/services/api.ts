// lib/services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined in environment variables')
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Base API client
class ApiClient {
    private static async request<T>(
        endpoint: string, 
        options: RequestInit = {},
        responseType: 'json' | 'text' = 'json'
      ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
        
        const defaultHeaders: HeadersInit = {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        }
    
        try {
          const response = await fetch(url, {
            ...options,
            headers: defaultHeaders,
          })
    
          if (response.status === 401) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('authToken')
              window.location.href = '/login'
            }
            throw new Error('Unauthorized')
          }
    
          if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
          }
    
          // Handle different response types
          return responseType === 'json' ? response.json() : response.text() as T
        } catch (error) {
          console.error('API request failed:', error)
          throw error
        }
      }
    
      static get<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'GET' })
      }
    
      static post<T>(endpoint: string, data?: unknown, responseType: 'json' | 'text' = 'json') {
        return this.request<T>(
          endpoint, 
          {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
          },
          responseType
        )
      }

  static put<T>(endpoint: string, data?: unknown, params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : ''
    const endpointWithParams = queryString ? `${endpoint}?${queryString}` : endpoint
    
    return this.request<T>(endpointWithParams, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  static delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

// Auth service
export const authService = {
    login: async (data: LoginRequest) => {
        const token = await ApiClient.post<string>('/api/Auth/login', data, 'text')
        return token
      },

  loginGoogle: () => {
    if (typeof window !== 'undefined') {
      window.location.href = `${API_BASE_URL}/api/Auth/externalLogin/Google`
    }
  },

  register: (data: RegistrationRequest) => 
    ApiClient.post<RegistrationResponse>('/api/Auth/register', data),

  verify: (userId: number, otpCode: string, data: VerifRequest) => 
    ApiClient.put<VerifResponse>(
      `/api/Auth/verify`,
      data,
      { userId: userId.toString(), otpCode }
    ),

  resendOTP: (userId: number, data: ResendOTPRequest) => 
    ApiClient.put<ResendOTPResponse>(
      '/api/Auth/resendOTP',
      data,
      { userId: userId.toString() }
    ),

  handleAuthCallback: async (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  },
}

// Organization service
export const orgService = {
  createOrganization: (
    name: string, 
    description: string, 
    contactEmail: string, 
    contactPhoneNumber: string, 
    location: string, 
    data: CreateOrgRequest
  ) => ApiClient.post<CreateOrgResponse>(
    '/api/Organization/CreateOrganization',
    data,
    {
      name,
      description,
      contactEmail,
      contactPhoneNumber,
      location
    }
  ),

  getOrganizations: (verified: boolean) => 
    ApiClient.get<GetOrganizationResponse>(`/api/Organization/Organizations?isVerified=${verified}`),

  acceptOrganization: (id: number) => 
    ApiClient.put(`/api/Organization/${id}/verify/`, undefined),

  rejectOrganization: (id: number, reason: string) => 
    ApiClient.put(`/api/Organization/${id}/decline/`, { reason }),
}

// Types
import type { 
  LoginRequest, 
  LoginResponse, 
  RegistrationRequest, 
  RegistrationResponse,
  VerifRequest,
  VerifResponse,
  ResendOTPRequest,
  ResendOTPResponse 
} from '@/types/auth'

import type {
  CreateOrgRequest,
  CreateOrgResponse,
  GetOrganizationResponse
} from '@/types/org'