'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
            transition-all duration-300
            flex items-center justify-between
            ${scrolled ? 'shadow-2xl' : ''}
            ${theme === 'dark' 
              ? 'bg-white/4 border border-white/8 shadow-black/20' 
              : 'bg-black/4 border border-black/8 shadow-black/10'
            }
          `}
        >
          {/* Logo */}
          <Link 
            href="/" 
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

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              href="#features" 
              className={`
                text-base font-medium transition-colors
                ${theme === 'dark' 
                  ? 'text-[#E5E5E8]/80 hover:text-[#E5E5E8]' 
                  : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
                }
              `}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className={`
                text-base font-medium transition-colors
                ${theme === 'dark' 
                  ? 'text-[#E5E5E8]/80 hover:text-[#E5E5E8]' 
                  : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
                }
              `}
            >
              How it Works
            </Link>
            <Link 
              href="#pricing" 
              className={`
                text-base font-medium transition-colors
                ${theme === 'dark' 
                  ? 'text-[#E5E5E8]/80 hover:text-[#E5E5E8]' 
                  : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
                }
              `}
            >
              Pricing
            </Link>
          </div>

          {/* Desktop Auth Buttons + Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Use ThemeToggle Component */}
            <ThemeToggle />

            <Link 
              href="/sign-in"
              className={`
                px-6 py-2.5 rounded-2xl text-base font-medium transition-colors
                ${theme === 'dark'
                  ? 'bg-[#b1b1b1] text-[#000000] hover:bg-white'
                  : 'bg-[#4a4a4a] text-white hover:bg-[#2a2a2a]'
                }
              `}
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up"
              className={`
                px-6 py-2.5 rounded-2xl text-base font-medium
                shadow-lg transition-all duration-200
                ${theme === 'dark'
                  ? 'bg-[#D1D1D6] hover:bg-white text-[#000000] shadow-black/25 hover:shadow-black/30'
                  : 'bg-[#1a1a1a] hover:bg-black text-white shadow-black/15 hover:shadow-black/25'
                }
              `}
            >
              Get Started
            </Link>
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
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            ) : (
              <svg 
                className={`w-6 h-6 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className={`
              fixed inset-0 backdrop-blur-sm z-40 lg:hidden
              ${theme === 'dark' ? 'bg-black/60' : 'bg-black/40'}
            `}
            onClick={closeMobileMenu}
          />

          {/* Mobile Menu Panel */}
          <div className="fixed top-28 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-md z-50 lg:hidden">
            <div className={`
              backdrop-blur-[20px] rounded-3xl p-6
              ${theme === 'dark'
                ? 'bg-white/4 border border-white/8 shadow-2xl shadow-black/50'
                : 'bg-black/4 border border-black/8 shadow-2xl shadow-black/30'
              }
            `}>
              {/* Navigation Links */}
              <div className="space-y-2 mb-6">
                <Link 
                  href="#features" 
                  onClick={closeMobileMenu}
                  className={`
                    block px-4 py-3 rounded-2xl text-base font-medium transition-colors
                    ${theme === 'dark'
                      ? 'text-[#E5E5E8] hover:bg-white/5'
                      : 'text-[#1a1a1a] hover:bg-black/5'
                    }
                  `}
                >
                  Features
                </Link>
                <Link 
                  href="#how-it-works" 
                  onClick={closeMobileMenu}
                  className={`
                    block px-4 py-3 rounded-2xl text-base font-medium transition-colors
                    ${theme === 'dark'
                      ? 'text-[#E5E5E8] hover:bg-white/5'
                      : 'text-[#1a1a1a] hover:bg-black/5'
                    }
                  `}
                >
                  How it Works
                </Link>
                <Link 
                  href="#pricing" 
                  onClick={closeMobileMenu}
                  className={`
                    block px-4 py-3 rounded-2xl text-base font-medium transition-colors
                    ${theme === 'dark'
                      ? 'text-[#E5E5E8] hover:bg-white/5'
                      : 'text-[#1a1a1a] hover:bg-black/5'
                    }
                  `}
                >
                  Pricing
                </Link>
              </div>

              {/* Divider */}
              <div className={`border-t my-6 ${theme === 'dark' ? 'border-white/8' : 'border-black/8'}`}></div>

              {/* Theme Toggle in Mobile Menu */}
              <div className="mb-3 flex justify-center">
                <ThemeToggle />
              </div>

              {/* Auth Buttons */}
              <div className="space-y-3">
                <Link 
                  href="/sign-in"
                  onClick={closeMobileMenu}
                  className={`
                    block w-full px-6 py-3 rounded-2xl text-center text-base font-medium
                    transition-colors
                    ${theme === 'dark'
                      ? 'text-[#A7A7B0] hover:text-[#E5E5E8] bg-white/3 hover:bg-white/5 border border-white/8'
                      : 'text-[#4a4a4a] hover:text-[#1a1a1a] bg-black/3 hover:bg-black/5 border border-black/8'
                    }
                  `}
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up"
                  onClick={closeMobileMenu}
                  className={`
                    block w-full px-6 py-3 rounded-2xl text-center text-base font-medium
                    shadow-lg transition-all duration-200
                    ${theme === 'dark'
                      ? 'bg-[#D1D1D6] hover:bg-white text-[#000000] shadow-black/25 hover:shadow-black/30'
                      : 'bg-[#1a1a1a] hover:bg-black text-white shadow-black/15 hover:shadow-black/25'
                    }
                  `}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}