import { apiClient } from './axiosClient'

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export interface CurrentUserResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  gender: string
  image: string
}

export async function loginRequest(username: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', {
    username,
    password,
  })
  return response.data
}

export async function getCurrentUserRequest(accessToken: string): Promise<CurrentUserResponse> {
  const response = await apiClient.get<CurrentUserResponse>('/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}