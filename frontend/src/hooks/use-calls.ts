import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { authManager } from '@/lib/auth-manager'
import { useClientId, useAuthReady } from '@/lib/clerk-auth-client'

export interface Call {
  id: string
  client_id: string
  agent_id: string
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
  agent_id?: string
  status?: string
  direction?: string
  limit?: number
  offset?: number
}) {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['calls', clientId, params],
    queryFn: async () => {
      // Wait for auth before fetching
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const queryParams = new URLSearchParams()
      if (params?.agent_id) queryParams.append('agent_id', params.agent_id)
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
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['calls', clientId, callId, refresh],
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
  const clientId = useClientId()

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
      queryClient.invalidateQueries({ queryKey: ['calls', clientId] })
    },
  })
}

export function useCallTranscript(callId: string) {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['calls', clientId, callId, 'transcript'],
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
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['calls', clientId, callId, 'recording'],
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
