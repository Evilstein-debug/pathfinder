import apiClient from '../axios'

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: {
    _id: string
    username: string
    email: string
    createdAt: string
  }
  accessToken: string
  refreshToken: string
}

// Email/Password Registration
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data)
  return response.data
}

// Email/Password Login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data)
  return response.data
}

// Logout
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}

// Refresh Token
export const refreshToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  const response = await apiClient.post('/auth/refresh', { refreshToken })
  return response.data
}