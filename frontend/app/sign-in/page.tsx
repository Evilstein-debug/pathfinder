'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/api/auth'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

export default function SignInPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await login({ email, password })
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth Login
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className={`
      min-h-screen flex items-center justify-center relative overflow-hidden
      ${theme === 'dark' ? 'bg-black' : 'bg-[#fafafa]'}
    `}>
      {/* Subtle gradient background */}
      <div className={`
        absolute inset-0
        ${theme === 'dark'
          ? 'bg-linear-to-br from-white/5 via-transparent to-white/5'
          : 'bg-linear-to-br from-black/5 via-transparent to-black/5'
        }
      `}></div>
      
      <div className="my-10 relative z-10 max-w-md w-full mx-4">
        {/* Card */}
        <div className={`
          p-8 rounded-3xl backdrop-blur-xl shadow-2xl
          ${theme === 'dark'
            ? 'bg-white/3 border border-white/8 shadow-black/50'
            : 'bg-black/3 border border-black/8 shadow-black/20'
          }
        `}>
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center border transition-colors
                ${theme === 'dark'
                  ? 'bg-linear-to-br from-white/20 to-white/5 border-white/10 group-hover:border-white/20'
                  : 'bg-linear-to-br from-black/20 to-black/5 border-black/10 group-hover:border-black/20'
                }
              `}>
                <svg 
                  className={`w-5 h-5 ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                  />
                </svg>
              </div>
            </Link>
            <h1 className={`
              font-(family-name:--font-playfair) text-3xl font-semibold mb-2
              ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
            `}>
              Welcome Back
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
              Sign in to continue your journey
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="
              mb-6 p-4 rounded-2xl
              bg-red-500/10 border border-red-500/20
              text-red-400 text-sm
            ">
              {error}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            className={`
              w-full flex items-center justify-center gap-3
              px-6 py-3.5 rounded-2xl
              text-base font-medium
              transition-all duration-200
              group mb-6
              ${theme === 'dark'
                ? 'bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/15 text-[#E5E5E8]'
                : 'bg-black/5 hover:bg-black/8 border border-black/10 hover:border-black/15 text-[#1a1a1a]'
              }
            `}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme === 'dark' ? 'border-white/8' : 'border-black/8'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 bg-transparent ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                Or sign in with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-2xl
                  focus:outline-none transition-colors
                  ${theme === 'dark'
                    ? 'bg-white/3 border border-white/8 text-[#E5E5E8] placeholder:text-[#A7A7B0]/50 focus:border-white/15'
                    : 'bg-black/3 border border-black/8 text-[#1a1a1a] placeholder:text-[#4a4a4a]/50 focus:border-black/15'
                  }
                `}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-2xl
                  focus:outline-none transition-colors
                  ${theme === 'dark'
                    ? 'bg-white/3 border border-white/8 text-[#E5E5E8] placeholder:text-[#A7A7B0]/50 focus:border-white/15'
                    : 'bg-black/3 border border-black/8 text-[#1a1a1a] placeholder:text-[#4a4a4a]/50 focus:border-black/15'
                  }
                `}
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link 
                href="/forgot-password"
                className={`
                  text-sm transition-colors
                  ${theme === 'dark'
                    ? 'text-[#A7A7B0] hover:text-[#E5E5E8]'
                    : 'text-[#4a4a4a] hover:text-[#1a1a1a]'
                  }
                `}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full px-6 py-3.5 rounded-2xl
                text-base font-medium
                shadow-lg transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                mt-6
                ${theme === 'dark'
                  ? 'bg-[#D1D1D6] hover:bg-white text-[#000000] shadow-black/25 hover:shadow-black/30'
                  : 'bg-[#1a1a1a] hover:bg-black text-white shadow-black/15 hover:shadow-black/25'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className={`text-center text-sm mt-6 ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
            Don't have an account?{' '}
            <Link 
              href="/sign-up" 
              className={`font-medium hover:underline ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <Link 
          href="/"
          className={`
            flex items-center justify-center gap-2
            mt-6 text-sm font-medium transition-colors
            ${theme === 'dark'
              ? 'text-[#A7A7B0] hover:text-[#E5E5E8]'
              : 'text-[#4a4a4a] hover:text-[#1a1a1a]'
            }
          `}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          <span>Back to home</span>
        </Link>
      </div>
    </div>
  )
}