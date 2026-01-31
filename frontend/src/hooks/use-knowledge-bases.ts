'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { KnowledgeBase, CreateKnowledgeBaseData, UpdateKnowledgeBaseData } from '@/types'
import { debugLogger } from '@/lib/debug-logger'
import { useAuthClient, useAuthReady } from '@/lib/clerk-auth-client'

// Fetch all knowledge bases
export function useKnowledgeBases() {
  const { orgId } = useAuthClient()
  const isAuthReady = useAuthReady()
  
  return useQuery<KnowledgeBase[]>({
    queryKey: ['knowledge-bases', orgId], // CRITICAL: Include orgId in query key
    queryFn: async () => {
      try {
        debugLogger.logStep('KB_LIST', 'Fetching knowledge bases list', {
          endpoint: endpoints.knowledge.list,
        })
        
        const response = await apiClient.get<KnowledgeBase[]>(endpoints.knowledge.list)
        // Backend returns { data: KnowledgeBase[], meta: {...} }
        // apiClient.get returns BackendResponse<T> where T is the data type
        // So response.data is already KnowledgeBase[]
        const data = response.data
        
        debugLogger.logStep('KB_LIST', 'Knowledge bases fetched successfully', {
          count: Array.isArray(data) ? data.length : 0,
          endpoint: endpoints.knowledge.list,
        })
        
        return Array.isArray(data) ? data : []
      } catch (error) {
        debugLogger.logError('KB_LIST', error, {
          endpoint: endpoints.knowledge.list,
        })
        console.error('[useKnowledgeBases] Error fetching knowledge bases:', error)
        throw error
      }
    },
    enabled: isAuthReady && !!orgId,
  })
}

// Fetch single knowledge base
export function useKnowledgeBase(id: string) {
  const { orgId } = useAuthClient()
  const isAuthReady = useAuthReady()
  
  return useQuery<KnowledgeBase>({
    queryKey: ['knowledge-bases', orgId, id], // CRITICAL: Include orgId in query key
    queryFn: async () => {
      debugLogger.logStep('KB_GET', 'Fetching knowledge base', {
        kbId: id,
        endpoint: endpoints.knowledge.get(id),
      })
      
      const response = await apiClient.get<KnowledgeBase>(endpoints.knowledge.get(id))
      // Backend returns { data: KnowledgeBase, meta: {...} }
      // apiClient.get returns BackendResponse<T>, so response.data is KnowledgeBase
      
      debugLogger.logStep('KB_GET', 'Knowledge base fetched successfully', {
        kbId: id,
        kbName: response.data?.name,
        kbStatus: response.data?.status,
      })
      
      return response.data
    },
    enabled: isAuthReady && !!orgId && !!id,
  })
}

// Create knowledge base mutation
export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient()
  const { orgId } = useAuthClient()
  
  return useMutation({
    mutationFn: async (data: CreateKnowledgeBaseData) => {
      // =================================================================
      // DEBUG LOGGING: Track knowledge base creation attempt
      // =================================================================
      debugLogger.logStep('KB_CREATE', 'Starting knowledge base creation', {
        name: data.name,
        description: data.description,
        fileName: data.file.name,
        fileType: data.file.type,
        fileSize: data.file.size,
        endpoint: endpoints.knowledge.create,
      })
      
      // Convert file to base64 (same pattern as voice cloning)
      const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            // Remove data URL prefix (e.g., "data:application/pdf;base64,")
            const base64 = result.split(',')[1] || result
            resolve(base64)
          }
          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.readAsDataURL(file)
        })
      }
      
      // Convert File to base64
      debugLogger.logStep('KB_CREATE', 'Converting file to base64', {
        fileName: data.file.name,
        fileSize: data.file.size,
      })
      
      const base64Data = await convertFileToBase64(data.file)
      
      debugLogger.logStep('KB_CREATE', 'File converted to base64', {
        fileName: data.file.name,
        base64Length: base64Data.length,
      })
      
      // Build JSON payload (same pattern as voice cloning)
      const payload = {
        name: data.name,
        description: data.description,
        file: {
          filename: data.file.name,
          data: base64Data,
          content_type: data.file.type || 'application/octet-stream',
        },
      }
      
      debugLogger.logStep('KB_CREATE', 'Sending POST request to create knowledge base', {
        endpoint: endpoints.knowledge.create,
        payloadName: payload.name,
        payloadDescription: payload.description,
        payloadFileName: payload.file.filename,
        payloadContentType: payload.file.content_type,
        payloadDataLength: payload.file.data.length,
      })
      
      try {
        const response = await apiClient.post<KnowledgeBase>(
          endpoints.knowledge.create,
          payload
        )
        // Backend returns { data: KnowledgeBase, meta: {...} }
        // apiClient.post returns BackendResponse<T>, so response.data is KnowledgeBase
        
        debugLogger.logStep('KB_CREATE', 'Knowledge base created successfully', {
          kbId: response.data?.id,
          kbName: response.data?.name,
          kbStatus: response.data?.status,
          kbOrgId: response.data?.clerk_org_id,
          endpoint: endpoints.knowledge.create,
        })
        
        return response.data
      } catch (error) {
        // Enhanced error logging
        const errorMessage = error instanceof Error ? error.message : String(error)
        const errorDetails = error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : { error }
        
        debugLogger.logError('KB_CREATE', error, {
          endpoint: endpoints.knowledge.create,
          payloadName: payload.name,
          payloadFileName: payload.file.filename,
          errorMessage,
          errorDetails: JSON.stringify(errorDetails, null, 2),
        })
        
        console.error('[KB_CREATE] [DEBUG] Knowledge base creation failed', {
          endpoint: endpoints.knowledge.create,
          payload: {
            name: payload.name,
            description: payload.description,
            fileName: payload.file.filename,
            contentType: payload.file.content_type,
            dataLength: payload.file.data.length,
          },
          error: errorDetails,
        })
        
        throw error
      }
    },
    onSuccess: (data) => {
      debugLogger.logStep('KB_CREATE', 'Invalidating knowledge bases cache after successful creation', {
        createdKbId: data?.id,
        createdKbName: data?.name,
      })
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases', orgId] })
    },
    onError: (error) => {
      debugLogger.logError('KB_CREATE', error, {
        step: 'mutation_onError',
        message: 'Knowledge base creation mutation failed',
      })
    },
  })
}

// Update knowledge base mutation
export function useUpdateKnowledgeBase() {
  const queryClient = useQueryClient()
  const { orgId } = useAuthClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateKnowledgeBaseData }) => {
      debugLogger.logStep('KB_UPDATE', 'Updating knowledge base', {
        kbId: id,
        endpoint: endpoints.knowledge.update(id),
        updateFields: Object.keys(data),
      })
      
      const response = await apiClient.put<KnowledgeBase>(
        endpoints.knowledge.update(id),
        data
      )
      // Backend returns { data: KnowledgeBase, meta: {...} }
      // apiClient.put returns BackendResponse<T>, so response.data is KnowledgeBase
      
      debugLogger.logStep('KB_UPDATE', 'Knowledge base updated successfully', {
        kbId: id,
        kbName: response.data?.name,
        kbStatus: response.data?.status,
      })
      
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] })
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases', variables.id] })
    },
    onError: (error, variables) => {
      debugLogger.logError('KB_UPDATE', error, {
        kbId: variables.id,
        step: 'mutation_onError',
      })
    },
  })
}

// Delete knowledge base mutation
export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient()
  const { orgId } = useAuthClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      debugLogger.logStep('KB_DELETE', 'Deleting knowledge base', {
        kbId: id,
        endpoint: endpoints.knowledge.delete(id),
      })
      
      await apiClient.delete(endpoints.knowledge.delete(id))
      
      debugLogger.logStep('KB_DELETE', 'Knowledge base deleted successfully', {
        kbId: id,
      })
      
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases', orgId] })
    },
    onError: (error, id) => {
      debugLogger.logError('KB_DELETE', error, {
        kbId: id,
        step: 'mutation_onError',
      })
    },
  })
}
