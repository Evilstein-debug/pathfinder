'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { useTheme } from '@/contexts/ThemeContext'

// ✨ FIX: Import the full Checkpoint type
import type { Checkpoint } from '@/lib/api/paths'

interface CheckpointData {
  title: string
  description: string
  duration: string
  completed: boolean
  order: number
  checkpointId: string
  onToggle: (id: string) => void
  onViewDetails: (data: CheckpointData) => void  // ✨ Keep this
}

const CheckpointNode = ({ data }: NodeProps<CheckpointData>) => {
  const { theme } = useTheme()
  const isCompleted = data.completed

  const handleClick = (e: React.MouseEvent) => {
    
    // If shift key is held, toggle completion
    if (e.shiftKey) {
      data.onToggle(data.checkpointId)
    } else {
      data.onViewDetails(data)
    }
  }

  return (
    <div className="relative group">
      {/* Input Handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3! h-3! border-2! ${
          theme === 'dark' ? 'bg-white/10! border-white/20!' : 'bg-black/10! border-black/20!'
        }`}
      />

      {/* Node Card */}
      <div
        className={`
          w-[280px] p-4 rounded-2xl backdrop-blur-xl
          transition-all duration-300 cursor-pointer
          ${isCompleted
            ? theme === 'dark'
              ? 'bg-green-500/10 border-2 border-green-500/30 shadow-lg shadow-green-500/10'
              : 'bg-green-500/10 border-2 border-green-500/40 shadow-lg shadow-green-500/20'
            : theme === 'dark'
              ? 'bg-white/3 border-2 border-white/10 hover:border-white/20 hover:bg-white/5 shadow-lg hover:shadow-black/30'
              : 'bg-black/3 border-2 border-black/10 hover:border-black/20 hover:bg-black/5 shadow-lg hover:shadow-black/20'
          }
        `}
        onClick={handleClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          {/* Order Badge */}
          <div
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0
              ${isCompleted
                ? 'bg-green-500/20 text-green-500'
                : theme === 'dark'
                  ? 'bg-white/5 text-[#A7A7B0]'
                  : 'bg-black/5 text-[#4a4a4a]'
              }
            `}
          >
            {data.order}
          </div>

          {/* Status Icon */}
          <div
            className={`
              w-6 h-6 rounded-full flex items-center justify-center shrink-0
              ${isCompleted
                ? 'bg-green-500'
                : theme === 'dark'
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-black/5 border border-black/10'
              }
            `}
          >
            {isCompleted && (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className={`
            text-base font-semibold mb-2 line-clamp-2
            ${isCompleted
              ? 'text-green-500'
              : theme === 'dark'
                ? 'text-[#E5E5E8]'
                : 'text-[#1a1a1a]'
            }
          `}
        >
          {data.title}
        </h3>

        {/* Description */}
        <p
          className={`
            text-sm mb-3 line-clamp-2
            ${isCompleted
              ? theme === 'dark'
                ? 'text-green-400/70'
                : 'text-green-600/70'
              : theme === 'dark'
                ? 'text-[#A7A7B0]'
                : 'text-[#4a4a4a]'
            }
          `}
        >
          {data.description}
        </p>

        {/* Duration Badge */}
        <div
          className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
            ${isCompleted
              ? 'bg-green-500/20 text-green-500'
              : theme === 'dark'
                ? 'bg-white/5 text-[#A7A7B0]'
                : 'bg-black/5 text-[#4a4a4a]'
            }
          `}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{data.duration}</span>
        </div>

        {/* View Details Hint - Shows on hover */}
        <div 
          className={`
            text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity
            ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}
          `}
        >
          💡 Click for details • Shift+Click to toggle
        </div>
      </div>

      {/* Output Handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3! h-3! border-2! ${
          theme === 'dark' ? 'bg-white/10! border-white/20!' : 'bg-black/10! border-black/20!'
        }`}
      />
    </div>
  )
}

export default memo(CheckpointNode)