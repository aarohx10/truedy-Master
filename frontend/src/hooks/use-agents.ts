import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { useAuthClient, useClientId, useAuthReady } from '@/lib/clerk-auth-client'

// Fetch all agents
export function useAgents() {
  const { clientId, isLoading: authLoading } = useAuthClient()
  const isAuthReady = useAuthReady()
  
  return useQuery<Agent[]>({
    queryKey: ['agents', clientId],
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
  const { clientId, isLoading: authLoading } = useAuthClient()
  const isAuthReady = useAuthReady()
  
  return useQuery<Agent>({
    queryKey: ['agents', clientId, id],
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
  const clientId = useClientId()
  
  return useMutation({
    mutationFn: async (data: CreateAgentData) => {
      const response = await apiClient.post<Agent>(
        endpoints.agents.create,
        data
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', clientId] })
    },
  })
}

// Create draft agent mutation
export function useCreateDraftAgent() {
  const queryClient = useQueryClient()
  const clientId = useClientId()
  
  return useMutation({
    mutationFn: async (templateId?: string) => {
      const response = await apiClient.post<Agent>(
        endpoints.agents.createDraft,
        { template_id: templateId }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', clientId] })
    },
  })
}

// Update agent mutation
export function useUpdateAgent() {
  const queryClient = useQueryClient()
  const clientId = useClientId()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAgentData }) => {
      const response = await apiClient.put<Agent>(
        endpoints.agents.update(id),
        data
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agents', clientId] })
      queryClient.invalidateQueries({ queryKey: ['agents', clientId, variables.id] })
    },
  })
}

// Partial update agent mutation (for auto-save)
export function usePartialUpdateAgent() {
  const queryClient = useQueryClient()
  const clientId = useClientId()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAgentData }) => {
      const response = await apiClient.patch<Agent>(
        endpoints.agents.update(id),
        data
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agents', clientId] })
      queryClient.invalidateQueries({ queryKey: ['agents', clientId, variables.id] })
    },
  })
}

// Delete agent mutation
export function useDeleteAgent() {
  const queryClient = useQueryClient()
  const clientId = useClientId()
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(endpoints.agents.delete(id))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', clientId] })
    },
  })
}

// Sync agent with Ultravox mutation
export function useSyncAgent() {
  const queryClient = useQueryClient()
  const clientId = useClientId()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.get<{ agent_id: string; ultravox_agent_id?: string; synced: boolean }>(
        endpoints.agents.sync(id)
      )
      return response.data
    },
    onSuccess: (_, agentId) => {
      queryClient.invalidateQueries({ queryKey: ['agents', clientId] })
      queryClient.invalidateQueries({ queryKey: ['agents', clientId, agentId] })
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
