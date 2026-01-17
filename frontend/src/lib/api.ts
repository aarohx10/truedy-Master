import { QueryClient } from '@tanstack/react-query'

// Create a client with optimized defaults for instant loading
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes - data stays fresh longer to reduce API calls
      gcTime: 1000 * 60 * 10, // 10 minutes - keep in cache longer
      retry: 1, // Only retry once on failure
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

// API Client
class ApiClient {
  private baseUrl: string
  private token: string | null = null
  private clientId: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    debugLogger.logStep('API_CLIENT', 'API client initialized', { baseUrl })
  }

  setToken(token: string) {
    this.token = token
    debugLogger.logAuth('SET_TOKEN', 'Token set', { tokenLength: token.length })
  }

  setClientId(clientId: string) {
    this.clientId = clientId
    debugLogger.logAuth('SET_CLIENT_ID', 'Client ID set', { clientId })
  }

  getClientId(): string | null {
    return this.clientId
  }

  clearToken() {
    this.token = null
    this.clientId = null
    debugLogger.logAuth('CLEAR_TOKEN', 'Token and client ID cleared')
  }

  private generateIdempotencyKey(): string {
    return crypto.randomUUID()
  }

  private generateRequestId(): string {
    return crypto.randomUUID()
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<BackendResponse<T>> {
    const method = options.method || 'GET'
    const url = `${this.baseUrl}${endpoint}`
    const startTime = performance.now()
    
    debugLogger.logRequest(method, endpoint, {
      hasToken: !!this.token,
      hasClientId: !!this.clientId,
    })

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Add request correlation ID (per .integration file)
    const requestId = options.headers?.['X-Request-Id'] as string || this.generateRequestId()
    headers['X-Request-Id'] = requestId

    // Add Authorization header
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    // Add x-client-id header (required by backend for non-agency-admin users)
    if (this.clientId) {
      headers['x-client-id'] = this.clientId
    }

    // Add idempotency key for POST/PATCH/PUT requests
    if (['POST', 'PATCH', 'PUT'].includes(options.method || '')) {
      const idempotencyKey = options.headers?.['X-Idempotency-Key'] as string || this.generateIdempotencyKey()
      headers['X-Idempotency-Key'] = idempotencyKey
    }

    let response: Response
    try {
      response = await fetch(url, {
        ...options,
        headers,
      })
    } catch (error) {
      // Handle network errors (CORS, connection refused, etc.)
      const errorMessage = error instanceof Error ? error.message : 'Network error'
      const isCorsError = errorMessage.includes('Failed to fetch') || 
                        errorMessage.includes('NetworkError') ||
                        errorMessage.includes('CORS')
      
      if (isCorsError) {
        debugLogger.logCors(url, false, 'network_error', {
          error: errorMessage,
          method,
          endpoint,
        })
      }
      
      debugLogger.logError('API_REQUEST', error instanceof Error ? error : new Error(errorMessage), {
        method,
        endpoint,
        url,
      })
      
      if (isCorsError) {
        throw new Error(`Failed to connect to server. Please check if the backend is running at ${this.baseUrl}`)
      }
      throw new Error(`Network request failed: ${errorMessage}`)
    }

    const durationMs = Math.round(performance.now() - startTime)
    const responseData = await response.json().catch(() => ({})) as BackendResponse<T> | BackendError

    debugLogger.logResponse(method, endpoint, response.status, durationMs, {
      ok: response.ok,
      hasData: 'data' in responseData,
    })

    if (!response.ok) {
      // Handle 401/403 - token expired or unauthorized
      if (response.status === 401 || response.status === 403) {
        debugLogger.logAuth('TOKEN_EXPIRED', 'Token expired or unauthorized', {
          status: response.status,
          endpoint,
        })
        // Clear token and trigger sign-out
        this.clearToken()
        
        // Only redirect if we're in the browser (client-side) and not already on signin
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/signin')) {
          // Redirect to sign in
          window.location.href = '/signin'
        }
        
        throw new Error('Session expired. Please sign in again.')
      }
      
      // Handle backend error format
      if ('error' in responseData) {
        const error = responseData.error
        const errorMessage = error.message || 'An error occurred'
        const errorDetails = error.details ? ` Details: ${JSON.stringify(error.details)}` : ''
        debugLogger.logError('API_ERROR', new Error(errorMessage), {
          status: response.status,
          endpoint,
          details: error.details,
        })
        throw new Error(`${errorMessage}${errorDetails}`)
      }
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

  async getAudioBlob(endpoint: string): Promise<Blob> {
    const headers: Record<string, string> = {}

    // Add request correlation ID
    headers['X-Request-Id'] = this.generateRequestId()

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    if (this.clientId) {
      headers['x-client-id'] = this.clientId
    }

    const url = `${this.baseUrl}${endpoint}`
    console.log('Fetching audio blob from:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    console.log('Audio response status:', response.status, response.statusText)
    console.log('Audio response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      // Handle 401/403 - token expired or unauthorized
      if (response.status === 401 || response.status === 403) {
        // Clear token and trigger sign-out
        this.clearToken()
        
        // Only sign out if we're in the browser (client-side)
        if (typeof window !== 'undefined') {
          // Redirect to sign in
          window.location.href = '/signin'
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
    const headers: Record<string, string> = {}

    // Add request correlation ID
    headers['X-Request-Id'] = this.generateRequestId()

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    if (this.clientId) {
      headers['x-client-id'] = this.clientId
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    })

    const responseData = await response.json().catch(() => ({})) as BackendResponse<T> | BackendError

    if (!response.ok) {
      // Handle 401/403 - token expired or unauthorized
      if (response.status === 401 || response.status === 403) {
        // Clear token and trigger sign-out
        this.clearToken()
        
        // Only sign out if we're in the browser (client-side)
        if (typeof window !== 'undefined') {
          // Redirect to sign in
          window.location.href = '/signin'
        }
        
        throw new Error('Session expired. Please sign in again.')
      }
      
      if ('error' in responseData) {
        const error = responseData.error
        throw new Error(error.message || 'Upload failed')
      }
      throw new Error('Upload failed')
    }

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
    apiKeys: '/api-keys',
    providers: {
      tts: '/providers/tts',
    },
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
  
  // Agents
  agents: {
    list: '/agents',
    get: (id: string) => `/agents/${id}`,
    create: '/agents',
    update: (id: string) => `/agents/${id}`,
    delete: (id: string) => `/agents/${id}`,
    sync: (id: string) => `/agents/${id}/sync`,
    bulkDelete: '/agents/bulk',
  },
  
  // Knowledge Bases
  knowledge: {
    list: '/kb',
    get: (id: string) => `/kb/${id}`,
    create: '/kb',
    update: (id: string) => `/kb/${id}`,
    delete: (id: string) => `/kb/${id}`,
    presign: (id: string) => `/kb/${id}/files/presign`,
    ingest: (id: string) => `/kb/${id}/files/ingest`,
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
  
  // Telephony
  telephony: {
    config: '/telephony/config',
    numbers: '/telephony/numbers',
    purchase: '/telephony/numbers/purchase',
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
    agents: '/export/agents',
  },
}

