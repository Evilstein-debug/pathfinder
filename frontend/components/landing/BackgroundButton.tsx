'use client'

import { useTheme } from '@/contexts/ThemeContext'

export default function BackgroundButton() {
  const { theme } = useTheme()

  return (
    <button className={`
      inline-flex items-center gap-2
      px-[22px] py-2.5 rounded-3xl
      text-[15px] font-medium
      transition-all duration-200
      group cursor-pointer
      mb-12
      ${theme === 'dark'
        ? 'bg-white/5 hover:bg-white/8 border border-white/12 hover:border-white/18 text-[#E5E5E8]'
        : 'bg-black/5 hover:bg-black/8 border border-black/12 hover:border-black/18 text-[#1a1a1a]'
      }
    `}>
      <span>AI-Powered Career Planning</span>
    </button>
  )
}