import apiClient from '../axios'

export interface PathData {
  goalType: 'shortTerm' | 'longTerm'
  timeframe: number
  userGoalDescription?: string
}

export interface Path {
  _id: string
  user: string
  title: string
  goalType: string
  timeframe: number
  feasibilityScore?: number
  checkpoints: Checkpoint[]
  createdAt: string
  updatedAt: string
}

export interface Checkpoint {
  _id: string
  pathID: string
  title: string
  description: string
  duration: string
  order: number
  completed: boolean
}

// Generate AI Path
export const generateAIPath = async (data: PathData): Promise<Path> => {
  const response = await apiClient.post('/ai/generate-path', data)
  return response.data.path
}

// Regenerate AI Path
export const regenerateAIPath = async (
  pathId: string, 
  data: Partial<PathData>
): Promise<Path> => {
  const response = await apiClient.post(`/ai/regenerate-path/${pathId}`, data)
  return response.data.path
}

// Get All Paths
export const getAllPaths = async (): Promise<Path[]> => {
  const response = await apiClient.get('/paths/all')
  return response.data
}

// Get Single Path
export const getSinglePath = async (pathId: string): Promise<Path> => {
  const response = await apiClient.get(`/paths/details/${pathId}`)
  return response.data
}

// Update Path
export const updatePath = async (
  pathId: string, 
  updates: Partial<Path>
): Promise<Path> => {
  const response = await apiClient.put(`/paths/update/${pathId}`, updates)
  return response.data.path
}

// Delete Path
export const deletePath = async (pathId: string): Promise<void> => {
  await apiClient.delete(`/paths/delete/${pathId}`)
}