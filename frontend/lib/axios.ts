import axios from 'axios'
import { getSession } from 'next-auth/react'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add access token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If access token expired, try to refresh it
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const session = await getSession()
        
        if (!session?.refreshToken) {
          throw new Error('No refresh token available')
        }

        // Call backend refresh endpoint
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken: session.refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const newAccessToken = response.data.accessToken

        // Update session with new token (you'll need to implement this)
        // For now, just retry the request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        
        return apiClient(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient