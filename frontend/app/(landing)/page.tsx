'use client'

import dynamic from 'next/dynamic'
import Hero from '@/components/landing/Hero'
import MagicBento from '@/components/MagicBento'
import { features } from '@/lib/featuresData'
import { AnimatedSection } from '@/components/animations/ScrollAnimations'
import { useTheme } from '@/contexts/ThemeContext'

// Dynamically import LightRays to avoid SSR issues
const LightRays = dynamic(() => import('@/components/LightRays'), {
  ssr: false,
})

export default function LandingPage() {
  const { theme } = useTheme()

  return (
    <main className={`
      relative min-h-screen overflow-hidden
      ${theme === 'dark' ? 'bg-black' : 'bg-[#fafafa]'}
    `}>
      <div className="fixed inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor={theme === 'dark' ? '#ffffff' : '#000000'}
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
          className={theme === 'dark' ? 'opacity-40' : 'opacity-20'}
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section - Animated */}
        <AnimatedSection>
          <Hero />
        </AnimatedSection>

        {/* Features Section */}
        <AnimatedSection className="pt-20 px-6" id="features">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className={`
                font-(family-name:--font-playfair) text-5xl md:text-6xl mb-6
                ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
              `}>
                Everything You Need to{' '}
                <span className={`
                  bg-clip-text text-transparent
                  ${theme === 'dark'
                    ? 'bg-linear-to-r from-white via-white/90 to-white/70'
                    : 'bg-linear-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#4a4a4a]'
                  }
                `}>
                  Succeed
                </span>
              </h2>
              
              <p className={`
                text-xl max-w-2xl mx-auto leading-relaxed
                ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}
              `}>
                Powerful features designed to accelerate your learning journey and help you achieve your career goals
              </p>
            </div>

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
                glowColor={theme === 'dark' ? '250, 249, 246' : '26, 26, 26'}
                clickEffect={true}
                enableMagnetism={false}
                theme={theme}
              />
            </div>
          </div>
        </AnimatedSection>

        {/* How It Works Section */}
        <AnimatedSection 
          className="min-h-screen flex items-center justify-center px-6 py-20" 
          id="how-it-works"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className={`
              font-(family-name:--font-playfair) text-5xl md:text-6xl mb-6
              ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
            `}>
              How Pathfinder{' '}
              <span className={`
                bg-clip-text text-transparent
                ${theme === 'dark'
                  ? 'bg-linear-to-r from-white via-white/90 to-white/70'
                  : 'bg-linear-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#4a4a4a]'
                }
              `}>
                Works
              </span>
            </h2>
            
            <p className={`
              text-xl max-w-2xl mx-auto mb-16
              ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}
            `}>
              Simple, powerful, and designed for your success
            </p>
            
            {/* How It Works Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`
                group p-8 rounded-3xl transition-all
                ${theme === 'dark'
                  ? 'bg-white/2 border border-white/8 hover:border-white/15 hover:bg-white/4'
                  : 'bg-black/2 border border-black/8 hover:border-black/15 hover:bg-black/4'
                }
              `}>
                <div className={`
                  w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center 
                  group-hover:scale-110 transition-transform
                  ${theme === 'dark'
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-black/5 border border-black/10'
                  }
                `}>
                  <span className={`
                    text-3xl
                    ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                  `}>
                    1
                  </span>
                </div>
                <h3 className={`
                  text-xl font-semibold mb-3
                  ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                `}>
                  Set Your Goal
                </h3>
                <p className={theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}>
                  Tell us what you want to achieve and your available timeframe
                </p>
              </div>
              
              <div className={`
                group p-8 rounded-3xl transition-all
                ${theme === 'dark'
                  ? 'bg-white/2 border border-white/8 hover:border-white/15 hover:bg-white/4'
                  : 'bg-black/2 border border-black/8 hover:border-black/15 hover:bg-black/4'
                }
              `}>
                <div className={`
                  w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center 
                  group-hover:scale-110 transition-transform
                  ${theme === 'dark'
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-black/5 border border-black/10'
                  }
                `}>
                  <span className={`
                    text-3xl
                    ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                  `}>
                    2
                  </span>
                </div>
                <h3 className={`
                  text-xl font-semibold mb-3
                  ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                `}>
                  AI Generates Path
                </h3>
                <p className={theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}>
                  Our AI creates a personalized roadmap with smart checkpoints
                </p>
              </div>
              
              <div className={`
                group p-8 rounded-3xl transition-all
                ${theme === 'dark'
                  ? 'bg-white/2 border border-white/8 hover:border-white/15 hover:bg-white/4'
                  : 'bg-black/2 border border-black/8 hover:border-black/15 hover:bg-black/4'
                }
              `}>
                <div className={`
                  w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center 
                  group-hover:scale-110 transition-transform
                  ${theme === 'dark'
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-black/5 border border-black/10'
                  }
                `}>
                  <span className={`
                    text-3xl
                    ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                  `}>
                    3
                  </span>
                </div>
                <h3 className={`
                  text-xl font-semibold mb-3
                  ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                `}>
                  Track Progress
                </h3>
                <p className={theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}>
                  Complete checkpoints and watch your progress grow
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Pricing Section */}
        <AnimatedSection 
          className="min-h-screen flex items-center justify-center px-6 py-20" 
          id="pricing"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className={`
              font-(family-name:--font-playfair) text-5xl md:text-6xl mb-6
              ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
            `}>
              Simple, Transparent{' '}
              <span className={`
                bg-clip-text text-transparent
                ${theme === 'dark'
                  ? 'bg-linear-to-r from-white via-white/90 to-white/70'
                  : 'bg-linear-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#4a4a4a]'
                }
              `}>
                Pricing
              </span>
            </h2>
            
            <p className={`
              text-xl max-w-2xl mx-auto mb-16
              ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}
            `}>
              Start for free, upgrade when you're ready
            </p>
            
            {/* Pricing Card */}
            <div className="grid grid-cols-1 gap-8 max-w-xl mx-auto">
              {/* Free Plan */}
              <div className={`
                group p-8 rounded-3xl transition-all hover:shadow-2xl
                ${theme === 'dark'
                  ? 'bg-white/2 border border-white/8 hover:border-white/15 hover:shadow-black/20'
                  : 'bg-black/2 border border-black/8 hover:border-black/15 hover:shadow-black/10'
                }
              `}>
                <h3 className={`
                  text-2xl font-semibold mb-2
                  ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                `}>
                  Free
                </h3>
                <div className="mb-6">
                  <span className={`
                    text-5xl font-bold
                    ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                  `}>
                    $0
                  </span>
                  <span className={theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}>
                    /month
                  </span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className={`
                    flex items-center gap-3 transition-colors
                    ${theme === 'dark'
                      ? 'text-[#A7A7B0] group-hover:text-[#E5E5E8]'
                      : 'text-[#4a4a4a] group-hover:text-[#1a1a1a]'
                    }
                  `}>
                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>3 AI-generated paths</span>
                  </li>
                  <li className={`
                    flex items-center gap-3 transition-colors
                    ${theme === 'dark'
                      ? 'text-[#A7A7B0] group-hover:text-[#E5E5E8]'
                      : 'text-[#4a4a4a] group-hover:text-[#1a1a1a]'
                    }
                  `}>
                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Basic progress tracking</span>
                  </li>
                  <li className={`
                    flex items-center gap-3 transition-colors
                    ${theme === 'dark'
                      ? 'text-[#A7A7B0] group-hover:text-[#E5E5E8]'
                      : 'text-[#4a4a4a] group-hover:text-[#1a1a1a]'
                    }
                  `}>
                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Community support</span>
                  </li>
                </ul>
                <button className={`
                  w-full px-6 py-3 rounded-2xl font-medium
                  transition-all group-hover:scale-[1.02]
                  ${theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/15 text-[#E5E5E8]'
                    : 'bg-black/5 hover:bg-black/8 border border-black/10 hover:border-black/15 text-[#1a1a1a]'
                  }
                `}>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Footer - Animated */}
        <AnimatedSection className={`
          py-12
          ${theme === 'dark' ? 'border-t border-white/8' : 'border-t border-black/8'}
        `}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className={theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}>
                  © 2025 Pathfinder. Built by{' '}
                  <a 
                    href="https://github.com/Evilstein-debug" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`
                      hover:underline transition-colors
                      ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                    `}
                  >
                    Tejas Pathak
                  </a>
                </p>
              </div>
              <div className="flex gap-6">
                <a 
                  href="/privacy" 
                  className={`
                    transition-colors
                    ${theme === 'dark'
                      ? 'text-[#A7A7B0] hover:text-[#E5E5E8]'
                      : 'text-[#4a4a4a] hover:text-[#1a1a1a]'
                    }
                  `}
                >
                  Privacy
                </a>
                <a 
                  href="/terms" 
                  className={`
                    transition-colors
                    ${theme === 'dark'
                      ? 'text-[#A7A7B0] hover:text-[#E5E5E8]'
                      : 'text-[#4a4a4a] hover:text-[#1a1a1a]'
                    }
                  `}
                >
                  Terms
                </a>
                <a 
                  href="mailto:contact@pathfinder.com" 
                  className={`
                    transition-colors
                    ${theme === 'dark'
                      ? 'text-[#A7A7B0] hover:text-[#E5E5E8]'
                      : 'text-[#4a4a4a] hover:text-[#1a1a1a]'
                    }
                  `}
                >
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