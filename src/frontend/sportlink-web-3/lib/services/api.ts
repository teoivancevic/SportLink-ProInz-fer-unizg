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
  GetOrganisationInfoResponse,
  Organization
} from '@/types/org'
import { arrayOutputType } from 'zod'

import {
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewsResponse,
  RespondReviewRequest,
  RespondReviewResponse,
  ReviewDistributionResponse,
  ReviewStatsResponse
} from '@/types/review'

import {
  getTournamentsResponse,
  Tournament
} from '@/types/tournaments'

import {
  getTrainingGroupsResponse,
  TrainingGroup,
  trainingGroupSearchResponse
} from '@/types/training-groups'

import { getSportsResponse } from '@/types/sport'
import { getSportObjectsResponse, SportObject, getSportObjectsSearch } from '@/types/sportObject'
import { getAllUsersResponse } from '@/types'

// import type {
//   searchSportsObjectsResponse,
// } from '@/types/sportObject'

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
      `/api/Auth/verify?userId=${data.userId}&otpCode=${data.otpCode}`
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

export const orgService = {
  createOrganization: (data: CreateOrgRequest) => 
    ApiClient.post<CreateOrgResponse>('/api/Organization/CreateOrganization', data),

  getOrganizations: (verified: boolean) => 
    ApiClient.get<GetOrganizationResponse>(`/api/Organization/Organizations?isVerified=${verified}`),

  getMyOrganizations: () =>
    ApiClient.get<GetOrganizationResponse>(`/api/Organization/myOrganizations`),

  getOrganization: (id: number) => 
    ApiClient.get<GetOrganisationInfoResponse>(`/api/Organization/${id}`),

  updateOrganization: (data: Organization) =>
    ApiClient.put<GetOrganisationInfoResponse>(`/api/Organization?id=${data.id}`, data),

  acceptOrganization: (id: number) => 
    ApiClient.put(`/api/Organization/${id}/verify/`, undefined),

  rejectOrganization: (id: number, reason: string) => 
    ApiClient.put(`/api/Organization/${id}/decline/`, reason ),
}

export const reviewService = {
  getAllReviews: (organisationId: number, sortOption: number) =>
    ApiClient.get<GetReviewsResponse>(`/api/Review/organization/${organisationId}`),

  getReviewStats: (organisationId: number) =>
    ApiClient.get<ReviewStatsResponse>(`/api/Review/organization/${organisationId}/stats`),

  getReviewDistribution: (organisationId: number) =>
    ApiClient.get<ReviewDistributionResponse>(`/api/Review/organization/${organisationId}/distribution`),

  createReview: (data: CreateReviewRequest) =>
    ApiClient.post<CreateReviewResponse>(`/api/Review`, data),

  deleteReview: (organisationId: number) => ApiClient.delete(`/api/Review?organizationId=${organisationId}`),

  respondReview: (data: RespondReviewRequest) =>
    ApiClient.put<RespondReviewResponse>(`/api/Review/respond?organizationId=${data.organizationId}&userId=${data.userId}&response=${data.response}`, data)
}

export const tournamentService = {
  getTournaments: (organisationId: number) =>
    ApiClient.get<getTournamentsResponse>(`/api/Tournament/organization/${organisationId}`),

  createTournament: (tournament: Tournament, orgId: number) => 
    ApiClient.post<boolean>(`/api/Tournament?organizationId=${orgId}`, tournament),

  updateTournament: (tournament: Tournament, tournamentId: number) => 
    ApiClient.put<boolean>(`/api/Tournament?idTournament=${tournamentId}`, tournament),

  deleteTournament: (tournamentId: number) =>
    ApiClient.delete<boolean>(`/api/Tournament?idTournament=${tournamentId}`),

  searchTournaments: (startDate: string, endDate: string, sportsTerm: string, sportIds: number[], maxPrice?: number) => {
    const params = new URLSearchParams();
  
    if (startDate) params.append("StartDate", startDate);
    if (endDate) params.append("EndDate", endDate);
    if (sportsTerm) params.append("SearchTerm", sportsTerm);
    if (sportIds.length) sportIds.forEach((id) => params.append("SportIds", id.toString()));
    if (maxPrice !== undefined) params.append("MaxPrice", maxPrice.toString());
  
    return ApiClient.get<getTournamentsResponse>(`/api/Tournament/search?${params.toString()}`);
  }
}

export const SportService  = {
  getSports: () =>
    ApiClient.get<getSportsResponse>(`/api/Sport`)
}

// TODO Teo, na backendu promijenit ovo da bude SportsObject controller
export const sportsObjectService  = {
  searchSportsObjects: (sportsTerm: string, sportIds: number[], maxPrice?: number) => {
    const params = new URLSearchParams();

    if (sportsTerm) params.append("SearchTerm", sportsTerm);
    if (sportIds.length) sportIds.forEach((id) => params.append("SportIds", id.toString()));
    if (maxPrice !== undefined) params.append("MaxPrice", maxPrice.toString());

    return ApiClient.get<getSportObjectsSearch>(`/api/SportsObject/search?${params.toString()}`);
  },
  
  getSportObjectDetailedById: (organizationId: number) =>
    ApiClient.get<getSportObjectsResponse>(`/api/SportsObject/organization/${organizationId}`),

  createSportObjectDetailed: (data: SportObject, organizationId: number) =>
    ApiClient.post<boolean>(`/api/SportsObject?id=${organizationId}`, data),

  updateSportObjectDetailed: (data: SportObject) => // create je org id, al tu je spobj id u queryju??
    ApiClient.put<boolean>(`/api/SportsObject?idSportObject=${data.id}`, data),
  
  deleteSportObjectDetailed: (idSportObject: number) => // create je org id, al tu je spobj id u queryju??
    ApiClient.delete<boolean>(`/api/SportsObject?idSportObject=${idSportObject}`),
}

export const trainingGroupService = {
  getTrainingGroups: (organisationId: number) =>
    ApiClient.get<getTrainingGroupsResponse>(`/api/TrainingGroup/organization/${organisationId}`),

  createTrainingGroup: (group: TrainingGroup, orgId: number) => 
    ApiClient.post<boolean>(`/api/TrainingGroup?id=${orgId}`, group),

  updateTrainingGroup: (group: TrainingGroup, idGroup: number) => 
    ApiClient.put<boolean>(`/api/TrainingGroup?idTrainingGroup=${idGroup}`, group),

  deleteTrainingGroup: (idGroup: number) =>
    ApiClient.delete<boolean>(`/api/TrainingGroup?idTrainingGroup=${idGroup}`),


  searchTrainingGroups: (
    sex: string[],
    minAge: number | undefined,
    maxAge: number | undefined,
    sportsTerm: string,
    sportIds: number[],
    maxPrice: number | undefined,
  ) => {
    const params = new URLSearchParams()

    if (sex.length > 0) params.append("Sex", sex.join(","))
    if (minAge !== undefined) params.append("MinAge", minAge.toString())
    if (maxAge !== undefined) params.append("MaxAge", maxAge.toString())
    if (sportsTerm) params.append("SearchTerm", sportsTerm)
    if (sportIds.length) sportIds.forEach((id) => params.append("SportIds", id.toString()));
    if (maxPrice !== undefined) params.append("MaxPrice", maxPrice.toString())

    return ApiClient.get<trainingGroupSearchResponse>(`/api/TrainingGroup/search?${params.toString()}`)
  },
}


export const userService ={
  getAllUsers: () =>
    ApiClient.get<getAllUsersResponse>(`/api/User`),

}

