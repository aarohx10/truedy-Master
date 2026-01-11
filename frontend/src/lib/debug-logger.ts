/**
 * Debug Logging Utility
 * Centralized logging system that can be easily toggled or removed
 */

// Check if debug logging is enabled (default: true for dev)
const ENABLE_DEBUG_LOGGING =
  (process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGGING || 'true').toLowerCase() === 'true'

type LogContext = Record<string, any>

class DebugLogger {
  private enabled: boolean

  constructor(enabled: boolean = ENABLE_DEBUG_LOGGING) {
    this.enabled = enabled
  }

  private formatMessage(
    category: string,
    step: string,
    message: string,
    context?: LogContext
  ): string {
    const parts = [`[DEBUG]`, `[${category}]`, `[${step}]`, message]
    if (context) {
      const contextStr = Object.entries(context)
        .map(([k, v]) => `${k}=${v}`)
        .join(' | ')
      parts.push(`| ${contextStr}`)
    }
    return parts.join(' ')
  }

  private log(
    level: 'log' | 'info' | 'warn' | 'error',
    category: string,
    step: string,
    message: string,
    context?: LogContext
  ) {
    if (!this.enabled) return

    const formatted = this.formatMessage(category, step, message, context)
    const consoleMethod = console[level] || console.log

    // Add color coding in dev mode
    if (process.env.NODE_ENV === 'development') {
      const colors: Record<string, string> = {
        STEP: '\x1b[36m', // Cyan
        REQUEST: '\x1b[33m', // Yellow
        RESPONSE: '\x1b[32m', // Green
        ERROR: '\x1b[31m', // Red
        CORS: '\x1b[35m', // Magenta
        AUTH: '\x1b[34m', // Blue
        API: '\x1b[37m', // White
        DB: '\x1b[90m', // Gray
      }
      const reset = '\x1b[0m'
      const color = colors[category] || ''
      consoleMethod(`${color}${formatted}${reset}`)
    } else {
      consoleMethod(formatted)
    }
  }

  logStep(step: string, message: string, context?: LogContext) {
    this.log('log', 'STEP', step, message, context)
  }

  logRequest(method: string, endpoint: string, context?: LogContext) {
    this.log('info', 'REQUEST', 'OUTGOING', `${method} ${endpoint}`, {
      method,
      endpoint,
      ...context,
    })
  }

  logResponse(
    method: string,
    endpoint: string,
    status: number,
    durationMs?: number,
    context?: LogContext
  ) {
    this.log('info', 'RESPONSE', 'RECEIVED', `${method} ${endpoint} - ${status}`, {
      method,
      endpoint,
      status,
      ...(durationMs && { durationMs }),
      ...context,
    })
  }

  logError(step: string, error: Error | unknown, context?: LogContext) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorType = error instanceof Error ? error.constructor.name : typeof error
    this.log('error', 'ERROR', step, `Error in ${step}: ${errorMessage}`, {
      error: errorMessage,
      errorType,
      ...context,
    })
  }

  logCors(
    origin: string,
    allowed: boolean,
    matchType?: string,
    context?: LogContext
  ) {
    const status = allowed ? 'ALLOWED' : 'DENIED'
    this.log('warn', 'CORS', 'CHECK', `CORS ${status} for origin: ${origin}`, {
      origin,
      allowed,
      ...(matchType && { matchType }),
      ...context,
    })
  }

  logAuth(step: string, message: string, context?: LogContext) {
    this.log('info', 'AUTH', step, message, context)
  }

  logApiCall(
    service: string,
    endpoint: string,
    method: string = 'GET',
    context?: LogContext
  ) {
    this.log('info', 'API', 'EXTERNAL', `${service} ${method} ${endpoint}`, {
      service,
      endpoint,
      method,
      ...context,
    })
  }
}

// Global instance
export const debugLogger = new DebugLogger()

