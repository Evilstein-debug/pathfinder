'use client'

import dynamic from 'next/dynamic'
import Hero from '@/components/landing/Hero'
import MagicBento from '@/components/MagicBento'
import { features } from '@/lib/featuresData'
import { AnimatedSection } from '@/components/animations/ScrollAnimations'

// Dynamically import LightRays to avoid SSR issues
const LightRays = dynamic(() => import('@/components/LightRays'), {
  ssr: false,
})

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Light Rays Background */}
      <div className="fixed inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={8}
          rayLength={10}
          pulsating={false}
          fadeDistance={5}
          saturation={2}
          followMouse={true}
          mouseInfluence={0.5}
          noiseAmount={0.4}
          distortion={0.05}
          className="opacity-40"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Hero Section - Animated */}
        <AnimatedSection>
          <Hero />
        </AnimatedSection>

        {/* Features Section - Animated as one unit */}
        <AnimatedSection className="pt-20 px-6" id="features">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="
                font-(family-name:--font-playfair) text-5xl md:text-6xl text-[#E5E5E8] mb-6
              ">
                Everything You Need to{' '}
                <span className="
                  bg-linear-to-r from-white via-white/90 to-white/70
                  bg-clip-text text-transparent
                ">
                  Succeed
                </span>
              </h2>
              
              <p className="text-xl text-[#A7A7B0] max-w-2xl mx-auto leading-relaxed">
                Powerful features designed to accelerate your learning journey and help you achieve your career goals
              </p>
            </div>

            {/* Magic Bento Grid */}
            <div className="flex justify-center">
              <MagicBento
                cards={features}
                textAutoHide={false}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={false}
                disableAnimations={false}
                spotlightRadius={50}
                particleCount={8}
                enableTilt={true}
                glowColor="250, 249, 246"
                clickEffect={true}
                enableMagnetism={false}
              />
            </div>
          </div>
        </AnimatedSection>

        {/* How It Works Section - Animated as one unit */}
        <AnimatedSection 
          className="min-h-screen flex items-center justify-center px-6 py-20" 
          id="how-it-works"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="
              font-(family-name:--font-playfair) text-5xl md:text-6xl text-[#E5E5E8] mb-6
            ">
              How Pathfinder{' '}
              <span className="
                bg-linear-to-r from-white via-white/90 to-white/70
                bg-clip-text text-transparent
              ">
                Works
              </span>
            </h2>
            
            <p className="text-xl text-[#A7A7B0] max-w-2xl mx-auto mb-16">
              Simple, powerful, and designed for your success
            </p>
            
            {/* How It Works Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-3xl bg-white/2 border border-white/8 hover:border-white/15 transition-all hover:bg-white/4">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">1</span>
                </div>
                <h3 className="text-xl font-semibold text-[#E5E5E8] mb-3">Set Your Goal</h3>
                <p className="text-[#A7A7B0]">
                  Tell us what you want to achieve and your available timeframe
                </p>
              </div>
              
              <div className="group p-8 rounded-3xl bg-white/2 border border-white/8 hover:border-white/15 transition-all hover:bg-white/4">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">2</span>
                </div>
                <h3 className="text-xl font-semibold text-[#E5E5E8] mb-3">AI Generates Path</h3>
                <p className="text-[#A7A7B0]">
                  Our AI creates a personalized roadmap with smart checkpoints
                </p>
              </div>
              
              <div className="group p-8 rounded-3xl bg-white/2 border border-white/8 hover:border-white/15 transition-all hover:bg-white/4">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">3</span>
                </div>
                <h3 className="text-xl font-semibold text-[#E5E5E8] mb-3">Track Progress</h3>
                <p className="text-[#A7A7B0]">
                  Complete checkpoints and watch your progress grow
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Pricing Section - Animated as one unit */}
        <AnimatedSection 
          className="min-h-screen flex items-center justify-center px-6 py-20" 
          id="pricing"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="
              font-(family-name:--font-playfair) text-5xl md:text-6xl text-[#E5E5E8] mb-6
            ">
              Simple, Transparent{' '}
              <span className="
                bg-linear-to-r from-white via-white/90 to-white/70
                bg-clip-text text-transparent
              ">
                Pricing
              </span>
            </h2>
            
            <p className="text-xl text-[#A7A7B0] max-w-2xl mx-auto mb-16">
              Start for free, upgrade when you're ready
            </p>
            
            {/* Pricing Card */}
            <div className="grid grid-cols-1 gap-8 max-w-xl mx-auto">
              {/* Free Plan */}
              <div className="group p-8 rounded-3xl bg-white/2 border border-white/8 hover:border-white/15 transition-all hover:shadow-2xl hover:shadow-black/20">
                <h3 className="text-2xl font-semibold text-[#E5E5E8] mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-[#E5E5E8]">$0</span>
                  <span className="text-[#A7A7B0]">/month</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-[#A7A7B0] group-hover:text-[#E5E5E8] transition-colors">
                    <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>3 AI-generated paths</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#A7A7B0] group-hover:text-[#E5E5E8] transition-colors">
                    <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Basic progress tracking</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#A7A7B0] group-hover:text-[#E5E5E8] transition-colors">
                    <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Community support</span>
                  </li>
                </ul>
                <button className="
                  w-full px-6 py-3 rounded-2xl
                  bg-white/5 hover:bg-white/8
                  border border-white/10 hover:border-white/15
                  text-[#E5E5E8] font-medium
                  transition-all
                  group-hover:scale-[1.02]
                ">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Footer - Animated */}
        <AnimatedSection className="border-t border-white/8 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-[#A7A7B0]">
                  © 2025 Pathfinder. Built by{' '}
                  <a 
                    href="https://github.com/Evilstein-debug" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#E5E5E8] hover:underline transition-colors"
                  >
                    Tejas Pathak
                  </a>
                </p>
              </div>
              <div className="flex gap-6">
                <a href="/privacy" className="text-[#A7A7B0] hover:text-[#E5E5E8] transition-colors">
                  Privacy
                </a>
                <a href="/terms" className="text-[#A7A7B0] hover:text-[#E5E5E8] transition-colors">
                  Terms
                </a>
                <a href="mailto:contact@pathfinder.com" className="text-[#A7A7B0] hover:text-[#E5E5E8] transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </main>
  )
}