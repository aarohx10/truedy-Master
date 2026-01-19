import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { Voice } from '@/types'
import { useAuthClient, useClientId } from '@/lib/clerk-auth-client'
import React from 'react'

export function useVoices(source?: 'ultravox' | 'custom') {
  // Use full auth hook - hasToken indicates apiClient.setToken() has been called
  const { clientId, isLoading: authLoading, hasToken } = useAuthClient()
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['voices', clientId, source],
    queryFn: async () => {
      const url = source ? `${endpoints.voices.list}?source=${source}` : endpoints.voices.list
      const response = await apiClient.get<Voice[]>(url)
      return response.data
    },
    // Wait for auth complete AND token to be set on apiClient
    // hasToken is set to true right after apiClient.setToken() is called
    enabled: !authLoading && hasToken,
    staleTime: 0, // Always consider data stale to force refetch
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    refetchOnWindowFocus: true, // Refetch on window focus
    refetchOnMount: true, // Always refetch on mount to ensure we get latest data
    refetchOnReconnect: true, // Refetch on reconnect
    retry: 2, // Retry twice on failure (in case of token race condition)
    retryDelay: 500, // Wait 500ms before retry
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

