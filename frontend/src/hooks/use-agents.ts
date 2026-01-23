import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { authManager } from '@/lib/auth-manager'
import { Agent, CreateAgentData, UpdateAgentData } from '@/types'
import { useClientId, useAuthReady } from '@/lib/clerk-auth-client'

export function useAgents() {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['agents', clientId],
    queryFn: async () => {
      // Wait for auth before fetching
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.get<Agent[]>(endpoints.agents.list)
      return response.data
    },
    enabled: isAuthReady && authManager.hasToken(), // Only fetch when auth is ready
    staleTime: 1000 * 60, // Consider data fresh for 60 seconds (longer to prevent flickering)
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus for better performance
    refetchOnMount: false, // Don't refetch if data is fresh (prevents flickering)
    refetchOnReconnect: true, // Refetch on reconnect
    retry: (failureCount, error) => {
      // Don't retry auth errors - let authManager handle refresh
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

export function useAgent(id: string) {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['agents', clientId, id],
    queryFn: async () => {
      // Wait for auth before fetching
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.get<Agent>(endpoints.agents.get(id))
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

export function useCreateAgent() {
  const queryClient = useQueryClient()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async (data: CreateAgentData) => {
      try {
        // Ensure auth is ready before mutation
        if (!authManager.hasToken()) {
          await authManager.waitForAuth(5000)
          if (!authManager.hasToken()) {
            throw new Error('Not authenticated. Please sign in and try again.')
          }
        }
        
        const response = await apiClient.post<Agent>(endpoints.agents.create, data)
        return response.data
      } catch (error) {
        const rawError = error instanceof Error ? error : new Error(String(error))
        
        // Log RAW error for debugging
        console.error('[USE_CREATE_AGENT] Error creating agent (RAW ERROR)', {
          clientId,
          data,
          error: rawError,
          errorMessage: rawError.message,
          errorStack: rawError.stack,
          errorName: rawError.name,
          fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
        })
        
        // Re-throw with a user-friendly message
        if (rawError.message.includes('401') || rawError.message.includes('403')) {
          throw new Error('Authentication failed. Please sign in and try again.')
        }
        if (rawError.message.includes('Network') || rawError.message.includes('Failed to fetch')) {
          throw new Error('Network error. Please check your connection and try again.')
        }
        throw rawError
      }
    },
    onSuccess: (newAgent) => {
      // Optimistically update the cache for instant UI feedback
      queryClient.setQueryData<Agent[]>(['agents', clientId], (oldAgents = []) => {
        // Check if agent already exists (prevent duplicates)
        const exists = oldAgents.some(agent => agent.id === newAgent.id)
        if (exists) {
          return oldAgents.map(agent => agent.id === newAgent.id ? newAgent : agent)
        }
        return [newAgent, ...oldAgents]
      })
      // Refetch to ensure we have the latest data
      queryClient.refetchQueries({ queryKey: ['agents', clientId] })
    },
    onError: (error) => {
      // Log RAW error with full details
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[useCreateAgent] Mutation error (RAW ERROR)', {
        clientId,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
    },
  })
}

export function useUpdateAgent() {
  const queryClient = useQueryClient()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAgentData }) => {
      // Ensure auth is ready before mutation
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.patch<Agent>(
        endpoints.agents.update(id),
        data
      )
      return response.data
    },
    onSuccess: (updatedAgent) => {
      // Optimistically update the cache for instant UI feedback
      queryClient.setQueryData<Agent[]>(['agents', clientId], (oldAgents = []) => {
        return oldAgents.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent)
      })
      // Update individual agent cache
      queryClient.setQueryData<Agent>(['agents', clientId, updatedAgent.id], updatedAgent)
      // Refetch to ensure consistency
      queryClient.refetchQueries({ queryKey: ['agents', clientId] })
    },
  })
}

export function useDeleteAgent() {
  const queryClient = useQueryClient()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async (id: string) => {
      // Ensure auth is ready before mutation
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      await apiClient.delete(endpoints.agents.delete(id))
    },
    onSuccess: (_, deletedId) => {
      // Optimistically remove from cache for instant UI feedback
      queryClient.setQueryData<Agent[]>(['agents', clientId], (oldAgents = []) => {
        return oldAgents.filter(agent => agent.id !== deletedId)
      })
      // Refetch to ensure consistency
      queryClient.refetchQueries({ queryKey: ['agents', clientId] })
    },
  })
}

export function useSyncAgentWithUltravox() {
  const queryClient = useQueryClient()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async (id: string) => {
      // Ensure auth is ready before mutation
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.post<Agent>(endpoints.agents.sync(id), {})
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', clientId] })
    },
  })
}
