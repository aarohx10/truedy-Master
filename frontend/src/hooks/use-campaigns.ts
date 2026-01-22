import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { authManager } from '@/lib/auth-manager'
import {
  Campaign,
  CreateCampaignData,
  UpdateCampaignData,
  CampaignStats,
} from '@/types'
import { useClientId, useAuthReady } from '@/lib/clerk-auth-client'

export function useCampaigns() {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['campaigns', clientId],
    queryFn: async () => {
      // Wait for auth before fetching
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.get<Campaign[]>(
        endpoints.campaigns.list
      )
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

export function useCampaign(id: string) {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  
  return useQuery({
    queryKey: ['campaigns', clientId, id],
    queryFn: async () => {
      // Wait for auth before fetching
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.get<Campaign>(
        endpoints.campaigns.get(id)
      )
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

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async (data: CreateCampaignData) => {
      // Ensure auth is ready before mutation
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.post<Campaign>(
        endpoints.campaigns.create,
        data
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', clientId] })
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCampaignData }) => {
      // Ensure auth is ready before mutation
      if (!authManager.hasToken()) {
        await authManager.waitForAuth(5000)
        if (!authManager.hasToken()) {
          throw new Error('Not authenticated')
        }
      }
      
      const response = await apiClient.patch<Campaign>(
        endpoints.campaigns.update(id),
        data
      )
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', clientId] })
      queryClient.invalidateQueries({ queryKey: ['campaigns', clientId, data.id] })
    },
  })
}

export function useDeleteCampaign() {
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
      
      await apiClient.delete(endpoints.campaigns.delete(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', clientId] })
    },
  })
}
