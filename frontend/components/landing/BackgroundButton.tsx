'use client'

export default function BackgroundButton() {
  return (
    <button className="
      inline-flex items-center gap-2
      px-[22px] py-2.5 rounded-3xl
      bg-white/5 hover:bg-white/8
      border border-white/12 hover:border-white/18
      text-[15px] font-medium text-[#E5E5E8]
      transition-all duration-200
      group cursor-pointer
      mb-12
    ">
      <svg 
        className="w-4 h-4 text-[#A7A7B0] group-hover:text-[#E5E5E8] transition-colors" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 10V3L4 14h7v7l9-11h-7z" 
        />
      </svg>
      <span>AI-Powered Career Planning</span>
    </button>
  )
}