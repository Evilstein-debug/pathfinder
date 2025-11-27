'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getAllPaths, type Path } from '@/lib/api/paths'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { theme } = useTheme()
  const [paths, setPaths] = useState<Path[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check authentication
    if (status === 'loading') return
    
    const accessToken = localStorage.getItem('accessToken')
    if (status === 'unauthenticated' && !accessToken) {
      router.push('/sign-in')
      return
    }

    // Fetch user's paths
    const fetchPaths = async () => {
      try {
        setLoading(true)
        const data = await getAllPaths()
        setPaths(data)
      } catch (err: any) {
        setError('Failed to load paths')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPaths()
  }, [status, router])

  if (loading) {
    return (
      <div className={`
        min-h-screen flex items-center justify-center
        ${theme === 'dark' ? 'bg-black' : 'bg-[#fafafa]'}
      `}>
        <div className="text-center">
          <svg 
            className={`
              animate-spin h-12 w-12 mx-auto mb-4
              ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
            `}
            viewBox="0 0 24 24"
          >
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
          <p className={theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}>
            Loading your paths...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`
      min-h-screen pt-32 pb-20 px-13
      ${theme === 'dark' ? 'bg-black' : 'bg-[#fafafa]'}
    `}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className={`
            font-(family-name:--font-playfair) text-3xl md:text-4xl mb-4
            ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
          `}>
            Your Learning{' '}
            <span className={`
              bg-clip-text text-transparent
              ${theme === 'dark'
                ? 'bg-linear-to-r from-white via-white/90 to-white/70'
                : 'bg-linear-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#4a4a4a]'
              }
            `}>
              Paths
            </span>
          </h1>
          <p className={`text-xl ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
            Track your progress and achieve your goals
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

        {/* Empty State */}
        {paths.length === 0 ? (
          <div className={`
            text-center py-20 rounded-3xl
            ${theme === 'dark'
              ? 'bg-white/2 border border-white/8'
              : 'bg-black/2 border border-black/8'
            }
          `}>
            <svg 
              className={`
                w-24 h-24 mx-auto mb-6
                ${theme === 'dark' ? 'text-white/10' : 'text-black/10'}
              `}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
              />
            </svg>
            <h3 className={`
              text-2xl font-semibold mb-3
              ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
            `}>
              No Paths Yet
            </h3>
            <p className={`
              mb-8 max-w-md mx-auto
              ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}
            `}>
              Start your learning journey by creating your first AI-powered roadmap
            </p>
            <Link
              href="/create-path"
              className={`
                inline-flex items-center gap-2
                px-8 py-4 rounded-2xl
                text-base font-medium
                shadow-lg transition-all duration-200
                ${theme === 'dark'
                  ? 'bg-[#D1D1D6] hover:bg-white text-[#000000] shadow-black/25 hover:shadow-black/30'
                  : 'bg-[#1a1a1a] hover:bg-black text-white shadow-black/15 hover:shadow-black/25'
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Your First Path</span>
            </Link>
          </div>
        ) : (
          /* Paths Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path) => (
              <Link
                key={path._id}
                href={`/path/${path._id}`}
                className={`
                  group p-6 rounded-3xl
                  transition-all duration-200
                  hover:scale-[1.02]
                  ${theme === 'dark'
                    ? 'bg-white/3 border border-white/8 hover:border-white/15 hover:bg-white/5 shadow-lg hover:shadow-black/20'
                    : 'bg-black/3 border border-black/8 hover:border-black/15 hover:bg-black/5 shadow-lg hover:shadow-black/10'
                  }
                `}
              >
                {/* Path Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    transition-colors
                    ${theme === 'dark'
                      ? 'bg-white/5 border border-white/10 group-hover:bg-white/8'
                      : 'bg-black/5 border border-black/10 group-hover:bg-black/8'
                    }
                  `}>
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
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                      />
                    </svg>
                  </div>
                  
                  {/* Progress Badge */}
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${theme === 'dark'
                      ? 'bg-white/5 text-[#A7A7B0]'
                      : 'bg-black/5 text-[#4a4a4a]'
                    }
                  `}>
                    {path.progress || 0}% Complete
                  </div>
                </div>

                {/* Path Title */}
                <h3 className={`
                  text-xl font-semibold mb-2 line-clamp-2
                  group-hover:underline decoration-2 underline-offset-4
                  ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                `}>
                  {path.title}
                </h3>

                {/* Path Meta */}
                <div className={`
                  flex items-center gap-4 text-sm mb-4
                  ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}
                `}>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{path.timeframe} {path.goalType === 'shortTerm' ? 'months' : 'years'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{path.checkpoints?.length || 0} checkpoints</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className={`
                  w-full h-2 rounded-full overflow-hidden
                  ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}
                `}>
                  <div 
                    className={`
                      h-full rounded-full transition-all duration-300
                      ${theme === 'dark'
                        ? 'bg-linear-to-r from-[#D1D1D6] to-white'
                        : 'bg-linear-to-r from-[#4a4a4a] to-[#1a1a1a]'
                      }
                    `}
                    style={{ width: `${path.progress || 0}%` }}
                  />
                </div>

                {/* Feasibility Score (if exists) */}
                {path.feasibilityScore && (
                  <div className={`
                    mt-4 pt-4 border-t flex items-center justify-between
                    ${theme === 'dark' ? 'border-white/8' : 'border-black/8'}
                  `}>
                    <span className={`text-sm ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                      Feasibility
                    </span>
                    <span className={`
                      text-sm font-medium
                      ${path.feasibilityScore >= 70 
                        ? 'text-green-500' 
                        : path.feasibilityScore >= 40 
                        ? 'text-yellow-500' 
                        : 'text-red-500'
                      }
                    `}>
                      {path.feasibilityScore}%
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}