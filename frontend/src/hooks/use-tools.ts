import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { useOrganization } from '@clerk/nextjs'
import { useAppStore } from '@/stores/app-store'

// Tool type matching backend schema
export interface Tool {
  id: string
  client_id: string
  ultravox_tool_id?: string
  name: string
  description?: string
  category?: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  authentication?: any
  parameters?: any[]
  response_schema?: any
  status: 'creating' | 'active' | 'failed'
  is_verified?: boolean
  last_test_error?: string
  created_at: string
  updated_at: string
}

export interface CreateToolData {
  name: string
  definition: {
    modelToolName: string
    description: string
    dynamicParameters?: Array<{
      name: string
      location: string
      schema: any
      required: boolean
    }>
    http: {
      baseUrlPattern: string
      httpMethod: string
    }
    requirements?: any
  }
}

export interface UpdateToolData {
  name?: string
  definition?: {
    modelToolName?: string
    description?: string
    dynamicParameters?: Array<{
      name: string
      location: string
      schema: any
      required: boolean
    }>
    http?: {
      baseUrlPattern?: string
      httpMethod?: string
    }
    requirements?: any
  }
}

// Fetch all tools
export function useTools() {
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId
  
  return useQuery<Tool[]>({
    queryKey: ['tools', orgId], // CRITICAL: Include orgId in query key
    queryFn: async () => {
      const response = await apiClient.get<Tool[]>(endpoints.tools.list)
      // Backend returns { data: Tool[], meta: {...} }
      // apiClient.get returns BackendResponse<T>, so response.data is Tool[]
      const data = response.data
      return Array.isArray(data) ? data : []
    },
  })
}

// Fetch single tool
export function useTool(id: string) {
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId
  
  return useQuery<Tool>({
    queryKey: ['tools', orgId, id], // CRITICAL: Include orgId in query key
    queryFn: async () => {
      const response = await apiClient.get<Tool>(endpoints.tools.get(id))
      // Backend returns { data: Tool, meta: {...} }
      return response.data
    },
    enabled: !!id,
  })
}

// Create tool mutation
export function useCreateTool() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async (data: CreateToolData) => {
      const response = await apiClient.post<Tool>(
        endpoints.tools.create,
        data
      )
      // Backend returns { data: Tool, meta: {...} }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools', orgId] })
    },
  })
}

// Update tool mutation
export function useUpdateTool() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateToolData }) => {
      const response = await apiClient.put<Tool>(
        endpoints.tools.update(id),
        data
      )
      // Backend returns { data: Tool, meta: {...} }
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tools', orgId] })
      queryClient.invalidateQueries({ queryKey: ['tools', orgId, variables.id] })
    },
  })
}

// Delete tool mutation
export function useDeleteTool() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(endpoints.tools.delete(id))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools', orgId] })
    },
  })
}
