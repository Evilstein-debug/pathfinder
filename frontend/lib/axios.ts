import axios from 'axios'
import { getSession, signOut } from 'next-auth/react'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    const accessToken = session?.accessToken
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    } else {
      console.warn('No access token found in session')
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 403 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const session = await getSession()
        const refreshToken = session?.refreshToken

        if (!refreshToken) {
          throw new Error('No refresh token in session')
        }

        console.log('Refreshing token...')

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const { accessToken: newAccessToken } = response.data
        
        console.log('Token refreshed successfully')

        // Update session with new token (this part is tricky with NextAuth)
        // You may need to trigger a session update
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        processQueue(null, newAccessToken)
        isRefreshing = false

        return apiClient(originalRequest)
      } catch (refreshError: any) {
        console.error('Token refresh failed:', refreshError.response?.data || refreshError.message)
        
        processQueue(refreshError, null)
        isRefreshing = false
        
        await signOut({ redirect: false })
        
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