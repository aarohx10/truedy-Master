import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { Voice } from '@/types'
import { useAuthClient, useClientId } from '@/lib/clerk-auth-client'
import React from 'react'

export function useVoices(source?: 'ultravox' | 'custom') {
  // Use full auth hook to ensure token AND clientId are both set
  const { clientId, isLoading: authLoading } = useAuthClient()
  const queryClient = useQueryClient()
  
  // Check if API client has token set (additional safety check)
  const hasToken = apiClient.getClientId() !== null
  
  const query = useQuery({
    queryKey: ['voices', clientId, source],
    queryFn: async () => {
      // Additional safety: verify clientId is set in apiClient before making request
      if (!apiClient.getClientId()) {
        throw new Error('API client not initialized with clientId')
      }
      const url = source ? `${endpoints.voices.list}?source=${source}` : endpoints.voices.list
      const response = await apiClient.get<Voice[]>(url)
      return response.data
    },
    // Only fetch when auth is complete (not loading) AND clientId is available
    enabled: !authLoading && !!clientId && hasToken,
    staleTime: 0, // Always consider data stale to force refetch
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    refetchOnWindowFocus: true, // Refetch on window focus
    refetchOnMount: true, // Always refetch on mount to ensure we get latest data
    refetchOnReconnect: true, // Refetch on reconnect
    retry: 2, // Retry twice on failure (in case of token race condition)
    retryDelay: 500, // Wait 500ms before retry
  })
  
  // Force refetch when clientId becomes available and auth is complete
  React.useEffect(() => {
    if (!authLoading && clientId && hasToken && !query.isFetching && !query.isLoading) {
      queryClient.refetchQueries({ queryKey: ['voices', clientId, source] })
    }
  }, [clientId, authLoading, hasToken, queryClient, query.isFetching, query.isLoading, source])
  
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
  
  return useQuery({
    queryKey: ['voices', clientId, id],
    queryFn: async () => {
      const response = await apiClient.get<Voice>(endpoints.voices.get(id))
      return response.data
    },
    enabled: !!id && !!clientId,
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
      // Optimistically update the cache for custom voices (My Voices tab)
      queryClient.setQueryData<Voice[]>(['voices', clientId, 'custom'], (oldVoices = []) => {
        // Check if voice already exists (prevent duplicates)
        const exists = oldVoices.some(voice => voice.id === newVoice.id)
        if (exists) {
          return oldVoices.map(voice => voice.id === newVoice.id ? newVoice : voice)
        }
        return [newVoice, ...oldVoices]
      })
      // Refetch to ensure we have the latest data
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
      // Optimistically remove from cache for custom voices (My Voices tab)
      queryClient.setQueryData<Voice[]>(['voices', clientId, 'custom'], (oldVoices = []) => {
        return oldVoices.filter(voice => voice.id !== deletedId)
      })
      // Refetch to ensure consistency
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
      // Invalidate both explore and custom voices caches
      queryClient.invalidateQueries({ queryKey: ['voices', clientId, 'ultravox'] })
      queryClient.invalidateQueries({ queryKey: ['voices', clientId, 'custom'] })
    },
  })
}

