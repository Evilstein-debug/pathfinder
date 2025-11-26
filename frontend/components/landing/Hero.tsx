'use client'

import Link from 'next/link'
import BackgroundButton from './BackgroundButton'
import { useTheme } from '@/contexts/ThemeContext'

export default function Hero() {
  const { theme } = useTheme()

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-[140px] pb-[30px]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <BackgroundButton />

        {/* Headline */}
        <h1 className={`
          text-[52px] leading-[1.2]
          tracking-[-0.5px]
          mb-6
          font-(family-name:--font-playfair)
          ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
        `}>
          Your Personalized Roadmap to{' '}
          <span className={`
            bg-clip-text text-transparent
            ${theme === 'dark'
              ? 'bg-linear-to-r from-white via-white/90 to-white/70'
              : 'bg-linear-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#4a4a4a]'
            }
          `}>
            Career Success
          </span>
        </h1>

        {/* Subheadline */}
        <p className={`
          text-xl max-w-2xl mx-auto mb-12 leading-relaxed
          ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}
        `}>
          Generate AI-powered learning paths tailored to your goals. 
          Track progress with smart checkpoints and achieve your dreams faster.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <Link 
            href="/sign-up"
            className={`
              inline-flex items-center gap-2
              px-8 py-4 rounded-4xl
              text-base font-medium
              shadow-lg
              transition-all duration-200
              group
              ${theme === 'dark'
                ? 'bg-[#D1D1D6] hover:bg-white text-[#000000] shadow-black/25 hover:shadow-black/30'
                : 'bg-[#1a1a1a] hover:bg-black text-white shadow-black/15 hover:shadow-black/25'
              }
            `}
          >
            <span>Start Your Journey</span>
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform hidden lg:block" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </Link>

          <Link 
            href="#how-it-works"
            className={`
              inline-flex items-center gap-2
              px-8 py-4 rounded-4xl
              text-base font-medium
              transition-all duration-200
              ${theme === 'dark'
                ? 'bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/15 text-[#A7A7B0] hover:text-[#E5E5E8]'
                : 'bg-black/5 hover:bg-black/8 border border-black/10 hover:border-black/15 text-[#4a4a4a] hover:text-[#1a1a1a]'
              }
            `}
          >
            <svg 
              className="w-5 h-5 hidden lg:block" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span>Watch Demo</span>
          </Link>
        </div>
      </div>
    </section>
  )
}