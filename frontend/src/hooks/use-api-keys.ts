import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useAuthReady, useClientId } from '@/lib/clerk-auth-client'

export interface ApiKey {
  id: string
  client_id: string
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
 * Hook to fetch all API keys for the current client
 */
export function useApiKeys() {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()

  return useQuery<ApiKey[]>({
    queryKey: ['api-keys', clientId],
    queryFn: async () => {
      const response = await apiClient.get<ApiKey[]>(endpoints.apiKeys.list)
      return response.data
    },
    enabled: isAuthReady && !!clientId,
  })
}

/**
 * Hook to create a new API key
 */
export function useCreateApiKey() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async (data: CreateApiKeyData) => {
      const response = await apiClient.post<ApiKey>(endpoints.apiKeys.create, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', clientId] })
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
  const clientId = useClientId()

  return useMutation({
    mutationFn: async (apiKeyId: string) => {
      const response = await apiClient.delete(endpoints.apiKeys.delete(apiKeyId))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', clientId] })
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
