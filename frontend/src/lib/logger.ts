/**
 * Frontend Logger Service
 * Batches logs and sends them to the backend for storage
 * 
 * IMPORTANT: This logger is completely isolated from the auth system.
 * It uses raw fetch() instead of apiClient to prevent:
 * 1. Auth cascades from failed log requests
 * 2. Token clearing when logging fails
 * 3. Circular dependencies with auth components
 * 
 * Logs are non-critical - they are silently discarded on any error.
 */

import { authManager } from './auth-manager'
import { API_URL } from './api'

export type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
export type LogCategory = 
  | 'api_request' 
  | 'api_response' 
  | 'user_action' 
  | 'error' 
  | 'auth' 
  | 'page_view'
  | 'form_submission'
  | 'button_click'
  | 'navigation'

export interface LogEntry {
  source: 'frontend'
  level: LogLevel
  category: LogCategory
  message: string
  request_id?: string
  client_id?: string
  user_id?: string
  endpoint?: string
  method?: string
  status_code?: number
  duration_ms?: number
  context?: Record<string, any>
  error_details?: Record<string, any>
  ip_address?: string
  user_agent?: string
}

class Logger {
  private queue: LogEntry[] = []
  private batchSize: number = 10
  private batchInterval: number = 5000 // 5 seconds
  private flushTimer: ReturnType<typeof setInterval> | null = null
  private isFlushing: boolean = false
  private maxQueueSize: number = 100 // Reduced to prevent memory issues
  private logsEndpoint: string

  constructor() {
    this.logsEndpoint = `${API_URL}/logs`
    
    // Start batch timer
    this.startBatchTimer()
    
    // Use sendBeacon for reliable unload logging
    if (typeof window !== 'undefined') {
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flushWithBeacon()
        }
      })
      
      window.addEventListener('beforeunload', () => {
        this.flushWithBeacon()
      })
      
      // Also flush when page is unloading
      window.addEventListener('pagehide', () => {
        this.flushWithBeacon()
      })
    }
  }

  private startBatchTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    
    this.flushTimer = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush()
      }
    }, this.batchInterval)
  }

  private getBrowserContext(): Record<string, any> {
    if (typeof window === 'undefined') {
      return {}
    }

    return {
      url: window.location.href,
      pathname: window.location.pathname,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
    }
  }

  private getAuthContext(): { client_id?: string; user_id?: string } {
    const clientId = authManager.getClientId()
    // Try to get user ID from Clerk if available
    let userId: string | undefined
    try {
      // Check if Clerk is available
      if (typeof window !== 'undefined' && (window as any).Clerk) {
        const clerk = (window as any).Clerk
        if (clerk.user) {
          userId = clerk.user.id
        }
      }
    } catch (e) {
      // Clerk not available or not initialized
    }

    return {
      client_id: clientId || undefined,
      user_id: userId,
    }
  }

  private createLogEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    context?: Record<string, any>,
    errorDetails?: Record<string, any>
  ): LogEntry {
    const browserContext = this.getBrowserContext()
    const authContext = this.getAuthContext()
    
    // Get request ID from current request if available
    const requestId = (context?.request_id as string) || undefined

    return {
      source: 'frontend',
      level,
      category,
      message,
      request_id: requestId,
      client_id: authContext.client_id,
      user_id: authContext.user_id,
      endpoint: browserContext.pathname,
      context: {
        ...browserContext,
        ...context,
      },
      error_details: errorDetails,
      user_agent: browserContext.userAgent,
    }
  }

  private addToQueue(entry: LogEntry) {
    // Prevent queue from growing too large
    if (this.queue.length >= this.maxQueueSize) {
      // Remove oldest entries
      this.queue.shift()
    }
    
    this.queue.push(entry)

    // Flush if batch size reached
    if (this.queue.length >= this.batchSize) {
      this.flush()
    }
  }

  /**
   * Use sendBeacon for reliable log delivery during page unload
   * sendBeacon is fire-and-forget and doesn't block the unload
   */
  private flushWithBeacon(): void {
    if (this.queue.length === 0) {
      return
    }

    // Only send if we have a token
    const token = authManager.getToken()
    if (!token) {
      // Discard logs if not authenticated - they're not critical
      this.queue = []
      return
    }

    try {
      const logsToSend = [...this.queue]
      this.queue = []
      
      // sendBeacon doesn't support custom headers, so we use URL-encoded format
      // Backend needs to handle this or we just accept that some logs may be lost
      const blob = new Blob([JSON.stringify({ logs: logsToSend })], {
        type: 'application/json'
      })
      
      // Try sendBeacon first (more reliable during unload)
      if (navigator.sendBeacon) {
        // Note: sendBeacon doesn't support custom headers
        // For now, send without auth - backend /logs endpoint is optional auth
        navigator.sendBeacon(this.logsEndpoint, blob)
      }
    } catch (error) {
      // Silently discard - logs are not critical
      console.warn('[Logger] Failed to send logs via beacon')
    }
  }

  /**
   * Standard flush using fetch
   * Uses raw fetch instead of apiClient to avoid auth side effects
   */
  private async flush(): Promise<void> {
    if (this.isFlushing || this.queue.length === 0) {
      return
    }

    // Don't try to send logs if we don't have auth
    const token = authManager.getToken()
    if (!token) {
      // No auth yet, skip this flush - logs will be sent on next interval
      // Or discarded eventually (they're not critical)
      return
    }

    this.isFlushing = true
    const logsToSend = [...this.queue]
    this.queue = []

    try {
      // Use raw fetch instead of apiClient to avoid any auth side effects
      const response = await fetch(this.logsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-client-id': authManager.getClientId() || '',
        },
        body: JSON.stringify({ logs: logsToSend }),
      })

      if (!response.ok) {
        // Log failed - just discard, don't retry
        // Auth errors, network errors, anything - just discard
        // Logs are NOT critical
        if (response.status === 401 || response.status === 403) {
          console.warn('[Logger] Auth error, discarding logs', { count: logsToSend.length })
        } else {
          console.warn('[Logger] Failed to send logs', { 
            status: response.status, 
            count: logsToSend.length 
          })
        }
      }
    } catch (error) {
      // Network error or other issue - silently discard
      // DO NOT retry, DO NOT re-queue
      console.warn('[Logger] Network error, discarding logs', { count: logsToSend.length })
    } finally {
      this.isFlushing = false
    }
  }

  // Public logging methods
  log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    context?: Record<string, any>,
    errorDetails?: Record<string, any>
  ) {
    const entry = this.createLogEntry(level, category, message, context, errorDetails)
    this.addToQueue(entry)
  }

  logRequest(
    method: string,
    endpoint: string,
    context?: Record<string, any>
  ) {
    this.log('INFO', 'api_request', `${method} ${endpoint}`, {
      ...context,
      method,
      endpoint,
    })
  }

  logResponse(
    method: string,
    endpoint: string,
    statusCode: number,
    durationMs?: number,
    context?: Record<string, any>
  ) {
    const level: LogLevel = statusCode >= 500 ? 'ERROR' : statusCode >= 400 ? 'WARNING' : 'INFO'
    
    this.log(level, 'api_response', `${method} ${endpoint} - ${statusCode}`, {
      ...context,
      method,
      endpoint,
      status_code: statusCode,
      duration_ms: durationMs,
    })
  }

  logError(
    error: Error | string,
    context?: Record<string, any>
  ) {
    const errorMessage = error instanceof Error ? error.message : error
    const errorDetails = error instanceof Error ? {
      error_type: error.constructor.name,
      error_message: error.message,
      stack_trace: error.stack,
    } : undefined

    this.log('ERROR', 'error', errorMessage, context, errorDetails)
  }

  logUserAction(
    action: string,
    context?: Record<string, any>
  ) {
    this.log('INFO', 'user_action', action, context)
  }

  logPageView(pathname: string, context?: Record<string, any>) {
    this.log('INFO', 'page_view', `Page view: ${pathname}`, {
      ...context,
      pathname,
    })
  }

  logFormSubmission(formName: string, context?: Record<string, any>) {
    this.log('INFO', 'form_submission', `Form submitted: ${formName}`, {
      ...context,
      form_name: formName,
    })
  }

  logButtonClick(buttonName: string, context?: Record<string, any>) {
    this.log('INFO', 'button_click', `Button clicked: ${buttonName}`, {
      ...context,
      button_name: buttonName,
    })
  }

  // Force flush (useful for critical logs)
  async forceFlush(): Promise<void> {
    await this.flush()
  }
  
  // Clear queue (useful for cleanup)
  clearQueue(): void {
    this.queue = []
  }
}

// Export singleton instance
export const logger = new Logger()

// Export convenience methods
export const log = logger.log.bind(logger)
export const logRequest = logger.logRequest.bind(logger)
export const logResponse = logger.logResponse.bind(logger)
export const logError = logger.logError.bind(logger)
export const logUserAction = logger.logUserAction.bind(logger)
export const logPageView = logger.logPageView.bind(logger)
export const logFormSubmission = logger.logFormSubmission.bind(logger)
export const logButtonClick = logger.logButtonClick.bind(logger)
