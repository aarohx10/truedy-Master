import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints, API_URL } from '@/lib/api'
import { authManager } from '@/lib/auth-manager'
import {
  ContactFolder,
  Contact,
  CreateContactFolderData,
  CreateContactData,
  UpdateContactData,
  ContactImportRequest,
  ContactImportResponse,
} from '@/types'
import { useAuthClient, useClientId, useAuthReady } from '@/lib/clerk-auth-client'

// Contact Folders

export function useContactFolders() {
  const { clientId, isLoading: authLoading } = useAuthClient()
  const isAuthReady = useAuthReady()
  
  return useQuery<ContactFolder[]>({
    queryKey: ['contact-folders', clientId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: ContactFolder[] }>(endpoints.contacts.listFolders)
      return response.data.data || []
    },
    enabled: !authLoading && isAuthReady && authManager.hasToken(),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  })
}

export function useCreateContactFolder() {
  const queryClient = useQueryClient()
  const { clientId } = useAuthClient()
  
  return useMutation({
    mutationFn: async (data: CreateContactFolderData) => {
      const response = await apiClient.post<{ data: ContactFolder }>(
        endpoints.contacts.createFolder,
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      // Invalidate and refetch all contact-folders queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['contact-folders'] })
      queryClient.refetchQueries({ queryKey: ['contact-folders', clientId] })
    },
  })
}

// Contacts

export function useContacts(folderId?: string) {
  const { clientId, isLoading: authLoading } = useAuthClient()
  const isAuthReady = useAuthReady()
  
  return useQuery<Contact[]>({
    queryKey: ['contacts', clientId, folderId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Contact[] }>(
        endpoints.contacts.listContacts(folderId)
      )
      return response.data.data || []
    },
    enabled: !authLoading && isAuthReady && authManager.hasToken(),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  })
}

export function useCreateContact() {
  const queryClient = useQueryClient()
  const { clientId } = useAuthClient()
  
  return useMutation({
    mutationFn: async (data: CreateContactData) => {
      const response = await apiClient.post<{ data: Contact }>(
        endpoints.contacts.addContact,
        data
      )
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts', clientId, variables.folder_id] })
      queryClient.invalidateQueries({ queryKey: ['contact-folders', clientId] })
    },
  })
}

export function useUpdateContact() {
  const queryClient = useQueryClient()
  const { clientId } = useAuthClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateContactData }) => {
      const response = await apiClient.put<{ data: Contact }>(
        endpoints.contacts.updateContact(id),
        data
      )
      return response.data.data
    },
    onSuccess: (updatedContact) => {
      queryClient.invalidateQueries({ queryKey: ['contacts', clientId, updatedContact.folder_id] })
      queryClient.invalidateQueries({ queryKey: ['contact-folders', clientId] })
    },
  })
}

export function useDeleteContact() {
  const queryClient = useQueryClient()
  const { clientId } = useAuthClient()
  
  return useMutation({
    mutationFn: async ({ id, folderId }: { id: string; folderId?: string }) => {
      await apiClient.delete(endpoints.contacts.deleteContact(id))
      return { id, folderId }
    },
    onSuccess: (_, variables) => {
      if (variables.folderId) {
        queryClient.invalidateQueries({ queryKey: ['contacts', clientId, variables.folderId] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['contacts', clientId] })
      }
      queryClient.invalidateQueries({ queryKey: ['contact-folders', clientId] })
    },
  })
}

// Import/Export

export function useImportContacts() {
  const queryClient = useQueryClient()
  const { clientId } = useAuthClient()
  
  return useMutation({
    mutationFn: async (data: ContactImportRequest) => {
      const response = await apiClient.post<{ data: ContactImportResponse }>(
        endpoints.contacts.import,
        data
      )
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts', clientId, variables.folder_id] })
      queryClient.invalidateQueries({ queryKey: ['contact-folders', clientId] })
    },
  })
}

export function useExportContacts() {
  const { clientId } = useAuthClient()
  
  return useMutation({
    mutationFn: async (folderId?: string) => {
      const url = endpoints.contacts.export(folderId)
      // Use fetch directly for blob response
      const token = authManager.getToken()
      
      if (!token) {
        throw new Error('Not authenticated')
      }
      
      const response = await fetch(`${API_URL}${url}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-client-id': clientId || '',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to export contacts')
      }
      
      return await response.blob()
    },
  })
}
