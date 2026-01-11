import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { KnowledgeBase } from '@/types'
import { useClientId } from '@/lib/clerk-auth-client'

export function useKnowledgeBases() {
  const clientId = useClientId()
  
  return useQuery({
    queryKey: ['knowledge-bases', clientId],
    queryFn: async () => {
      const response = await apiClient.get<KnowledgeBase[]>(endpoints.knowledge.list)
      return response.data
    },
    enabled: !!clientId, // Only fetch when clientId is available
    staleTime: 1000 * 60, // Consider data fresh for 60 seconds
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: 1, // Only retry once on failure
  })
}

export function useKnowledgeBase(id: string) {
  const clientId = useClientId()
  
  return useQuery({
    queryKey: ['knowledge-bases', clientId, id],
    queryFn: async () => {
      const response = await apiClient.get<KnowledgeBase>(endpoints.knowledge.get(id))
      return response.data
    },
    enabled: !!id && !!clientId,
  })
}

