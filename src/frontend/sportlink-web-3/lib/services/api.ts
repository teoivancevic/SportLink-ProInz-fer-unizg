// lib/services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined in environment variables')
}
// Types
import type { 
  LoginRequest, 
  //LoginResponse, 
  RegistrationRequest, 
  RegistrationResponse,
  VerifRequest,
  //VerifResponse,
  ResendOTPRequest,
  //ResendOTPResponse 
} from '@/types/auth'

import type {
  CreateOrgRequest,
  CreateOrgResponse,
  GetOrganizationResponse,
  GetOrganisationInfoResponse
} from '@/types/org'

import {
  CreateReviewResponse,
  GetReviewsResponse,
  ReviewDistributionResponse,
  ReviewStatsResponse,
} from '@/types/review'

type _ApiResponse<T> = {
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
        const result = responseType === 'json' ? await response.json() : await response.text()
        return {
          data: result,
          status: response.status,
          ok: response.ok,
        } as T
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
  }, 'text') // Force text response type for PUT requests
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
    const response = await ApiClient.post<string>(
        '/api/Auth/login',
        data,
        'text'  // Explicitly request text response for login
    )
    // @ts-expect-error unsure if response will be changed in api controller, stays like this for now. todo change in backend
    if (!response?.data) {
        throw new Error('Invalid login response')
    }
    return response
  },

  loginGoogle: () => {
    if (typeof window !== 'undefined') {
      window.location.href = `${API_BASE_URL}/api/Auth/externalLogin/Google`
    }
  },

  register: async (data: RegistrationRequest) => {
    const response = await ApiClient.post<RegistrationResponse>(
      '/api/Auth/register', 
      data,
      'json'  // Explicitly request JSON response
    )
    // @ts-expect-error unsure if response will be changed in api controller, stays like this for now. todo change in backend
    if (!response.data || !response.data.id) {
      throw new Error('Registration failed: Invalid response format')
    }
    // @ts-expect-error unsure if response will be changed in api controller, stays like this for now. todo change in backend
    return response.data
  },

  verify: (data: VerifRequest) => 
    ApiClient.put<string>(
      `/api/Auth/verify`,
      data
    ),

  resendOTP: (userId: number, data: ResendOTPRequest) => 
    ApiClient.put<string>(
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
    data
  ),

  getOrganizations: (verified: boolean) => 
    ApiClient.get<GetOrganizationResponse>(`/api/Organization/Organizations?isVerified=${verified}`),

  getMyOrganizations: () =>
    ApiClient.get<GetOrganizationResponse>(`/api/Organization/myOrganizations`),

  getOrganisation: (id: number) => 
    ApiClient.get<GetOrganisationInfoResponse>(`/api/Organization/${id}`),

  acceptOrganization: (id: number) => 
    ApiClient.put(`/api/Organization/${id}/verify/`, undefined),

  rejectOrganization: (id: number, reason: string) => 
    ApiClient.put(`/api/Organization/${id}/decline/`, { reason }),
}

export const reviewService = {
  getAllReviews: (organisationId: number, sortOption: number) =>
    ApiClient.get<GetReviewsResponse>(`/api/Review/organization/${organisationId}`),

  getReviewStats: (organisationId: number) =>
    ApiClient.get<ReviewStatsResponse>(`/api/Review/organization/${organisationId}/stats`),

  getReviewDistribution: (organisationId: number) =>
    ApiClient.get<ReviewDistributionResponse>(`/api/Review/organization/${organisationId}/distribution`),

  // TODO check this
  createReview: (data: CreateOrgRequest) =>
    ApiClient.post<CreateReviewResponse>(`/api/Review`, data, 'text'),

  //TODO check this
  deleteReview: (organisationId: number) => ApiClient.delete(`/api/Review`),

  //TODO check this
  respondToReview: (organizationId: number, userId: number, response: string) =>
    ApiClient.put(`/api/Review/respond`)
}
