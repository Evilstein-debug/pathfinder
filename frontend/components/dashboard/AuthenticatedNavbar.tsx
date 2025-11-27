'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'

export default function AuthenticatedNavbar() {
  const router = useRouter()
  const { theme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      
      // Sign out from NextAuth
      await signOut({ redirect: false })
      
      // Redirect to home
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-4 lg:px-10">
        <div 
          className={`
            h-20 px-6 lg:px-10 rounded-[30px] 
            backdrop-blur-[20px]
            shadow-2xl
            transition-all duration-300
            flex items-center justify-between
            ${theme === 'dark' 
              ? 'bg-white/4 border border-white/8 shadow-black/20' 
              : 'bg-black/4 border border-black/8 shadow-black/10'
            }
          `}
        >
          {/* Logo */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className={`
              w-7 h-7 rounded-lg flex items-center justify-center border transition-colors
              ${theme === 'dark'
                ? 'bg-linear-to-br from-white/20 to-white/5 border-white/10 group-hover:border-white/20'
                : 'bg-linear-to-br from-black/20 to-black/5 border-black/10 group-hover:border-black/20'
              }
            `}>
              <svg 
                className={`w-4 h-4 ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}
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
            <span className={`text-xl font-semibold ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}>
              Pathfinder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              href="/dashboard"
              className={`
                px-5 py-2.5 rounded-2xl text-base font-medium transition-colors
                ${theme === 'dark'
                  ? 'text-[#E5E5E8] hover:bg-white/5'
                  : 'text-[#1a1a1a] hover:bg-black/5'
                }
              `}
            >
              Dashboard
            </Link>

            <Link 
              href="/create-path"
              className={`
                px-6 py-2.5 rounded-2xl text-base font-medium
                shadow-lg transition-all duration-200
                ${theme === 'dark'
                  ? 'bg-[#D1D1D6] hover:bg-white text-[#000000] shadow-black/25 hover:shadow-black/30'
                  : 'bg-[#1a1a1a] hover:bg-black text-white shadow-black/15 hover:shadow-black/25'
                }
              `}
            >
              Create Path
            </Link>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className={`
                px-5 py-2.5 rounded-2xl text-base font-medium transition-colors
                ${theme === 'dark'
                  ? 'bg-white/5 hover:bg-white/8 border border-white/10 text-[#E5E5E8]'
                  : 'bg-black/5 hover:bg-black/8 border border-black/10 text-[#1a1a1a]'
                }
              `}
            >
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`
              lg:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors
              ${theme === 'dark'
                ? 'bg-white/5 hover:bg-white/8 border border-white/10'
                : 'bg-black/5 hover:bg-black/8 border border-black/10'
              }
            `}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg 
                className={`w-6 h-6 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg 
                className={`w-6 h-6 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className={`
              fixed inset-0 backdrop-blur-sm z-40 lg:hidden
              ${theme === 'dark' ? 'bg-black/60' : 'bg-white/40'}
            `}
            onClick={closeMobileMenu}
          />

          <div className="fixed top-28 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-md z-50 lg:hidden">
            <div className={`
              backdrop-blur-[20px] rounded-3xl p-6
              ${theme === 'dark'
                ? 'bg-white/4 border border-white/8 shadow-2xl shadow-black/50'
                : 'bg-black/4 border border-black/8 shadow-2xl shadow-black/30'
              }
            `}>
              <div className="space-y-3">
                <Link 
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className={`
                    block px-4 py-3 rounded-2xl text-base font-medium transition-colors
                    ${theme === 'dark'
                      ? 'text-[#E5E5E8] hover:bg-white/5'
                      : 'text-[#1a1a1a] hover:bg-black/5'
                    }
                  `}
                >
                  Dashboard
                </Link>

                <Link 
                  href="/create-path"
                  onClick={closeMobileMenu}
                  className={`
                    block px-4 py-3 rounded-2xl text-center text-base font-medium
                    shadow-lg transition-all duration-200
                    ${theme === 'dark'
                      ? 'bg-[#D1D1D6] hover:bg-white text-[#000000] shadow-black/25'
                      : 'bg-[#1a1a1a] hover:bg-black text-white shadow-black/15'
                    }
                  `}
                >
                  Create Path
                </Link>

                <div className="pt-3 border-t flex items-center justify-between" 
                  style={{ 
                    borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' 
                  }}
                >
                  <span className={`text-sm ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                    Theme
                  </span>
                  <ThemeToggle />
                </div>

                <button
                  onClick={() => {
                    handleLogout()
                    closeMobileMenu()
                  }}
                  className={`
                    w-full px-4 py-3 rounded-2xl text-base font-medium transition-colors
                    ${theme === 'dark'
                      ? 'bg-white/5 hover:bg-white/8 border border-white/10 text-[#E5E5E8]'
                      : 'bg-black/5 hover:bg-black/8 border border-black/10 text-[#1a1a1a]'
                    }
                  `}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}