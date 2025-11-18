'use client'

import dynamic from 'next/dynamic'
import Hero from '@/components/landing/Hero'

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
          raysSpeed={2}
          lightSpread={6}
          rayLength={10}
          pulsating={false}
          fadeDistance={2}
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
        <Hero />

        {/* Features Section (Placeholder) */}
        <section id="features" className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-semibold text-[#E5E5E8] mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-[#A7A7B0] max-w-2xl mx-auto">
              Features section coming soon...
            </p>
          </div>
        </section>

        {/* How It Works Section (Placeholder) */}
        <section id="how-it-works" className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-semibold text-[#E5E5E8] mb-4">
              How Pathfinder Works
            </h2>
            <p className="text-xl text-[#A7A7B0] max-w-2xl mx-auto">
              Process section coming soon...
            </p>
          </div>
        </section>

        {/* Pricing Section (Placeholder) */}
        <section id="pricing" className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-semibold text-[#E5E5E8] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-[#A7A7B0] max-w-2xl mx-auto">
              Pricing details coming soon...
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/8 py-12">
          <div className="max-w-6xl mx-auto px-6 text-center text-[#A7A7B0]">
            <p>© 2024 Pathfinder. Built by Tejas Pathak.</p>
          </div>
        </footer>
      </div>
    </main>
  )
}