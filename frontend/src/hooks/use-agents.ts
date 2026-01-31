'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { apiClient, endpoints } from '@/lib/api'
import { authManager } from '@/lib/auth-manager'
import { 
  Agent, 
  AgentTemplate, 
  CreateAgentData, 
  UpdateAgentData,
  AgentTestCallResponse,
  AgentAIAssistRequest,
  AgentAIAssistResponse,
} from '@/types'
import { useAuthClient, useAuthReady } from '@/lib/clerk-auth-client'
import { useOrganization } from '@clerk/nextjs'
import { useAppStore } from '@/stores/app-store'

// Fetch all agents
export function useAgents() {
  const { isLoading: authLoading } = useAuthClient()
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
  
  return useQuery<Agent[]>({
    queryKey: ['agents', orgId], // CRITICAL: Include orgId in query key
    queryFn: async () => {
      const response = await apiClient.get<Agent[]>(endpoints.agents.list)
      const data = response.data
      return Array.isArray(data) ? data : []
    },
    enabled: !authLoading && isAuthReady && authManager.hasToken(),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  })
}

// Fetch single agent
export function useAgent(id: string) {
  const { isLoading: authLoading } = useAuthClient()
  const isAuthReady = useAuthReady()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId
  
  return useQuery<Agent>({
    queryKey: ['agents', orgId, id], // CRITICAL: Include orgId in query key
    queryFn: async () => {
      const response = await apiClient.get<Agent>(endpoints.agents.get(id))
      return response.data
    },
    enabled: !!id && !authLoading && isAuthReady && authManager.hasToken(),
  })
}

// Create agent mutation
export function useCreateAgent() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async (data: CreateAgentData) => {
      const response = await apiClient.post<Agent>(
        endpoints.agents.create,
        data
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', orgId] })
    },
  })
}

// Create draft agent mutation
export function useCreateDraftAgent() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async (templateId?: string) => {
      const response = await apiClient.post<Agent>(
        endpoints.agents.createDraft,
        { template_id: templateId }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', orgId] })
    },
  })
}

// Update agent mutation
export function useUpdateAgent() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAgentData }) => {
      const response = await apiClient.put<Agent>(
        endpoints.agents.update(id),
        data
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agents', orgId] })
      queryClient.invalidateQueries({ queryKey: ['agents', orgId, variables.id] })
    },
  })
}

// Partial update agent mutation (for auto-save)
export function usePartialUpdateAgent() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAgentData }) => {
      const response = await apiClient.patch<Agent>(
        endpoints.agents.update(id),
        data
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agents', orgId] })
      queryClient.invalidateQueries({ queryKey: ['agents', orgId, variables.id] })
    },
  })
}

// Delete agent mutation
export function useDeleteAgent() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(endpoints.agents.delete(id))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', orgId] })
    },
  })
}

// Sync agent with Ultravox mutation
export function useSyncAgent() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.get<{ agent_id: string; ultravox_agent_id?: string; synced: boolean }>(
        endpoints.agents.sync(id)
      )
      return response.data
    },
    onSuccess: (_, agentId) => {
      queryClient.invalidateQueries({ queryKey: ['agents', orgId] })
      queryClient.invalidateQueries({ queryKey: ['agents', orgId, agentId] })
    },
  })
}

// Create test call mutation
export function useTestAgentCall() {
  return useMutation({
    mutationFn: async (agentId: string) => {
      const response = await apiClient.post<AgentTestCallResponse>(
        endpoints.agents.testCall(agentId),
        {}
      )
      return response.data
    },
  })
}

// Fetch agent templates
export function useAgentTemplates() {
  const { isLoading: authLoading } = useAuthClient()
  const isAuthReady = useAuthReady()
  
  return useQuery<AgentTemplate[]>({
    queryKey: ['agent-templates'],
    queryFn: async () => {
      const response = await apiClient.get<AgentTemplate[]>(endpoints.agentTemplates.list)
      const data = response.data
      return Array.isArray(data) ? data : []
    },
    enabled: !authLoading && isAuthReady && authManager.hasToken(),
    staleTime: 1000 * 60 * 10, // Templates don't change often
    gcTime: 1000 * 60 * 30,
  })
}

// Fetch single agent template
export function useAgentTemplate(id: string) {
  const { isLoading: authLoading } = useAuthClient()
  const isAuthReady = useAuthReady()
  
  return useQuery<AgentTemplate>({
    queryKey: ['agent-templates', id],
    queryFn: async () => {
      const response = await apiClient.get<AgentTemplate>(endpoints.agentTemplates.get(id))
      return response.data
    },
    enabled: !!id && !authLoading && isAuthReady && authManager.hasToken(),
  })
}

// AI assistance mutation
export function useAIAssist() {
  return useMutation({
    mutationFn: async (data: AgentAIAssistRequest) => {
      const response = await apiClient.post<AgentAIAssistResponse>(
        endpoints.agents.aiAssist,
        data
      )
      return response.data
    },
  })
}
