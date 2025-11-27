'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { getSinglePath, deletePath, regenerateAIPath, type Path, type Checkpoint } from '@/lib/api/paths'
import { toggleCheckpoint } from '@/lib/api/checkpoints'
import { useTheme } from '@/contexts/ThemeContext'
import CheckpointNode from '@/components/flow/CheckpointNode'
import Link from 'next/link'
import AuthenticatedNavbar from '@/components/dashboard/AuthenticatedNavbar'

export default function PathDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { theme } = useTheme()
  const pathId = params.id as string

  const [path, setPath] = useState<Path | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [regenerating, setRegenerating] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRegenerateModal, setShowRegenerateModal] = useState(false)
  
  // Checkpoint detail modal state
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null)
  const [showCheckpointModal, setShowCheckpointModal] = useState(false)

  // Regenerate form state
  const [regenerateForm, setRegenerateForm] = useState({
    timeframe: 0,
    userGoalDescription: ''
  })

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Define custom node types
  const nodeTypes = useMemo(() => ({ checkpoint: CheckpointNode }), [])

    const handleViewCheckpointDetails = (checkpointData: any, pathData: Path) => {
        if (!pathData?.checkpoints) {
            console.error('No checkpoints in path!')
            return
        }
        
        const fullCheckpoint = pathData.checkpoints.find(cp => cp._id === checkpointData.checkpointId)
        
        if (fullCheckpoint) {
            setSelectedCheckpoint(fullCheckpoint)
            setShowCheckpointModal(true)
        } else {
            console.error('Checkpoint not found!')
            console.error('   Searched for:', checkpointData.checkpointId)
            console.error('   Available IDs:', pathData.checkpoints.map(cp => cp._id))
        }
    }

  // Toggle checkpoint completion
  const handleToggleCheckpoint = async (checkpointId: string) => {
    try {
      await toggleCheckpoint(checkpointId)
      await fetchPath()
    } catch (err) {
      console.error('Failed to toggle checkpoint:', err)
    }
  }

  // Generate React Flow nodes and edges from checkpoints
  const generateFlowNodes = (pathData: Path) => {
  if (!pathData.checkpoints || pathData.checkpoints.length === 0) return

  const sortedCheckpoints = [...pathData.checkpoints].sort((a, b) => a.order - b.order)

  const flowNodes: Node[] = sortedCheckpoints.map((checkpoint, index) => ({
    id: checkpoint._id,
    type: 'checkpoint',
    position: { x: 150, y: index * 400 },
    data: {
      title: checkpoint.title,
      description: checkpoint.description,
      duration: checkpoint.duration,
      completed: checkpoint.completed,
      order: checkpoint.order,
      checkpointId: checkpoint._id,
      onToggle: handleToggleCheckpoint,
      onViewDetails: (checkpointData: any) => handleViewCheckpointDetails(checkpointData, pathData), // ✨ Pass pathData
    },
  }))

  const flowEdges: Edge[] = sortedCheckpoints.slice(0, -1).map((checkpoint, index) => ({
    id: `e${checkpoint._id}-${sortedCheckpoints[index + 1]._id}`,
    source: checkpoint._id,
    target: sortedCheckpoints[index + 1]._id,
    type: 'smoothstep',
    animated: true,
    style: {
      stroke: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
      strokeWidth: 2,
    },
  }))

  setNodes(flowNodes)
  setEdges(flowEdges)
}

  // Fetch path data
  const fetchPath = async () => {
    try {
      setLoading(true)
      const data = await getSinglePath(pathId)
      setPath(data)
      
      setRegenerateForm({
        timeframe: data.timeframe,
        userGoalDescription: data.userGoalDescription || ''
      })
      
      generateFlowNodes(data)
    } catch (err: any) {
      setError('Failed to load path')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPath()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathId])

  const handleDeletePath = async () => {
    try {
      await deletePath(pathId)
      router.push('/dashboard')
    } catch (err) {
      console.error('Failed to delete path:', err)
    }
  }

  const handleRegeneratePath = async () => {
    try {
      setRegenerating(true)
      await regenerateAIPath(pathId, {
        goalType: path!.goalType,
        timeframe: regenerateForm.timeframe,
        userGoalDescription: regenerateForm.userGoalDescription,
      })
      await fetchPath()
      setShowRegenerateModal(false)
    } catch (err: any) {
      setError('Failed to regenerate path')
      console.error(err)
    } finally {
      setRegenerating(false)
    }
  }

  const progress = useMemo(() => {
    if (!path || !path.checkpoints || path.checkpoints.length === 0) return 0
    const completed = path.checkpoints.filter((cp) => cp.completed).length
    return Math.round((completed / path.checkpoints.length) * 100)
  }, [path])

  const timeframeUnit = path?.goalType === 'shortTerm' ? 'months' : 'years'
  const maxTimeframe = path?.goalType === 'shortTerm' ? 12 : 5

  if (loading) {
    return (
      <div
        className={`
          min-h-screen flex items-center justify-center
          ${theme === 'dark' ? 'bg-black' : 'bg-[#fafafa]'}
        `}
      >
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
          <p className={theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}>Loading path...</p>
        </div>
      </div>
    )
  }

  if (error || !path) {
    return (
      <div
        className={`
          min-h-screen flex items-center justify-center px-6
          ${theme === 'dark' ? 'bg-black' : 'bg-[#fafafa]'}
        `}
      >
        <div className="text-center max-w-md">
          <svg
            className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}>
            Path Not Found
          </h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>{error}</p>
          <Link
            href="/dashboard"
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-2xl
              text-base font-medium transition-all
              ${
                theme === 'dark'
                  ? 'bg-[#D1D1D6] hover:bg-white text-[#000000]'
                  : 'bg-[#1a1a1a] hover:bg-black text-white'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
    <AuthenticatedNavbar />
    <div
      className={`
        min-h-screen pt-36 pb-6 px-6
        ${theme === 'dark' ? 'bg-black' : 'bg-[#fafafa]'}
      `}
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <Link
              href="/dashboard"
              className={`
                inline-flex items-center gap-2 mb-4
                text-sm font-medium transition-colors
                ${theme === 'dark' ? 'text-[#A7A7B0] hover:text-[#E5E5E8]' : 'text-[#4a4a4a] hover:text-[#1a1a1a]'}
              `}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>

            <h1
              className={`
                font-(family-name:--font-playfair) text-3xl md:text-4xl mb-3
                ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
              `}
            >
              {path.title}
            </h1>

            <div className={`flex flex-wrap items-center gap-4 text-sm ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {path.timeframe} {path.goalType === 'shortTerm' ? 'months' : 'years'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span>{path.checkpoints.length} checkpoints</span>
              </div>
              {path.feasibilityScore && (
                <div className="flex items-center gap-1.5">
                  <span>Feasibility:</span>
                  <span
                    className={`font-medium ${
                      path.feasibilityScore >= 70
                        ? 'text-green-500'
                        : path.feasibilityScore >= 40
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}
                  >
                    {path.feasibilityScore}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRegenerateModal(true)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-2xl
                text-sm font-medium transition-all
                ${
                  theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/8 border border-white/10 text-[#E5E5E8]'
                    : 'bg-black/5 hover:bg-black/8 border border-black/10 text-[#1a1a1a]'
                }
              `}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Regenerate</span>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-2xl
                text-sm font-medium transition-all
                ${
                  theme === 'dark'
                    ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400'
                    : 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600'
                }
              `}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className={`
            mb-6 p-6 rounded-3xl
            ${theme === 'dark' ? 'bg-white/3 border border-white/8' : 'bg-black/3 border border-black/8'}
          `}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}>
              Overall Progress
            </span>
            <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}>
              {progress}%
            </span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-linear-to-r from-[#D1D1D6] to-white'
                  : 'bg-linear-to-r from-[#4a4a4a] to-[#1a1a1a]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
            {path.checkpoints.filter((cp) => cp.completed).length} of {path.checkpoints.length} checkpoints completed
          </p>
        </div>

        {/* React Flow Canvas */}
        <div
          className={`
            rounded-3xl overflow-hidden shadow-2xl
            ${theme === 'dark' ? 'bg-white/3 border border-white/8' : 'bg-black/3 border border-black/8'}
          `}
          style={{ height: 'calc(100vh - 400px)', minHeight: '600px' }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            className={theme === 'dark' ? 'bg-black/50' : 'bg-white/50'}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
            />
            <Controls
              className={
                theme === 'dark'
                  ? '[&>button]:bg-white/10! [&>button]:border-white/20! [&>button]:text-white!'
                  : '[&>button]:bg-black/10! [&>button]:border-black/20! [&>button]:text-black!'
              }
            />
            <MiniMap
              nodeColor={theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
              maskColor={theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'}
              className={`rounded-2xl! ${theme === 'dark' ? 'bg-white/5!' : 'bg-black/5!'}`}
            />
            <Panel position="top-right" className="flex gap-2 m-4">
              <div
                className={`
                  px-4 py-2 rounded-2xl text-sm font-medium backdrop-blur-xl
                  ${theme === 'dark' ? 'bg-white/10 text-[#E5E5E8]' : 'bg-black/10 text-[#1a1a1a]'}
                `}
              >
                💡 Click to view details • Shift+Click to toggle
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {showCheckpointModal && selectedCheckpoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`absolute inset-0 backdrop-blur-sm ${theme === 'dark' ? 'bg-black/60' : 'bg-black/40'}`}
            onClick={() => setShowCheckpointModal(false)}
          />
          <div
            className={`
              relative max-w-2xl w-full p-8 rounded-3xl backdrop-blur-xl shadow-2xl my-8
              ${theme === 'dark' ? 'bg-white/10 border border-white/20' : 'bg-white border border-black/20'}
            `}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4 flex-1">
                {/* Order Badge */}
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0
                    ${selectedCheckpoint.completed
                      ? 'bg-green-500/20 text-green-500'
                      : theme === 'dark'
                        ? 'bg-white/10 text-[#E5E5E8]'
                        : 'bg-black/10 text-[#1a1a1a]'
                    }
                  `}
                >
                  {selectedCheckpoint.order}
                </div>

                {/* Title & Status */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedCheckpoint.completed && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                  <h2
                    className={`
                      text-2xl font-bold
                      ${selectedCheckpoint.completed
                        ? 'text-green-500'
                        : theme === 'dark'
                          ? 'text-[#E5E5E8]'
                          : 'text-[#1a1a1a]'
                      }
                    `}
                  >
                    {selectedCheckpoint.title}
                  </h2>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowCheckpointModal(false)}
                  className={`
                    p-2 rounded-xl transition-colors
                    ${theme === 'dark'
                      ? 'hover:bg-white/10 text-[#A7A7B0] hover:text-[#E5E5E8]'
                      : 'hover:bg-black/10 text-[#4a4a4a] hover:text-[#1a1a1a]'
                    }
                  `}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Duration Badge */}
            <div className="mb-6">
              <div
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-xl
                  ${selectedCheckpoint.completed
                    ? 'bg-green-500/20 text-green-500'
                    : theme === 'dark'
                      ? 'bg-white/5 text-[#A7A7B0]'
                      : 'bg-black/5 text-[#4a4a4a]'
                  }
                `}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{selectedCheckpoint.duration}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}>
                Description
              </h3>
              <p
                className={`
                  text-base leading-relaxed whitespace-pre-wrap
                  ${selectedCheckpoint.completed
                    ? theme === 'dark'
                      ? 'text-green-400/70'
                      : 'text-green-600/70'
                    : theme === 'dark'
                      ? 'text-[#A7A7B0]'
                      : 'text-[#4a4a4a]'
                  }
                `}
              >
                {selectedCheckpoint.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckpointModal(false)}
                className={`
                  flex-1 px-4 py-3 rounded-2xl text-base font-medium transition-all
                  ${
                    theme === 'dark'
                      ? 'bg-white/5 hover:bg-white/8 border border-white/10 text-[#E5E5E8]'
                      : 'bg-black/5 hover:bg-black/8 border border-black/10 text-[#1a1a1a]'
                  }
                `}
              >
                Close
              </button>
              <button
                onClick={async () => {
                  await handleToggleCheckpoint(selectedCheckpoint._id)
                  setShowCheckpointModal(false)
                }}
                className={`
                  flex-1 px-4 py-3 rounded-2xl text-base font-medium transition-all
                  flex items-center justify-center gap-2
                  ${selectedCheckpoint.completed
                    ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 border border-yellow-500/30'
                    : theme === 'dark'
                      ? 'bg-[#D1D1D6] hover:bg-white text-[#000000]'
                      : 'bg-[#1a1a1a] hover:bg-black text-white'
                  }
                `}
              >
                {selectedCheckpoint.completed ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Mark as Incomplete</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Mark as Complete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className={`absolute inset-0 backdrop-blur-sm ${theme === 'dark' ? 'bg-black/60' : 'bg-black/40'}`}
            onClick={() => setShowDeleteModal(false)}
          />
          <div
            className={`
              relative max-w-md w-full p-8 rounded-3xl backdrop-blur-xl shadow-2xl
              ${theme === 'dark' ? 'bg-white/10 border border-white/20' : 'bg-white border border-black/20'}
            `}
          >
            <div className="text-center mb-6">
              <div
                className={`
                  w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                  bg-red-500/20
                `}
              >
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}>
                Delete Path?
              </h3>
              <p className={theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}>
                This action cannot be undone. All checkpoints and progress will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`
                  flex-1 px-4 py-3 rounded-2xl text-base font-medium transition-all
                  ${
                    theme === 'dark'
                      ? 'bg-white/5 hover:bg-white/8 border border-white/10 text-[#E5E5E8]'
                      : 'bg-black/5 hover:bg-black/8 border border-black/10 text-[#1a1a1a]'
                  }
                `}
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePath}
                className="
                  flex-1 px-4 py-3 rounded-2xl text-base font-medium transition-all
                  bg-red-500 hover:bg-red-600 text-white
                "
              >
                Delete Path
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate Form Modal - keep existing code */}
      {showRegenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`absolute inset-0 backdrop-blur-sm ${theme === 'dark' ? 'bg-black/60' : 'bg-black/40'}`}
            onClick={() => !regenerating && setShowRegenerateModal(false)}
          />
          <div
            className={`
              relative max-w-md w-full p-6 rounded-3xl backdrop-blur-xl shadow-2xl my-8
              ${theme === 'dark' ? 'bg-white/10 border border-white/20' : 'bg-white border border-black/20'}
            `}
          >
            <div className="mb-5">
                <div
                    className={`
                    w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center
                    ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}
                    `}
                >
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-2 text-center ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}`}>
                Regenerate Path
              </h3>
              <p className={`text-sm text-center ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                Adjust your timeframe or provide feedback for AI to create an improved path
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleRegeneratePath(); }} className="space-y-2">
              {/* Timeframe Slider */}
              <div>
                <label className={`
                  block text-xs font-medium mb-2
                  ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                `}>
                  Adjust Timeframe
                </label>
                <div className={`
                  p-3 rounded-2xl
                  ${theme === 'dark'
                    ? 'bg-white/3 border border-white/8'
                    : 'bg-black/3 border border-black/8'
                  }
                `}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                      Timeframe
                    </span>
                    <span className={`
                      text-lg font-bold
                      ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                    `}>
                      {regenerateForm.timeframe} {timeframeUnit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={maxTimeframe}
                    value={regenerateForm.timeframe}
                    onChange={(e) => setRegenerateForm({ ...regenerateForm, timeframe: parseInt(e.target.value) })}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: theme === 'dark'
                        ? `linear-gradient(to right, #D1D1D6 ${((regenerateForm.timeframe - 1) / (maxTimeframe! - 1)) * 100}%, rgba(255,255,255,0.1) ${((regenerateForm.timeframe - 1) / (maxTimeframe! - 1)) * 100}%)`
                        : `linear-gradient(to right, #1a1a1a ${((regenerateForm.timeframe - 1) / (maxTimeframe! - 1)) * 100}%, rgba(0,0,0,0.1) ${((regenerateForm.timeframe - 1) / (maxTimeframe! - 1)) * 100}%)`
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
                  block text-sm font-medium mb-3
                  ${theme === 'dark' ? 'text-[#E5E5E8]' : 'text-[#1a1a1a]'}
                `}>
                  Provide Feedback (Optional)
                </label>
                <textarea
                  value={regenerateForm.userGoalDescription}
                  onChange={(e) => setRegenerateForm({ ...regenerateForm, userGoalDescription: e.target.value })}
                  placeholder="What didn't work in the previous path? What would you like to change or improve?"
                  rows={3}
                  className={`
                    w-full px-4 py-3 rounded-2xl
                    focus:outline-none transition-colors resize-none
                    ${theme === 'dark'
                      ? 'bg-white/3 border border-white/8 text-[#E5E5E8] placeholder:text-[#A7A7B0]/50 focus:border-white/15'
                      : 'bg-black/3 border border-black/8 text-[#1a1a1a] placeholder:text-[#4a4a4a]/50 focus:border-black/15'
                    }
                  `}
                />
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-[#A7A7B0]' : 'text-[#4a4a4a]'}`}>
                  💡 AI will use your feedback to create a better path while maintaining context
                </p>
              </div>

              {/* Warning Message */}
              <div className={`
                p-3 rounded-2xl flex items-start gap-3
                ${theme === 'dark'
                  ? 'bg-yellow-500/10 border border-yellow-500/20'
                  : 'bg-yellow-500/10 border border-yellow-500/20'
                }
              `}>
                <svg 
                  className={`w-5 h-5 mt-0.5 shrink-0 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    Current progress will be reset
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-yellow-400/70' : 'text-yellow-600/70'}`}>
                    All checkpoints will be replaced with new AI-generated ones
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegenerateModal(false)}
                  disabled={regenerating}
                  className={`
                    flex-1 px-3 py-2 rounded-2xl text-base font-medium transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      theme === 'dark'
                        ? 'bg-white/5 hover:bg-white/8 border border-white/10 text-[#E5E5E8]'
                        : 'bg-black/5 hover:bg-black/8 border border-black/10 text-[#1a1a1a]'
                    }
                  `}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={regenerating}
                  className={`
                    flex-1 px-4 py-3 rounded-2xl text-base font-medium transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                    ${
                      theme === 'dark'
                        ? 'bg-[#D1D1D6] hover:bg-white text-[#000000]'
                        : 'bg-[#1a1a1a] hover:bg-black text-white'
                    }
                  `}
                >
                  {regenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Regenerating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Regenerate Path</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  )
}