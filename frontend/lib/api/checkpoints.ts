import apiClient from '../axios'

export interface CheckpointData {
  title: string
  description?: string
  duration: string
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

// Add Checkpoint
export const addCheckpoint = async (
  pathId: string, 
  data: CheckpointData
): Promise<Checkpoint> => {
  const response = await apiClient.post(`/checkpoints/${pathId}/add`, data)
  return response.data.checkpoint
}

// Update Checkpoint
export const updateCheckpoint = async (
  checkpointId: string,
  updates: Partial<CheckpointData>
): Promise<Checkpoint> => {
  const response = await apiClient.put(`/checkpoints/update/${checkpointId}`, updates)
  return response.data.checkpoint
}

// Toggle Checkpoint Completion
export const toggleCheckpoint = async (checkpointId: string): Promise<Checkpoint> => {
  const response = await apiClient.patch(`/checkpoints/toggle/${checkpointId}`)
  return response.data.checkpoint
}

// Delete Checkpoint
export const deleteCheckpoint = async (checkpointId: string): Promise<void> => {
  await apiClient.delete(`/checkpoints/delete/${checkpointId}`)
}

// Get Checkpoints by Path
export const getCheckpointsByPath = async (pathId: string): Promise<Checkpoint[]> => {
  const response = await apiClient.get(`/checkpoints/${pathId}`)
  return response.data
}

// Reorder Checkpoints
export const reorderCheckpoints = async (
  pathId: string,
  checkpointIds: string[]
): Promise<Checkpoint[]> => {
  const response = await apiClient.put(`/checkpoints/${pathId}/reorder`, {
    checkpointIds
  })
  return response.data.checkpoints
}