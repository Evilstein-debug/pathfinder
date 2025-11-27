'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { generateAIPath } from '@/lib/api/paths'
import Link from 'next/link'

export default function CreatePathPage() {
  const router = useRouter()
  const { theme } = useTheme()
  
  const [formData, setFormData] = useState({
    goalType: 'shortTerm' as 'shortTerm' | 'longTerm',
    timeframe: 6,
    userGoalDescription: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedPath, setGeneratedPath] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const path = await generateAIPath(formData)
      setGeneratedPath(path)
      
      // Show success message briefly, then redirect
      setTimeout(() => {
        router.push(`/path/${path._id}`)
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate path')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const timeframeUnit = formData.goalType === 'shortTerm' ? 'months' : 'years'
  const maxTimeframe = formData.goalType === 'shortTerm' ? 12 : 5

  return (
    <div className={`
      min-h-screen pt-32 pb-20 px-6
      ${theme === 'dark' ? 'bg-black' : 'bg-[#fafafa]'}
    `}>
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className={`
            inline-flex items-center gap-2 mb-8
            text-sm font-medium transition-colors
            ${theme === 'dark'
              ? 'text-[#A7A7B0] hover:text-[#E5E5E8]'
              : 'text-[#4a4a4a] hover:text-[#1a1a1a]'
            }
          `}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className={`
            font-(family-name:--font-playfair) text-4xl md:text-5xl mb-4
            ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
          `}>
            Create Your{' '}
            <span className={`
              bg-clip-text text-transparent
              ${theme === 'dark'
                ? 'bg-linear-to-r from-white via-white/90 to-white/70'
                : 'bg-linear-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#4a4a4a]'
              }
            `}>
              Learning Path
            </span>
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
            Let AI generate a personalized roadmap tailored to your goals
          </p>
        </div>

        {/* Form Card */}
        <div className={`
          p-8 rounded-3xl backdrop-blur-xl shadow-2xl
          ${theme === 'dark'
            ? 'bg-white/3 border border-white/8 shadow-black/50'
            : 'bg-black/3 border border-black/8 shadow-black/20'
          }
        `}>
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

          {/* Success Message */}
          {generatedPath && (
            <div className="
              mb-6 p-4 rounded-2xl
              bg-green-500/10 border border-green-500/20
              text-green-400 text-sm
              flex items-center gap-3
            ">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Path created successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Goal Type Selection */}
            <div>
              <label className={`
                block text-base font-medium mb-4
                ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
              `}>
                What type of goal do you have?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, goalType: 'shortTerm', timeframe: 6 })}
                  className={`
                    p-6 rounded-2xl text-left transition-all
                    ${formData.goalType === 'shortTerm'
                      ? theme === 'dark'
                        ? 'bg-white/8 border-2 border-white/20'
                        : 'bg-black/8 border-2 border-black/20'
                      : theme === 'dark'
                        ? 'bg-white/2 border border-white/8 hover:bg-white/4'
                        : 'bg-black/2 border border-black/8 hover:bg-black/4'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`
                      w-10 h-10 rounded-xl hidden md:flex items-center justify-center
                      ${formData.goalType === 'shortTerm'
                        ? theme === 'dark'
                          ? 'bg-white/10'
                          : 'bg-black/10'
                        : theme === 'dark'
                          ? 'bg-white/5'
                          : 'bg-black/5'
                      }
                    `}>
                      <svg 
                        className={`w-5 h-5 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className={`
                      text-lg font-semibold
                      ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                    `}>
                      Short-term
                    </h3>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                    Quick skills or specific certifications (1-12 months)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, goalType: 'longTerm', timeframe: 2 })}
                  className={`
                    p-6 rounded-2xl text-left transition-all
                    ${formData.goalType === 'longTerm'
                      ? theme === 'dark'
                        ? 'bg-white/8 border-2 border-white/20'
                        : 'bg-black/8 border-2 border-black/20'
                      : theme === 'dark'
                        ? 'bg-white/2 border border-white/8 hover:bg-white/4'
                        : 'bg-black/2 border border-black/8 hover:bg-black/4'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`
                      w-10 h-10 rounded-xl hidden md:flex items-center justify-center
                      ${formData.goalType === 'longTerm'
                        ? theme === 'dark'
                          ? 'bg-white/10'
                          : 'bg-black/10'
                        : theme === 'dark'
                          ? 'bg-white/5'
                          : 'bg-black/5'
                      }
                    `}>
                      <svg 
                        className={`w-5 h-5 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className={`
                      text-lg font-semibold
                      ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                    `}>
                      Long-term
                    </h3>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                    Career transitions or advanced mastery (1-5 years)
                  </p>
                </button>
              </div>
            </div>

            {/* Timeframe Slider */}
            <div>
              <label className={`
                block text-base font-medium mb-4
                ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
              `}>
                How much time do you have?
              </label>
              <div className={`
                p-6 rounded-2xl
                ${theme === 'dark'
                  ? 'bg-white/2 border border-white/8'
                  : 'bg-black/2 border border-black/8'
                }
              `}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                    Timeframe
                  </span>
                  <span className={`
                    text-2xl font-bold
                    ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                  `}>
                    {formData.timeframe} {timeframeUnit}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={maxTimeframe}
                  value={formData.timeframe}
                  onChange={(e) => setFormData({ ...formData, timeframe: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: theme === 'dark'
                        ? `linear-gradient(to right, #D1D1D6 ${((formData.timeframe - 1) / (maxTimeframe - 1)) * 100}%, rgba(255,255,255,0.1) ${((formData.timeframe - 1) / (maxTimeframe - 1)) * 100}%)`
                        : `linear-gradient(to right, #1a1a1a ${((formData.timeframe - 1) / (maxTimeframe - 1)) * 100}%, rgba(0,0,0,0.1) ${((formData.timeframe - 1) / (maxTimeframe - 1)) * 100}%)`
                    }}
                />
                <div className="flex justify-between mt-2">
                  <span className={`text-xs ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                    1 {timeframeUnit.slice(0, -1)}
                  </span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                    {maxTimeframe} {timeframeUnit}
                  </span>
                </div>
              </div>
            </div>

            {/* Goal Description */}
            <div>
              <label className={`
                block text-base font-medium mb-4
                ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
              `}>
                Describe your goal
              </label>
              <textarea
                value={formData.userGoalDescription}
                onChange={(e) => setFormData({ ...formData, userGoalDescription: e.target.value })}
                placeholder="e.g., I want to become a frontend developer specializing in React and TypeScript..."
                rows={5}
                className={`
                  w-full px-4 py-3 rounded-2xl
                  focus:outline-none transition-colors resize-none
                  ${theme === 'dark'
                    ? 'bg-white/3 border border-white/8 text-[#E5E5E8] placeholder:text-[#A7A7B0]/50 focus:border-white/15'
                    : 'bg-black/3 border border-black/8 text-[#1a1a1a] placeholder:text-[#4a4a4a]/50 focus:border-black/15'
                  }
                `}
              />
              <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                💡 The more specific you are, the better AI can tailor your path
              </p>
            </div>

            {/* AI Generation Info */}
            <div className={`
              p-4 rounded-2xl flex items-start gap-3
              ${theme === 'dark'
                ? 'bg-white/3 border border-white/8'
                : 'bg-black/3 border border-black/8'
              }
            `}>
              <svg 
                className={`w-5 h-5 mt-0.5 shrink-0 ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}>
                  What happens next?
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                  Our AI will generate 5-8 smart checkpoints with durations, descriptions, and a feasibility score based on your inputs.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !!generatedPath}
              className={`
                w-full px-8 py-4 rounded-2xl
                text-base font-medium
                shadow-lg transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-3
                ${theme === 'dark'
                  ? 'bg-[#D1D1D6] hover:bg-white text-[#000000] shadow-black/25 hover:shadow-black/30'
                  : 'bg-[#1a1a1a] hover:bg-black text-white shadow-black/15 hover:shadow-black/25'
                }
              `}
            >
              {loading ? (
                <>
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
                  <span>Generating your path with AI...</span>
                </>
              ) : generatedPath ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Path Created!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate My Path with AI</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className={`
            p-6 rounded-2xl
            ${theme === 'dark'
              ? 'bg-white/2 border border-white/8'
              : 'bg-black/2 border border-black/8'
            }
          `}>
            <div className={`
              w-12 h-12 rounded-xl mb-4 flex items-center justify-center
              ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}
            `}>
              <svg 
                className={`w-6 h-6 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}>
              AI-Powered
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
              Gemini AI analyzes your goals and creates optimized learning paths
            </p>
          </div>

          <div className={`
            p-6 rounded-2xl
            ${theme === 'dark'
              ? 'bg-white/2 border border-white/8'
              : 'bg-black/2 border border-black/8'
            }
          `}>
            <div className={`
              w-12 h-12 rounded-xl mb-4 flex items-center justify-center
              ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}
            `}>
              <svg 
                className={`w-6 h-6 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}>
              Fully Editable
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
              Add, remove, or reorder checkpoints to match your learning style
            </p>
          </div>

          <div className={`
            p-6 rounded-2xl
            ${theme === 'dark'
              ? 'bg-white/2 border border-white/8'
              : 'bg-black/2 border border-black/8'
            }
          `}>
            <div className={`
              w-12 h-12 rounded-xl mb-4 flex items-center justify-center
              ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}
            `}>
              <svg 
                className={`w-6 h-6 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}>
              Track Progress
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
              Mark checkpoints complete and watch your journey progress
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}