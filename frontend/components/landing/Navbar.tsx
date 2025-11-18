'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-10">
      <div 
        className={`
          h-20 px-10 rounded-[40px] 
          backdrop-blur-[20px]
          bg-white/4
          border border-white/8
          flex items-center justify-between
          transition-all duration-300
          ${scrolled ? 'shadow-2xl shadow-black/20' : ''}
        `}
      >
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-7 h-7 bg-linear-to-br from-white/20 to-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
            <svg 
              className="w-4 h-4 text-white/90" 
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
          <span className="text-xl font-semibold text-[#E5E5E8]">
            Pathfinder
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="#features" 
            className="text-base font-medium text-[#E5E5E8]/80 hover:text-[#E5E5E8] transition-colors"
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            className="text-base font-medium text-[#E5E5E8]/80 hover:text-[#E5E5E8] transition-colors"
          >
            How it Works
          </Link>
          <Link 
            href="#pricing" 
            className="text-base font-medium text-[#E5E5E8]/80 hover:text-[#E5E5E8] transition-colors"
          >
            Pricing
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link 
            href="/sign-in"
            className="
              px-6 py-2.5 rounded-full
              text-base font-medium
              text-[#A7A7B0] hover:text-[#E5E5E8]
              transition-colors
            "
          >
            Sign In
          </Link>
          <Link 
            href="/sign-up"
            className="
              px-6 py-2.5 rounded-full
              bg-[#D1D1D6] hover:bg-white
              text-[#000000] text-base font-medium
              shadow-lg shadow-black/25
              transition-all duration-200
              hover:shadow-xl hover:shadow-black/30
            "
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}