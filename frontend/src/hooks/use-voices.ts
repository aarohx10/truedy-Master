import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { authManager } from '@/lib/auth-manager'
import { Voice } from '@/types'
import { useAuthClient, useClientId, useAuthReady } from '@/lib/clerk-auth-client'

/**
 * Hook for fetching voices from the API
 * Uses authManager.isReady to wait for auth before making requests
 */
export function useVoices(source?: 'ultravox' | 'custom') {
  const { clientId, isLoading: authLoading } = useAuthClient()
  const isAuthReady = useAuthReady()
  
  const query = useQuery({
    queryKey: ['voices', clientId, source],
    queryFn: async () => {
      const url = source ? `${endpoints.voices.list}?source=${source}` : endpoints.voices.list
      const response = await apiClient.get<Voice[]>(url)
      return response.data
    },
    enabled: !authLoading && isAuthReady && authManager.hasToken(),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    refetchInterval: (query) => {
      // Auto-refetch if any voice is training
      return query.data?.some(v => v.status === 'training') ? 3000 : false
    },
  })
  
  return query
}

export function useExploreVoices() {
  return useVoices('ultravox')
}

export function useMyVoices() {
  return useVoices('custom')
}

export function useVoice(id: string) {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  const { isLoading: authLoading } = useAuthClient()
  
  return useQuery({
    queryKey: ['voices', clientId, id],
    queryFn: async () => {
      const response = await apiClient.get<Voice>(endpoints.voices.get(id))
      return response.data
    },
    enabled: !!id && !authLoading && isAuthReady && authManager.hasToken(),
  })
}

export function useCreateVoice() {
  const queryClient = useQueryClient()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async (data: {
      name: string
      strategy: 'external' | 'native' | 'auto'
      source: {
        type: 'external' | 'native'
        provider_voice_id?: string
        samples?: Array<{
          text: string
          storage_key: string
          duration_seconds: number
        }>
      }
      provider_overrides?: {
        provider?: string
      }
    }) => {
      const response = await apiClient.post<Voice>(endpoints.voices.create, data)
      return response.data
    },
    onSuccess: (newVoice) => {
      queryClient.setQueryData<Voice[]>(['voices', clientId, 'custom'], (oldVoices = []) => {
        const exists = oldVoices.some(voice => voice.id === newVoice.id)
        if (exists) {
          return oldVoices.map(voice => voice.id === newVoice.id ? newVoice : voice)
        }
        return [newVoice, ...oldVoices]
      })
      queryClient.refetchQueries({ queryKey: ['voices', clientId, 'custom'] })
    },
  })
}

export function useDeleteVoice() {
  const queryClient = useQueryClient()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(endpoints.voices.delete(id))
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Voice[]>(['voices', clientId, 'custom'], (oldVoices = []) => {
        return oldVoices.filter(voice => voice.id !== deletedId)
      })
      queryClient.refetchQueries({ queryKey: ['voices', clientId, 'custom'] })
    },
  })
}

export function useSyncVoiceWithUltravox() {
  const queryClient = useQueryClient()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post<Voice>(endpoints.voices.sync(id), {})
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voices', clientId, 'ultravox'] })
      queryClient.invalidateQueries({ queryKey: ['voices', clientId, 'custom'] })
    },
  })
}
