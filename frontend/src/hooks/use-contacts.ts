import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
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
import { useOrganization } from '@clerk/nextjs'
import { useAppStore } from '@/stores/app-store'

// Contact Folders

export function useContactFolders() {
  const { isLoading: authLoading } = useAuthClient()
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
  
  return useQuery<ContactFolder[]>({
    queryKey: ['contact-folders', orgId], // CRITICAL: Include orgId in query key
    queryFn: async () => {
      // Step 2: Bypass Level Check - Log raw response for debugging
      const response = await apiClient.get<any>(endpoints.contacts.listFolders)
      console.log('[HOOK] RAW_FOLDER_RESPONSE:', response)
      console.log('[HOOK] response.data:', response.data)
      console.log('[HOOK] response.data?.data:', response.data?.data)
      console.log('[HOOK] response.data type:', typeof response.data)
      console.log('[HOOK] response.data isArray:', Array.isArray(response.data))
      
      // Ensure we are grabbing the correct nested 'data'
      const folderData = response.data?.data || response.data || []
      const finalData = Array.isArray(folderData) ? folderData : []
      
      console.log('[HOOK] Final folderData:', finalData)
      console.log('[HOOK] Final folderData length:', finalData.length)
      
      return finalData
    },
    // Step 2: Strict Query Enabling - Require orgId to prevent fetching before auth is ready
    enabled: !authLoading && isAuthReady && !!orgId && authManager.hasToken(),
    // Step 2: Remove Stale Cache - Kill any "empty" persistent caches
    staleTime: 0,
    gcTime: 0,
  })
}

export function useCreateContactFolder() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async (data: CreateContactFolderData) => {
      const response = await apiClient.post<{ data: ContactFolder }>(
        endpoints.contacts.createFolder,
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      // Step 2: Invalidation Logic - Use exact queryKey pattern to force immediate refresh
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['contact-folders', orgId] })
        queryClient.refetchQueries({ queryKey: ['contact-folders', orgId] })
      } else {
        // Fallback: invalidate all if orgId not available
        queryClient.invalidateQueries({ queryKey: ['contact-folders'] })
      }
    },
  })
}

// Contacts

export function useContacts(folderId?: string, page: number = 1, limit: number = 50) {
  const { isLoading: authLoading } = useAuthClient()
  const isAuthReady = useAuthReady()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId
  
  return useQuery<{ contacts: Contact[]; pagination: { total: number; pages: number; page: number; limit: number } }>({
    queryKey: ['contacts', orgId, folderId, page, limit], // CRITICAL: Include orgId in query key
    queryFn: async () => {
      if (!folderId) return { contacts: [], pagination: { total: 0, pages: 0, page: 1, limit } }
      
      // Construct URL with pagination params
      const baseUrl = endpoints.contacts.listContacts(folderId)
      const separator = baseUrl.includes('?') ? '&' : '?'
      const url = `${baseUrl}${separator}page=${page}&limit=${limit}`
      
      // Backend returns: { data: Contact[], meta: {...}, pagination: {...} }
      const response = await apiClient.get<Contact[]>(url) as any
      
      // Extract contacts - response.data should be Contact[] array
      let contacts: Contact[] = []
      let pagination: { total: number; pages: number; page: number; limit: number } = {
        total: 0,
        pages: 0,
        page: 1,
        limit
      }
      
      if (Array.isArray(response.data)) {
        contacts = response.data
        pagination = response.pagination || {
          total: contacts.length,
          pages: 1,
          page: 1,
          limit
        }
      } else {
        console.error('[HOOK] [CONTACTS] Unexpected response.data type:', typeof response.data, response)
      }
      
      return { contacts, pagination }
    },
    enabled: !authLoading && isAuthReady && authManager.hasToken() && !!folderId,
    staleTime: 1000 * 60, // Cache for 1 minute
    gcTime: 1000 * 60 * 5,
  })
}

export function useCreateContact() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async (data: CreateContactData) => {
      const response = await apiClient.post<{ data: Contact }>(
        endpoints.contacts.addContact,
        data
      )
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts', orgId, variables.folder_id] })
      queryClient.invalidateQueries({ queryKey: ['contact-folders', orgId] })
    },
  })
}

export function useUpdateContact() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateContactData }) => {
      const response = await apiClient.put<{ data: Contact }>(
        endpoints.contacts.updateContact(id),
        data
      )
      return response.data.data
    },
    onSuccess: (updatedContact) => {
      queryClient.invalidateQueries({ queryKey: ['contacts', orgId, updatedContact.folder_id] })
      queryClient.invalidateQueries({ queryKey: ['contact-folders', orgId] })
    },
  })
}

export function useDeleteContact() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async ({ id, folderId }: { id: string; folderId?: string }) => {
      await apiClient.delete(endpoints.contacts.deleteContact(id))
      return { id, folderId }
    },
    onSuccess: (_, variables) => {
      if (variables.folderId) {
        // Invalidate all pages for this folder
        queryClient.invalidateQueries({ queryKey: ['contacts', orgId, variables.folderId] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['contacts', orgId] })
      }
      queryClient.invalidateQueries({ queryKey: ['contact-folders', orgId] })
    },
  })
}

// Import/Export

export function useImportContacts() {
  const queryClient = useQueryClient()
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  
  return useMutation({
    mutationFn: async (data: ContactImportRequest) => {
      const response = await apiClient.post<{ data: ContactImportResponse }>(
        endpoints.contacts.import,
        data
      )
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts', orgId, variables.folder_id] })
      queryClient.invalidateQueries({ queryKey: ['contact-folders', orgId] })
    },
  })
}

export function useExportContacts() {
  const { organization } = useOrganization()
  const { activeOrgId } = useAppStore()
  const orgId = organization?.id || activeOrgId
  
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
          // REMOVED: x-client-id header - no longer needed (backend uses org_id from JWT)
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to export contacts')
      }
      
      return await response.blob()
    },
  })
}
