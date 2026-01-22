import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { authManager } from '@/lib/auth-manager'
import { KnowledgeBase } from '@/types'
import { useClientId, useAuthReady } from '@/lib/clerk-auth-client'

export function useKnowledgeBases() {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['knowledge-bases', clientId],
    queryFn: async () => {
      // Wait for auth before fetching
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.get<KnowledgeBase[]>(endpoints.knowledge.list)
      return response.data
    },
    enabled: isAuthReady && authManager.hasToken(), // Only fetch when auth is ready
    staleTime: 1000 * 60, // Consider data fresh for 60 seconds
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      if (error instanceof Error && 
          (error.message.includes('Session expired') || 
           error.message.includes('Not authenticated') ||
           error.message.includes('401'))) {
        return false
      }
      return failureCount < 2
    },
  })
}

export function useKnowledgeBase(id: string) {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['knowledge-bases', clientId, id],
    queryFn: async () => {
      // Wait for auth before fetching
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.get<KnowledgeBase>(endpoints.knowledge.get(id))
      return response.data
    },
    enabled: !!id && isAuthReady && authManager.hasToken(),
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('Session expired')) {
        return false
      }
      return failureCount < 2
    },
  })
}
