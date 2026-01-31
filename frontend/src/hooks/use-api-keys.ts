'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { apiClient, endpoints } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useAuthReady } from '@/lib/clerk-auth-client'
import { useOrganization } from '@clerk/nextjs'
import { useAppStore } from '@/stores/app-store'

export interface ApiKey {
  id: string
  service: string
  key_name: string
  is_active: boolean
  created_at: string
  api_key?: string // Only present when newly generated (one-time display)
}

export interface CreateApiKeyData {
  key_name: string
  generate?: boolean
}

/**
 * Hook to fetch all API keys for the current organization.
 * 
 * CRITICAL: API keys are per Organization, not per User.
 */
export function useApiKeys() {
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

  return useQuery<ApiKey[]>({
    queryKey: ['api-keys', orgId], // CRITICAL: Include orgId in query key
    queryFn: async () => {
      const response = await apiClient.get<ApiKey[]>(endpoints.apiKeys.list)
      return response.data
    },
    enabled: isAuthReady && !!orgId,
  })
}

/**
 * Hook to create a new API key
 */
export function useCreateApiKey() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId

  return useMutation({
    mutationFn: async (data: CreateApiKeyData) => {
      const response = await apiClient.post<ApiKey>(endpoints.apiKeys.create, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', orgId] })
      toast({
        title: 'API Key created',
        description: `API key "${data.key_name}" has been created successfully.`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating API key',
        description: error.message || 'Failed to create API key',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to delete an API key
 */
export function useDeleteApiKey() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId

  return useMutation({
    mutationFn: async (apiKeyId: string) => {
      const response = await apiClient.delete(endpoints.apiKeys.delete(apiKeyId))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', orgId] })
      toast({
        title: 'API Key deleted',
        description: 'API key has been deleted successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting API key',
        description: error.message || 'Failed to delete API key',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to generate a random API key (convenience wrapper)
 */
export function useGenerateApiKey() {
  return useCreateApiKey()
}
