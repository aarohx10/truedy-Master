'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { apiClient, endpoints } from '@/lib/api'
import { authManager } from '@/lib/auth-manager'
import { Voice } from '@/types'
import { useAuthClient, useAuthReady } from '@/lib/clerk-auth-client'
import { useOrganization } from '@clerk/nextjs'
import { useAppStore } from '@/stores/app-store'

/**
 * Simplified hook for fetching voices from the API
 * Direct data fetching from Supabase backend only
 * 
 * CRITICAL: Shows system_voices + organization_voices (all voices available to the team)
 */
export function useVoices(source?: 'ultravox' | 'custom') {
  const { isLoading: authLoading } = useAuthClient()
  const isAuthReady = useAuthReady()
  const { organization } = useOrganization()
  const { activeOrgId, setActiveOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId
  
  // Sync orgId to store when organization changes
  useEffect(() => {
    if (organization?.id && organization.id !== activeOrgId) {
      setActiveOrgId(organization.id)
    }
  }, [organization?.id, activeOrgId, setActiveOrgId])
  
  return useQuery({
    queryKey: ['voices', orgId, source], // CRITICAL: Include orgId in query key
    queryFn: async () => {
      const url = source ? `${endpoints.voices.list}?source=${source}` : endpoints.voices.list
      
      console.log('[USE_VOICES] Fetching voices', {
        orgId,
        source,
        url,
        isAuthReady,
        authLoading,
      })
      
      try {
        const response = await apiClient.get<Voice[]>(url)
        
        console.log('[USE_VOICES] Voices fetched successfully (RAW RESPONSE)', {
          orgId,
          source,
          url,
          response,
          responseData: response.data,
          voiceCount: response.data?.length || 0,
          fullResponse: JSON.stringify(response, null, 2),
        })
        
        return response.data
      } catch (error) {
        const rawError = error instanceof Error ? error : new Error(String(error))
        console.error('[USE_VOICES] Failed to fetch voices (RAW ERROR)', {
          orgId,
          source,
          url,
          error: rawError,
          errorMessage: rawError.message,
          errorStack: rawError.stack,
          errorName: rawError.name,
          fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
        })
        throw rawError
      }
    },
    enabled: !authLoading && isAuthReady && authManager.hasToken(),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    refetchInterval: (query) => {
      // Auto-refetch if any voice is training (or legacy statuses for backward compatibility)
      const hasTrainingVoice = query.data?.some(v => 
        v.status === 'training' || 
        v.status === 'processing' || 
        v.status === 'creating'
      )
      return hasTrainingVoice ? 3000 : false
    },
  })
}

export function useExploreVoices() {
  return useVoices('ultravox')
}

export function useMyVoices() {
  return useVoices('custom')
}

export function useVoice(id: string) {
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  const isAuthReady = useAuthReady()
  const { isLoading: authLoading } = useAuthClient()
  
  return useQuery({
    queryKey: ['voices', orgId, id], // CRITICAL: Use orgId instead of clientId
    queryFn: async () => {
      const response = await apiClient.get<Voice>(endpoints.voices.get(id))
      return response.data
    },
    enabled: !!id && !authLoading && isAuthReady && authManager.hasToken(),
  })
}

export function useCreateVoice() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId

  return useMutation({
    mutationFn: async (data: {
      name: string
      strategy: 'external' | 'auto'
      source: {
        type: 'external'
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
      console.log('[USE_CREATE_VOICE] Starting voice creation', {
        orgId,
        data,
        fullData: JSON.stringify(data, null, 2),
        endpoint: endpoints.voices.create,
      })
      
      try {
        const response = await apiClient.post<Voice>(endpoints.voices.create, data)
        
        console.log('[USE_CREATE_VOICE] Voice creation successful (RAW RESPONSE)', {
          orgId,
          response,
          responseData: response.data,
          fullResponse: JSON.stringify(response, null, 2),
        })
        
        return response.data
      } catch (error) {
        const rawError = error instanceof Error ? error : new Error(String(error))
        console.error('[USE_CREATE_VOICE] Voice creation failed (RAW ERROR)', {
          orgId,
          data,
          error: rawError,
          errorMessage: rawError.message,
          errorStack: rawError.stack,
          errorName: rawError.name,
          fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
        })
        throw rawError
      }
    },
    onSuccess: (newVoice) => {
      queryClient.setQueryData<Voice[]>(['voices', orgId, 'custom'], (oldVoices = []) => {
        const exists = oldVoices.some(voice => voice.id === newVoice.id)
        if (exists) {
          return oldVoices.map(voice => voice.id === newVoice.id ? newVoice : voice)
        }
        return [newVoice, ...oldVoices]
      })
      queryClient.refetchQueries({ queryKey: ['voices', orgId, 'custom'] })
    },
  })
}

export function useDeleteVoice() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(endpoints.voices.delete(id))
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Voice[]>(['voices', orgId, 'custom'], (oldVoices = []) => {
        return oldVoices.filter(voice => voice.id !== deletedId)
      })
      queryClient.refetchQueries({ queryKey: ['voices', orgId, 'custom'] })
    },
  })
}

export function useSyncVoiceWithUltravox() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post<Voice>(endpoints.voices.sync(id), {})
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voices', orgId, 'ultravox'] })
      queryClient.invalidateQueries({ queryKey: ['voices', orgId, 'custom'] })
    },
  })
}
