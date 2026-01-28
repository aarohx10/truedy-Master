import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useAuthReady, useClientId } from '@/lib/clerk-auth-client'

export interface PhoneNumber {
  id: string
  organization_id: string
  agent_id?: string  // Deprecated - use inbound_agent_id
  inbound_agent_id?: string
  outbound_agent_id?: string
  phone_number: string
  provider_id?: string
  status: 'active' | 'inactive' | 'pending'
  is_trudy_managed: boolean
  telephony_credential_id?: string
  created_at: string
  updated_at: string
}

export interface TelephonyCredential {
  id: string
  organization_id: string
  provider_type: 'telnyx' | 'twilio' | 'plivo' | 'custom_sip'
  friendly_name?: string
  created_at: string
  updated_at: string
}

export interface AvailableNumber {
  phone_number: string
  region_information?: {
    region_name?: string
    locality?: string
  }
  features?: string[]
  cost_information?: {
    upfront_cost?: string
    monthly_cost?: string
  }
}

export interface NumberSearchRequest {
  country_code?: string
  locality?: string
  api_key?: string
}

export interface NumberPurchaseRequest {
  phone_number: string
  api_key?: string
}

export interface NumberImportRequest {
  phone_number: string
  provider_type: 'telnyx' | 'twilio' | 'plivo' | 'custom_sip'
  friendly_name?: string
  api_key?: string
  account_sid?: string
  auth_token?: string
  sip_username?: string
  sip_password?: string
  sip_server?: string
}

export interface NumberAssignmentRequest {
  number_id: string
  agent_id: string
  assignment_type: 'inbound' | 'outbound'
}

/**
 * Hook to initialize telephony configuration
 */
export function useInitTelephony() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(endpoints.telephony.init)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telephony'] })
      toast({
        title: 'Telephony initialized',
        description: 'Telephony configuration has been initialized successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error initializing telephony',
        description: error.message || 'Failed to initialize telephony',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to search for available phone numbers
 */
export function useSearchNumbers() {
  return useMutation({
    mutationFn: async (request: NumberSearchRequest) => {
      const response = await apiClient.post<AvailableNumber[]>(endpoints.telephony.search, request)
      return response.data
    },
  })
}

/**
 * Hook to purchase a phone number
 */
export function usePurchaseNumber() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async (request: NumberPurchaseRequest) => {
      const response = await apiClient.post<PhoneNumber>(endpoints.telephony.purchase, request)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phone-numbers', clientId] })
      toast({
        title: 'Number purchased',
        description: 'Phone number has been purchased successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error purchasing number',
        description: error.message || 'Failed to purchase phone number',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to import a BYO phone number
 */
export function useImportNumber() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async (request: NumberImportRequest) => {
      const response = await apiClient.post<PhoneNumber>(endpoints.telephony.import, request)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phone-numbers', clientId] })
      queryClient.invalidateQueries({ queryKey: ['telephony-credentials', clientId] })
      toast({
        title: 'Number imported',
        description: 'Phone number has been imported successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error importing number',
        description: error.message || 'Failed to import phone number',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to list all phone numbers
 */
export function usePhoneNumbers() {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()

  return useQuery<PhoneNumber[]>({
    queryKey: ['phone-numbers', clientId],
    queryFn: async () => {
      const response = await apiClient.get<PhoneNumber[]>(endpoints.telephony.list)
      return response.data
    },
    enabled: isAuthReady && !!clientId,
  })
}

/**
 * Hook to assign a phone number to an agent
 */
export function useAssignNumber() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async (request: NumberAssignmentRequest) => {
      const response = await apiClient.post(endpoints.telephony.assign, request)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['phone-numbers', clientId] })
      queryClient.invalidateQueries({ queryKey: ['agents', clientId] })
      queryClient.invalidateQueries({ queryKey: ['agent-numbers', variables.agent_id] })
      toast({
        title: 'Number assigned',
        description: `Phone number assigned to agent for ${variables.assignment_type}.`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error assigning number',
        description: error.message || 'Failed to assign phone number',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to unassign a phone number from an agent
 */
export function useUnassignNumber() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const clientId = useClientId()

  return useMutation({
    mutationFn: async ({ number_id, assignment_type }: { number_id: string; assignment_type: 'inbound' | 'outbound' }) => {
      const response = await apiClient.post(endpoints.telephony.unassign, {
        number_id,
        assignment_type,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phone-numbers', clientId] })
      queryClient.invalidateQueries({ queryKey: ['agents', clientId] })
      toast({
        title: 'Number unassigned',
        description: 'Phone number has been unassigned successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error unassigning number',
        description: error.message || 'Failed to unassign phone number',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to get phone numbers assigned to an agent
 */
export function useGetAgentNumbers(agentId: string) {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()

  return useQuery<{ inbound: PhoneNumber[]; outbound: PhoneNumber[] }>({
    queryKey: ['agent-numbers', agentId, clientId],
    queryFn: async () => {
      const response = await apiClient.get<{ inbound: PhoneNumber[]; outbound: PhoneNumber[] }>(
        `/telephony/agents/${agentId}/numbers`
      )
      return response.data
    },
    enabled: isAuthReady && !!clientId && !!agentId,
  })
}

/**
 * Hook to get webhook URL for an agent (for BYOC setup)
 */
export function useGetAgentWebhookUrl(agentId: string) {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()

  return useQuery<{ webhook_url: string; agent_id: string; ultravox_agent_id: string }>({
    queryKey: ['agent-webhook-url', agentId, clientId],
    queryFn: async () => {
      const response = await apiClient.get<{ webhook_url: string; agent_id: string; ultravox_agent_id: string }>(
        `/telephony/agents/${agentId}/webhook-url`
      )
      return response.data
    },
    enabled: isAuthReady && !!clientId && !!agentId,
  })
}

/**
 * Hook to list telephony credentials
 */
export function useTelephonyCredentials() {
  const clientId = useClientId()
  const isAuthReady = useAuthReady()

  return useQuery<TelephonyCredential[]>({
    queryKey: ['telephony-credentials', clientId],
    queryFn: async () => {
      const response = await apiClient.get<TelephonyCredential[]>(endpoints.telephony.credentials)
      return response.data
    },
    enabled: isAuthReady && !!clientId,
  })
}
