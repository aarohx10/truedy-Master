'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { apiClient, endpoints } from '@/lib/api'
import { authManager } from '@/lib/auth-manager'
import {
  Campaign,
  CreateCampaignData,
  UpdateCampaignData,
  CampaignStats,
} from '@/types'
import { useAuthReady } from '@/lib/clerk-auth-client'
import { useOrganization } from '@clerk/nextjs'
import { useAppStore } from '@/stores/app-store'

export function useCampaigns() {
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
    queryKey: ['campaigns', orgId], // CRITICAL: Include orgId in query key
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
  const isAuthReady = useAuthReady()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId
  
  return useQuery({
    queryKey: ['campaigns', orgId, id], // CRITICAL: Include orgId in query key
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
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId

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
      queryClient.invalidateQueries({ queryKey: ['campaigns', orgId] })
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId

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
      queryClient.invalidateQueries({ queryKey: ['campaigns', orgId] })
      queryClient.invalidateQueries({ queryKey: ['campaigns', orgId, data.id] })
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId

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
      queryClient.invalidateQueries({ queryKey: ['campaigns', orgId] })
    },
  })
}
