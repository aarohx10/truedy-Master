import { QueryClient } from '@tanstack/react-query'
import { authManager } from './auth-manager'

// Create a client with optimized defaults for instant loading
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes - data stays fresh longer to reduce API calls
      gcTime: 1000 * 60 * 10, // 10 minutes - keep in cache longer
      retry: (failureCount, error) => {
        // Don't retry auth errors
        if (error instanceof Error && error.message.includes('Session expired')) {
          return false
        }
        return failureCount < 2
      },
      retryDelay: 1000, // Wait 1 second before retry
      refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
      refetchOnMount: false, // Don't refetch on mount if data is fresh
      refetchOnReconnect: false, // Don't refetch on reconnect to reduce API calls
    },
    mutations: {
      retry: 0, // Don't retry mutations
    },
  },
})

// API Base URL - Backend uses /api/v1 prefix
// HARD-CODED: No environment variables - everything is hard-coded for reliability

// Hard-coded production backend URL
const PRODUCTION_BACKEND_URL = 'https://truedy.closi.tech/api/v1'

// Hard-coded localhost URL for development
const LOCALHOST_BACKEND_URL = 'http://localhost:8000/api/v1'

export const API_URL = (() => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    // Comprehensive check for local development environments
    const isLocal = 
      hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      hostname.startsWith('192.168.') || 
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')

    if (!isLocal) {
      // Use the hard-coded production backend URL for all cloud/preview deployments
      return PRODUCTION_BACKEND_URL
    }
  }
  // Default to local backend for development
  return LOCALHOST_BACKEND_URL
})()

// Backend Response Types
export interface BackendResponse<T> {
  data: T
  meta?: {
    request_id?: string
    ts?: string
  }
}

export interface BackendError {
  error: {
    code: string
    message: string
    details?: Record<string, any>
    request_id?: string
    ts?: string
  }
}

import { debugLogger } from './debug-logger'

// API Client - Integrated with AuthManager
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    debugLogger.logStep('API_CLIENT', 'API client initialized', { baseUrl })
  }

  // These methods delegate to authManager but are kept for backward compatibility
  setToken(token: string) {
    // Token is now managed by authManager
    // This is called by useAuthClient, which also calls authManager.setAuth
    debugLogger.logAuth('SET_TOKEN', 'Token set via apiClient (delegating to authManager)', { tokenLength: token.length })
  }

  setClientId(clientId: string) {
    // ClientId is now managed by authManager
    debugLogger.logAuth('SET_CLIENT_ID', 'Client ID set via apiClient (delegating to authManager)', { clientId })
  }

  getClientId(): string | null {
    return authManager.getClientId()
  }

  hasToken(): boolean {
    return authManager.hasToken()
  }

  clearToken() {
    // Delegate to authManager
    authManager.clearAuth()
    debugLogger.logAuth('CLEAR_TOKEN', 'Token cleared via apiClient')
  }

  private generateIdempotencyKey(): string {
    return crypto.randomUUID()
  }

  private generateRequestId(): string {
    return crypto.randomUUID()
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<BackendResponse<T>> {
    // Task 4: Hardening the API Handshake - Handle large JSON payloads (up to 5MB)
    // For import endpoints, use AbortController with extended timeout
    const isImportEndpoint = endpoint.includes('/import') || endpoint.includes('/contacts/import')
    const timeout = isImportEndpoint ? 120000 : 30000 // 2 minutes for imports, 30s for others
    
    const method = options.method || 'GET'
    const url = `${this.baseUrl}${endpoint}`
    const startTime = performance.now()
    
    // Get current auth state from authManager
    const token = authManager.getToken()
    // Note: clientId is no longer used - backend extracts org_id from JWT token
    
    debugLogger.logRequest(method, endpoint, {
      hasToken: !!token,
      retryCount,
    })

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Add request correlation ID
    const requestId = options.headers?.['X-Request-Id'] as string || this.generateRequestId()
    headers['X-Request-Id'] = requestId

    // CRITICAL: Add Authorization header - JWT is the only header needed
    // The backend extracts org_id from the JWT token (organization-first approach)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    let response: Response
    try {
      response = await fetch(url, {
        ...options,
        headers,
      })
    } catch (error) {
      // Handle network errors (CORS, connection refused, timeout, SSL, etc.)
      const rawError = error instanceof Error ? error : new Error(String(error))
      const errorMessage = rawError.message || 'Network error'
      
      // Check if it's a timeout error
      if (rawError.name === 'AbortError' || errorMessage.includes('aborted')) {
        throw new Error(`Request timeout after ${timeout / 1000}s. ${isImportEndpoint ? 'Large file imports may take longer. Please try again or use a smaller file.' : ''}`)
      }
      
      // Log RAW network error for developers
      console.error('[API_REQUEST] Network error (RAW)', {
        url,
        method,
        endpoint,
        errorMessage: rawError.message,
        errorName: rawError.name,
      })

      // NEW: Intelligent Network Error Diagnosis
      // Instead of assuming CORS, we probe the backend
      const isTypeError = rawError instanceof TypeError
      
      if (isTypeError) {
        // TypeError in fetch usually means:
        // 1. DNS failure / Wrong IP
        // 2. SSL Protocol Error (Handshake failed)
        // 3. True CORS block
        
        // We try a simple health check to see if we can reach the server at all
        try {
          const probe = await fetch(`${this.baseUrl}/health`, { mode: 'no-cors' })
          // If we reach here, the server is UP, but CORS might be blocking us
          throw new Error(
            `CORS Error: The backend is reachable but is not allowing requests from this origin. ` +
            `Please verify that ${window.location.origin} is in the CORS allowlist.`
          )
        } catch (probeError) {
          // If the probe also fails, it's a connection/SSL/DNS issue
          throw new Error(
            `Connection Error: Cannot reach the backend at ${this.baseUrl}. ` +
            `This is likely an SSL Protocol Error (net::ERR_SSL_PROTOCOL_ERROR) or DNS propagation issue. ` +
            `Please ensure your DNS is pointing to the correct server IP (5.78.66.173).`
          )
        }
      }
      
      throw new Error(`Network request failed: ${errorMessage}`)
    }

    const durationMs = Math.round(performance.now() - startTime)
    const responseData = await response.json().catch(() => ({})) as BackendResponse<T> | BackendError

    // Step 3: Empty Data Protection - Check if response is 200 but data is null/empty
    if (response.ok && response.status === 200) {
      // Step 3: Global Response Logger - Log every 200 OK response
      console.log(`[API SUCCESS] ${method} ${endpoint}:`, responseData)
      
      if (!responseData || (responseData && 'data' in responseData && (responseData.data === null || responseData.data === undefined))) {
        const errorMessage = `Backend returned 200 but data payload is empty for ${endpoint}`
        console.error('[API] Empty data payload detected:', {
          endpoint,
          url,
          status: response.status,
          responseData,
          // Note: clientId removed - backend uses org_id from JWT token
        })
        // Don't throw here - let the calling code handle empty arrays
        // But log it clearly for debugging
      }
    }

    debugLogger.logResponse(method, endpoint, response.status, durationMs, {
      ok: response.ok,
      hasData: 'data' in responseData,
      retryCount,
    })

    if (!response.ok) {
      // Handle 401/403 - try to refresh token and retry ONCE
      if ((response.status === 401 || response.status === 403) && retryCount === 0) {
        debugLogger.logAuth('TOKEN_EXPIRED', 'Token expired, attempting refresh', {
          status: response.status,
          endpoint,
        })
        
        // Try to refresh the token
        const freshToken = await authManager.refreshToken()
        
        if (freshToken) {
          debugLogger.logAuth('TOKEN_REFRESHED', 'Token refreshed, retrying request', {
            endpoint,
          })
          // Retry the request with fresh token
          return this.request<T>(endpoint, options, retryCount + 1)
        }
        
        // Refresh failed, throw session expired error
        debugLogger.logAuth('TOKEN_REFRESH_FAILED', 'Token refresh failed', {
          endpoint,
        })
        throw new Error('Session expired. Please sign in again.')
      }
      
      // Already retried or non-auth error
      if (response.status === 401 || response.status === 403) {
        throw new Error('Session expired. Please sign in again.')
      }
      
      // Handle backend error format - LOG RAW ERROR
      if ('error' in responseData) {
        const error = responseData.error
        const errorMessage = error.message || 'An error occurred'
        const errorDetails = error.details ? ` Details: ${JSON.stringify(error.details)}` : ''
        
        // Log RAW error to console
        console.error('[API_REQUEST] Backend error (RAW)', {
          endpoint,
          url,
          status: response.status,
          statusText: response.statusText,
          errorObject: error,
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details,
          errorRequestId: error.request_id,
          errorTs: error.ts,
          fullErrorObject: JSON.stringify(error, null, 2),
          fullResponseData: JSON.stringify(responseData, null, 2),
          responseHeaders: Object.fromEntries(response.headers.entries()),
        })
        
        debugLogger.logError('API_ERROR', new Error(errorMessage), {
          status: response.status,
          endpoint,
          details: error.details,
        })
        throw new Error(`${errorMessage}${errorDetails}`)
      }
      
      // Log RAW error for non-standard error format
      console.error('[API_REQUEST] Request failed (RAW ERROR)', {
        endpoint,
        url,
        status: response.status,
        statusText: response.statusText,
        responseData,
        fullResponseData: JSON.stringify(responseData, null, 2),
        responseHeaders: Object.fromEntries(response.headers.entries()),
      })
      
      debugLogger.logError('API_ERROR', new Error(`Request failed with status ${response.status}`), {
        status: response.status,
        endpoint,
      })
      throw new Error(`Request failed with status ${response.status}`)
    }

    // Backend returns {data, meta} format
    return responseData as BackendResponse<T>
  }

  async get<T>(endpoint: string): Promise<BackendResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<BackendResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<BackendResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<BackendResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<BackendResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  /**
   * Test CORS configuration by calling the backend's CORS test endpoint.
   * Use this to diagnose CORS issues.
   * 
   * @returns CORS diagnostic information
   */
  async testCors(): Promise<{
    status: string
    cors_working: boolean
    origin_received: string
    origin_allowed: boolean
    exact_origins_count: number
    wildcard_patterns_count: number
    message: string
  }> {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'unknown'
    
    console.log('[CORS TEST] Testing CORS configuration...', {
      currentOrigin,
      backendUrl: this.baseUrl,
    })
    
    try {
      const response = await fetch(`${this.baseUrl}/cors-test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`CORS test failed with status ${response.status}`)
      }
      
      const data = await response.json()
      console.log('[CORS TEST] Success!', data)
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('[CORS TEST] Failed!', {
        error: errorMessage,
        currentOrigin,
        backendUrl: this.baseUrl,
        suggestion: `Add "${currentOrigin}" to the backend's CORS allowed origins`,
      })
      throw error
    }
  }

  async getAudioBlob(endpoint: string): Promise<Blob> {
    const token = authManager.getToken()
    
    const headers: Record<string, string> = {}

    // Add request correlation ID
    headers['X-Request-Id'] = this.generateRequestId()

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // REMOVED: x-client-id header - backend extracts org_id from JWT token

    const url = `${this.baseUrl}${endpoint}`
    console.log('Fetching audio blob from:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    console.log('Audio response status:', response.status, response.statusText)
    console.log('Audio response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      // Handle 401/403 - try to refresh and retry
      if (response.status === 401 || response.status === 403) {
        const freshToken = await authManager.refreshToken()
        if (freshToken) {
          // Retry with fresh token
          headers['Authorization'] = `Bearer ${freshToken}`
          const retryResponse = await fetch(url, { method: 'GET', headers })
          if (retryResponse.ok) {
            const blob = await retryResponse.blob()
            if (blob.size === 0) {
              throw new Error('Received empty audio response from server')
            }
            return blob
          }
        }
        throw new Error('Session expired. Please sign in again.')
      }
      
      // Try to get error message from response
      let errorMessage = `Failed to fetch audio (${response.status})`
      
      try {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json() as BackendError
          if ('error' in errorData) {
            const error = errorData.error
            errorMessage = error.message || errorMessage
            console.error('Backend error:', error)
          }
        } else {
          // Try to read as text if not JSON
          const text = await response.text()
          if (text) {
            console.error('Error response text:', text)
            errorMessage = text.substring(0, 200) // Limit error message length
          }
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError)
      }
      
      throw new Error(errorMessage)
    }

    const blob = await response.blob()
    console.log('Audio blob created:', { size: blob.size, type: blob.type })
    
    if (blob.size === 0) {
      throw new Error('Received empty audio response from server')
    }
    
    return blob
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<BackendResponse<T>> {
    const startTime = performance.now()
    const token = authManager.getToken()
    const url = `${this.baseUrl}${endpoint}`
    
    console.log('[API_UPLOAD] ===== UPLOAD REQUEST START =====')
    console.log('[API_UPLOAD] Starting upload request', {
      endpoint,
      url,
      baseUrl: this.baseUrl,
      hasToken: !!token,
      formDataKeys: Array.from(formData.keys()),
    })
    
    // Log FormData contents for debugging
    const formDataEntries: any[] = []
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        formDataEntries.push({
          key,
          type: 'File',
          name: value.name,
          size: value.size,
          mimeType: value.type
        })
      } else {
        formDataEntries.push({ key, type: 'string', value: String(value) })
      }
    }
    console.log('[API_UPLOAD] FormData contents', {
      entries: formDataEntries,
      totalEntries: formDataEntries.length
    })
    
    const headers: Record<string, string> = {}

    // Add request correlation ID
    const requestId = this.generateRequestId()
    headers['X-Request-Id'] = requestId

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      console.log('[API_UPLOAD] Authorization header added', { tokenLength: token.length })
    } else {
      console.warn('[API_UPLOAD] ⚠️ No token available!')
    }

    // REMOVED: x-client-id header - backend extracts org_id from JWT token

    // CRITICAL: Do NOT set Content-Type header - browser must set it with boundary
    console.log('[API_UPLOAD] Headers prepared (Content-Type will be set by browser)', {
      headers: Object.keys(headers),
      note: 'Content-Type not set - browser will add multipart boundary automatically'
    })

    let response: Response
    try {
      console.log('[API_UPLOAD] Sending fetch request...', {
        url,
        method: 'POST',
        hasBody: !!formData,
        headersCount: Object.keys(headers).length
      })
      
      // No timeout needed - backend returns immediately and processes in background
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      })
      
      console.log('[API_UPLOAD] Fetch request sent, waiting for response...')
      
      console.log('[API_UPLOAD] ===== RESPONSE RECEIVED =====')
      console.log('[API_UPLOAD] Fetch completed', {
        endpoint,
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      })
      
      // Log response details
      const responseHeaders = Object.fromEntries(response.headers.entries())
      console.log('[API_UPLOAD] Response headers', {
        contentType: responseHeaders['content-type'],
        contentLength: responseHeaders['content-length'],
        allHeaders: responseHeaders
      })
    } catch (networkError) {
      const rawError = networkError instanceof Error ? networkError : new Error(String(networkError))
      console.error('[API_UPLOAD] Network error (RAW)', {
        endpoint,
        url,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError)),
      })
      throw rawError
    }

    let responseData: BackendResponse<T> | BackendError
    try {
      console.log('[API_UPLOAD] Reading response body...')
      const responseText = await response.text()
      console.log('[API_UPLOAD] ===== RESPONSE BODY RECEIVED =====')
      console.log('[API_UPLOAD] Response text (RAW)', {
        endpoint,
        status: response.status,
        responseText,
        responseTextLength: responseText.length,
        preview: responseText.substring(0, 500)
      })
      
      responseData = responseText ? JSON.parse(responseText) : ({} as BackendResponse<T> | BackendError)
    } catch (parseError) {
      const rawParseError = parseError instanceof Error ? parseError : new Error(String(parseError))
      console.error('[API_UPLOAD] JSON parse error (RAW)', {
        endpoint,
        status: response.status,
        parseError: rawParseError,
        errorMessage: rawParseError.message,
        errorStack: rawParseError.stack,
        fullErrorObject: JSON.stringify(rawParseError, Object.getOwnPropertyNames(rawParseError)),
      })
      responseData = {} as BackendResponse<T> | BackendError
    }

    const durationMs = Math.round(performance.now() - startTime)
    console.log('[API_UPLOAD] ===== RESPONSE PARSED =====')
    console.log('[API_UPLOAD] Response data (RAW)', {
      endpoint,
      status: response.status,
      durationMs,
      responseData,
      hasError: 'error' in responseData,
      hasData: 'data' in responseData,
      fullResponseData: JSON.stringify(responseData, null, 2)
    })

    if (!response.ok) {
      // Handle 401/403 - try to refresh and retry
      if (response.status === 401 || response.status === 403) {
        console.log('[API_UPLOAD] Auth error, attempting token refresh', {
          endpoint,
          status: response.status,
        })
        
        const freshToken = await authManager.refreshToken()
        if (freshToken) {
          console.log('[API_UPLOAD] Token refreshed, retrying request', {
            endpoint,
          })
          
          // Retry with fresh token
          headers['Authorization'] = `Bearer ${freshToken}`
          try {
            const retryResponse = await fetch(url, {
              method: 'POST',
              headers,
              body: formData,
            })
            
            const retryText = await retryResponse.text()
            const retryData = retryText ? JSON.parse(retryText) : ({} as BackendResponse<T> | BackendError)
            
            console.log('[API_UPLOAD] Retry response (RAW)', {
              endpoint,
              status: retryResponse.status,
              ok: retryResponse.ok,
              retryData,
            })
            
            if (retryResponse.ok) {
              return retryData as BackendResponse<T>
            }
          } catch (retryError) {
            const rawRetryError = retryError instanceof Error ? retryError : new Error(String(retryError))
            console.error('[API_UPLOAD] Retry failed (RAW)', {
              endpoint,
              retryError: rawRetryError,
              errorMessage: rawRetryError.message,
              errorStack: rawRetryError.stack,
              fullErrorObject: JSON.stringify(rawRetryError, Object.getOwnPropertyNames(rawRetryError)),
            })
          }
        }
        
        const authError = new Error('Session expired. Please sign in again.')
        console.error('[API_UPLOAD] Auth error final (RAW)', {
          endpoint,
          status: response.status,
          error: authError,
          responseData,
        })
        throw authError
      }
      
      // Log full error details
      const errorDetails = {
        endpoint,
        url,
        status: response.status,
        statusText: response.statusText,
        responseData,
        hasErrorObject: 'error' in responseData,
        errorObject: 'error' in responseData ? responseData.error : null,
        fullResponseHeaders: Object.fromEntries(response.headers.entries()),
      }
      
      console.error('[API_UPLOAD] Upload failed (RAW ERROR)', errorDetails)
      
      if ('error' in responseData) {
        const error = responseData.error
        const errorMessage = error.message || 'Upload failed'
        const fullError = new Error(errorMessage)
        
        console.error('[API_UPLOAD] Backend error object (RAW)', {
          endpoint,
          errorObject: error,
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details,
          errorRequestId: error.request_id,
          errorTs: error.ts,
          fullErrorObject: JSON.stringify(error, null, 2),
        })
        
        throw fullError
      }
      
      const genericError = new Error(`Upload failed with status ${response.status}`)
      console.error('[API_UPLOAD] Generic upload error (RAW)', {
        endpoint,
        error: genericError,
        responseData,
      })
      throw genericError
    }

    console.log('[API_UPLOAD] ===== UPLOAD SUCCESS =====')
    console.log('[API_UPLOAD] Upload successful', {
      endpoint,
      durationMs,
      responseData,
      fullResponse: JSON.stringify(responseData, null, 2)
    })
    console.log('[API_UPLOAD] ===== END UPLOAD REQUEST =====')

    return responseData as BackendResponse<T>
  }
}

export const apiClient = new ApiClient(API_URL)

// API Endpoints - Updated to match backend structure
export const endpoints = {
  // Auth
  auth: {
    me: '/auth/me',
    clients: '/auth/clients',
    users: '/auth/users',
    providers: {
      tts: '/providers/tts',
    },
  },
  
  // API Keys
  apiKeys: {
    list: '/auth/api-keys',
    create: '/auth/api-keys',
    delete: (id: string) => `/auth/api-keys/${id}`,
  },
  
  // Telephony
  telephony: {
    init: '/telephony/init',
    search: '/telephony/numbers/search',
    purchase: '/telephony/numbers/purchase',
    import: '/telephony/numbers/import',
    list: '/telephony/numbers',
    assign: '/telephony/numbers/assign',
    credentials: '/telephony/credentials',
    config: '/telephony/config',
  },
  
  // Voices
  voices: {
    list: '/voices',
    get: (id: string) => `/voices/${id}`,
    create: '/voices',
    update: (id: string) => `/voices/${id}`,
    delete: (id: string) => `/voices/${id}`,
    presign: '/voices/files/presign',
    sync: (id: string) => `/voices/${id}/sync`,
    preview: (id: string, text?: string) => `/voices/${id}/preview${text ? `?text=${encodeURIComponent(text)}` : ''}`,
  },
  
  // Campaigns
  campaigns: {
    list: '/campaigns',
    get: (id: string) => `/campaigns/${id}`,
    create: '/campaigns',
    update: (id: string) => `/campaigns/${id}`,
    delete: (id: string) => `/campaigns/${id}`,
    contacts: (id: string) => `/campaigns/${id}/contacts`,
    schedule: (id: string) => `/campaigns/${id}/schedule`,
    pause: (id: string) => `/campaigns/${id}/pause`,
    resume: (id: string) => `/campaigns/${id}/resume`,
    bulkDelete: '/campaigns/bulk',
  },
  
  // Calls
  calls: {
    list: '/calls',
    get: (id: string) => `/calls/${id}`,
    create: '/calls',
    update: (id: string) => `/calls/${id}`,
    delete: (id: string) => `/calls/${id}`,
    recording: (id: string) => `/calls/${id}/recording`,
    transcript: (id: string) => `/calls/${id}/transcript`,
    bulkDelete: '/calls/bulk',
  },
  
  // Tools
  tools: {
    list: '/tools',
    get: (id: string) => `/tools/${id}`,
    create: '/tools',
    update: (id: string) => `/tools/${id}`,
    delete: (id: string) => `/tools/${id}`,
  },
  
  // Knowledge Bases
  knowledge: {
    list: '/kb',
    get: (id: string) => `/kb/${id}`,
    create: '/kb',
    update: (id: string) => `/kb/${id}`,
    delete: (id: string) => `/kb/${id}`,
    fetch: (id: string) => `/kb/${id}/fetch`, // For Ultravox tool
  },
  
  // Contacts - Simple, explicit endpoints
  contacts: {
    createFolder: '/contacts/create-folder',
    listFolders: '/contacts/list-folders',
    listContacts: (folderId?: string) => `/contacts/list-contacts${folderId ? `?folder_id=${folderId}` : ''}`,
    addContact: '/contacts/add-contact',
    updateContact: (id: string) => `/contacts/update-contact/${id}`,
    deleteContact: (id: string) => `/contacts/delete-contact/${id}`,
    import: '/contacts/import-contacts',
    export: (folderId?: string) => `/contacts/export-contacts${folderId ? `?folder_id=${folderId}` : ''}`,
  },
  
  // Telephony
  telephony: {
    init: '/telephony/init',
    search: '/telephony/numbers/search',
    purchase: '/telephony/numbers/purchase',
    import: '/telephony/numbers/import',
    list: '/telephony/numbers',
    assign: '/telephony/numbers/assign',
    unassign: '/telephony/numbers/unassign',
    getAgentNumbers: (agentId: string) => `/telephony/agents/${agentId}/numbers`,
    getAgentWebhookUrl: (agentId: string) => `/telephony/agents/${agentId}/webhook-url`,
    credentials: '/telephony/credentials',
    config: '/telephony/config',
  },
  
  // Webhooks
  webhooks: {
    list: '/webhooks',
    create: '/webhooks',
    delete: (id: string) => `/webhooks/${id}`,
  },
  
  // Dashboard
  dashboard: {
    stats: '/dashboard/stats',
  },
  
  // Export
  export: {
    calls: '/export/calls',
    campaigns: '/export/campaigns',
  },
  
  // Agents
  agents: {
    list: '/agents',
    get: (id: string) => `/agents/${id}`,
    create: '/agents',
    createDraft: '/agents/draft',
    update: (id: string) => `/agents/${id}`,
    delete: (id: string) => `/agents/${id}`,
    testCall: (id: string) => `/agents/${id}/test-call`,
    sync: (id: string) => `/agents/${id}/sync`,
    aiAssist: '/agents/ai-assist',
  },
  
  // Agent Templates
  agentTemplates: {
    list: '/agent-templates',
    get: (id: string) => `/agent-templates/${id}`,
  },
}
