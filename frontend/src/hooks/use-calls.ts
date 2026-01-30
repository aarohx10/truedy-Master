import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { apiClient, endpoints } from '@/lib/api'
import { authManager } from '@/lib/auth-manager'
import { useClientId, useAuthReady } from '@/lib/clerk-auth-client'
import { useOrganization } from '@clerk/nextjs'
import { useAppStore } from '@/stores/app-store'

export interface Call {
  id: string
  client_id: string
  agent_id?: string
  phone_number: string
  direction: 'inbound' | 'outbound'
  status: 'queued' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'voicemail' | 'no_answer'
  context?: Record<string, any>
  call_settings?: Record<string, any>
  ultravox_call_id?: string
  started_at?: string
  ended_at?: string
  duration_seconds?: number
  cost_usd?: number
  recording_url?: string
  transcript?: any
  created_at: string
  updated_at: string
}

export interface CreateCallData {
  agent_id: string
  phone_number: string
  direction: 'inbound' | 'outbound'
  context?: Record<string, any>
  call_settings?: Record<string, any>
}

export function useCalls(params?: {
  status?: string
  direction?: string
  limit?: number
  offset?: number
}) {
  const isAuthReady = useAuthReady()
  const { organization } = useOrganization()
  const { activeOrgId, setActiveOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  // If orgId is null (personal workspace), use user_id as org_id
  const orgId = organization?.id || activeOrgId
  
  // Sync orgId to store when organization changes
  useEffect(() => {
    if (organization?.id && organization.id !== activeOrgId) {
      setActiveOrgId(organization.id)
    }
  }, [organization?.id, activeOrgId, setActiveOrgId])
  
  return useQuery({
    queryKey: ['calls', orgId, params], // CRITICAL: Include orgId in query key
    queryFn: async () => {
      // Wait for auth before fetching
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append('status', params.status)
      if (params?.direction) queryParams.append('direction', params.direction)
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.offset) queryParams.append('offset', params.offset.toString())
      
      const url = params ? `${endpoints.calls.list}?${queryParams.toString()}` : endpoints.calls.list
      const response = await apiClient.get<{ data: Call[]; pagination?: any }>(url)
      return response.data
    },
    enabled: isAuthReady && authManager.hasToken(),
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

export function useCall(callId: string, refresh?: boolean) {
  const isAuthReady = useAuthReady()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId
  
  return useQuery({
    queryKey: ['calls', orgId, callId, refresh], // CRITICAL: Include orgId in query key
    queryFn: async () => {
      // Wait for auth before fetching
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const url = refresh ? `${endpoints.calls.get(callId)}?refresh=true` : endpoints.calls.get(callId)
      const response = await apiClient.get<Call>(url)
      return response.data
    },
    enabled: !!callId && isAuthReady && authManager.hasToken(),
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('Session expired')) {
        return false
      }
      return failureCount < 2
    },
  })
}

export function useCreateCall() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId

  return useMutation({
    mutationFn: async (data: CreateCallData) => {
      // Ensure auth is ready before mutation
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.post<Call>(endpoints.calls.create, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls', orgId] })
    },
  })
}

export function useCallTranscript(callId: string) {
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['calls', orgId, callId, 'transcript'], // CRITICAL: Use orgId instead of clientId
    queryFn: async () => {
      // Wait for auth before fetching
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.get<{ transcript: any[]; summary?: string }>(endpoints.calls.transcript(callId))
      return response.data
    },
    enabled: !!callId && isAuthReady && authManager.hasToken(),
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('Session expired')) {
        return false
      }
      return failureCount < 2
    },
  })
}

export function useCallRecording(callId: string) {
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['calls', orgId, callId, 'recording'], // CRITICAL: Use orgId instead of clientId
    queryFn: async () => {
      // Wait for auth before fetching
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.get<{ recording_url: string; format: string; duration_seconds?: number }>(endpoints.calls.recording(callId))
      return response.data
    },
    enabled: !!callId && isAuthReady && authManager.hasToken(),
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('Session expired')) {
        return false
      }
      return failureCount < 2
    },
  })
}
