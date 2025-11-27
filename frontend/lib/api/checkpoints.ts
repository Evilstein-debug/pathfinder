import apiClient from '../axios'

export interface Checkpoint {
  _id: string
  pathID: string
  title: string
  description: string
  duration: string
  order: number
  completed: boolean
}

export const toggleCheckpoint = async (checkpointId: string): Promise<Checkpoint> => {
  const response = await apiClient.patch(`/checkpoints/toggle/${checkpointId}`)
  return response.data
}

export const addCheckpoint = async (pathId: string, data: Partial<Checkpoint>): Promise<Checkpoint> => {
  const response = await apiClient.post(`/checkpoints/${pathId}/add`, data)
  return response.data
}

export const updateCheckpoint = async (checkpointId: string, data: Partial<Checkpoint>): Promise<Checkpoint> => {
  const response = await apiClient.put(`/checkpoints/update/${checkpointId}`, data)
  return response.data
}

export const deleteCheckpoint = async (checkpointId: string): Promise<void> => {
  await apiClient.delete(`/checkpoints/delete/${checkpointId}`)
}

export const getCheckpointsByPath = async (pathId: string): Promise<Checkpoint[]> => {
  const response = await apiClient.get(`/checkpoints/${pathId}`)
  return response.data
}

export const reorderCheckpoints = async (pathId: string, checkpointIds: string[]): Promise<void> => {
  await apiClient.put(`/checkpoints/${pathId}/reorder`, { checkpointIds })
}