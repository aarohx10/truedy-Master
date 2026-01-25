import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { KnowledgeBase, CreateKnowledgeBaseData, UpdateKnowledgeBaseData } from '@/types'

// Fetch all knowledge bases
export function useKnowledgeBases() {
  return useQuery<KnowledgeBase[]>({
    queryKey: ['knowledge-bases'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<KnowledgeBase[]>(endpoints.knowledge.list)
        // Backend returns { data: KnowledgeBase[], meta: {...} }
        // apiClient.get returns BackendResponse<T> where T is the data type
        // So response.data is already KnowledgeBase[]
        const data = response.data
        return Array.isArray(data) ? data : []
      } catch (error) {
        console.error('[useKnowledgeBases] Error fetching knowledge bases:', error)
        throw error
      }
    },
  })
}

// Fetch single knowledge base
export function useKnowledgeBase(id: string) {
  return useQuery<KnowledgeBase>({
    queryKey: ['knowledge-bases', id],
    queryFn: async () => {
      const response = await apiClient.get<KnowledgeBase>(endpoints.knowledge.get(id))
      // Backend returns { data: KnowledgeBase, meta: {...} }
      // apiClient.get returns BackendResponse<T>, so response.data is KnowledgeBase
      return response.data
    },
    enabled: !!id,
  })
}

// Create knowledge base mutation
export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateKnowledgeBaseData) => {
      // Convert file to base64 (same pattern as voice cloning)
      const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            // Remove data URL prefix (e.g., "data:application/pdf;base64,")
            const base64 = result.split(',')[1] || result
            resolve(base64)
          }
          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.readAsDataURL(file)
        })
      }
      
      // Convert File to base64
      const base64Data = await convertFileToBase64(data.file)
      
      // Build JSON payload (same pattern as voice cloning)
      const payload = {
        name: data.name,
        description: data.description,
        file: {
          filename: data.file.name,
          data: base64Data,
          content_type: data.file.type || 'application/octet-stream',
        },
      }
      
      const response = await apiClient.post<KnowledgeBase>(
        endpoints.knowledge.create,
        payload
      )
      // Backend returns { data: KnowledgeBase, meta: {...} }
      // apiClient.post returns BackendResponse<T>, so response.data is KnowledgeBase
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] })
    },
  })
}

// Update knowledge base mutation
export function useUpdateKnowledgeBase() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateKnowledgeBaseData }) => {
      const response = await apiClient.put<KnowledgeBase>(
        endpoints.knowledge.update(id),
        data
      )
      // Backend returns { data: KnowledgeBase, meta: {...} }
      // apiClient.put returns BackendResponse<T>, so response.data is KnowledgeBase
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] })
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases', variables.id] })
    },
  })
}

// Delete knowledge base mutation
export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(endpoints.knowledge.delete(id))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] })
    },
  })
}
