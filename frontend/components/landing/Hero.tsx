'use client'

import Link from 'next/link'
import BackgroundButton from './BackgroundButton'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-[140px] pb-[200px]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Background Announcement Button */}
        <BackgroundButton />

        {/* Headline */}
        <h1 className="
          text-[52px] leading-[1.2] font-semibold
          tracking-[-0.5px]
          text-[#E5E5E8]
          mb-6
        ">
          Your Personalized Roadmap to{' '}
          <span className="
            bg-linear-to-r from-white via-white/90 to-white/70
            bg-clip-text text-transparent
          ">
            Career Success
          </span>
        </h1>

        {/* Subheadline */}
        <p className="
          text-xl text-[#A7A7B0] 
          max-w-2xl mx-auto mb-12
          leading-relaxed
        ">
          Generate AI-powered learning paths tailored to your goals. 
          Track progress with smart checkpoints and achieve your dreams faster.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-6">
          <Link 
            href="/sign-up"
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-4xl
              bg-[#D1D1D6] hover:bg-white
              text-[#000000] text-base font-medium
              shadow-[0_4px_20px_rgba(0,0,0,0.25)]
              hover:shadow-[0_6px_30px_rgba(0,0,0,0.35)]
              transition-all duration-200
              group
            "
          >
            <span>Start Your Journey</span>
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
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
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-4xl
              bg-white/5 hover:bg-white/8
              border border-white/10 hover:border-white/15
              text-[#A7A7B0] hover:text-[#E5E5E8]
              text-base font-medium
              transition-all duration-200
            "
          >
            <svg 
              className="w-5 h-5" 
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

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 mt-16 text-sm text-[#A7A7B0]">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Free to start</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#A7A7B0]/30"></div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>1000+ users</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#A7A7B0]/30"></div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>4.9/5 rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}