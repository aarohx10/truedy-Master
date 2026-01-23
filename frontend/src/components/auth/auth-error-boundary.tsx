'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { authManager } from '@/lib/auth-manager'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  isRecovering: boolean
  recoveryAttempted: boolean
}

/**
 * Auth Error Boundary
 * 
 * Catches auth-related errors at the top level and provides:
 * 1. A user-friendly error message
 * 2. Automatic recovery attempt (token refresh)
 * 3. Manual retry button
 * 4. Sign-out option if recovery fails
 * 
 * This prevents cascading errors from breaking the entire app.
 */
export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      isRecovering: false,
      recoveryAttempted: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Only catch auth-related errors
    const isAuthError = 
      error.message.includes('Session expired') ||
      error.message.includes('Not authenticated') ||
      error.message.includes('401') ||
      error.message.includes('403') ||
      error.message.includes('Unauthorized')

    if (isAuthError) {
      return { hasError: true, error }
    }

    // Re-throw non-auth errors
    throw error
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log RAW error with full details
    console.error('[AuthErrorBoundary] Caught error (RAW ERROR)', {
      error,
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
      errorCause: (error as any).cause,
      fullErrorObject: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      errorInfo,
      errorInfoComponentStack: errorInfo.componentStack,
      errorInfoErrorBoundary: errorInfo.errorBoundary,
    })
    
    // Attempt automatic recovery if not already tried
    if (!this.state.recoveryAttempted) {
      this.attemptRecovery()
    }
  }

  private async attemptRecovery() {
    this.setState({ isRecovering: true, recoveryAttempted: true })

    try {
      console.log('[AuthErrorBoundary] Attempting token refresh...')
      const freshToken = await authManager.refreshToken()
      
      if (freshToken) {
        console.log('[AuthErrorBoundary] Token refreshed, clearing error state')
        // Clear error state - will trigger re-render of children
        this.setState({ 
          hasError: false, 
          error: null, 
          isRecovering: false 
        })
      } else {
        console.log('[AuthErrorBoundary] Token refresh returned null')
        this.setState({ isRecovering: false })
      }
    } catch (refreshError) {
      const rawError = refreshError instanceof Error ? refreshError : new Error(String(refreshError))
      console.error('[AuthErrorBoundary] Token refresh failed (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      this.setState({ isRecovering: false })
    }
  }

  private handleRetry = () => {
    this.setState({ recoveryAttempted: false }, () => {
      this.attemptRecovery()
    })
  }

  private handleSignOut = async () => {
    try {
      // Clear auth state
      authManager.clearAuth()
      
      // Redirect to sign in
      if (typeof window !== 'undefined') {
        window.location.href = '/signin'
      }
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[AuthErrorBoundary] Sign out failed (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
    }
  }

  private handleRefreshPage = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg 
                  className="h-5 w-5 text-yellow-500" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Session Issue
              </CardTitle>
              <CardDescription>
                {this.state.isRecovering 
                  ? 'Attempting to restore your session...'
                  : 'Your session may have expired or encountered an issue.'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {this.state.isRecovering ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This can happen if you&apos;ve been inactive for a while or if there was a 
                  network issue. You can try refreshing your session or signing in again.
                </p>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col gap-2">
              {!this.state.isRecovering && (
                <>
                  <Button 
                    onClick={this.handleRetry} 
                    className="w-full"
                    variant="default"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={this.handleRefreshPage} 
                    className="w-full"
                    variant="outline"
                  >
                    Refresh Page
                  </Button>
                  <Button 
                    onClick={this.handleSignOut} 
                    className="w-full"
                    variant="ghost"
                  >
                    Sign Out
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook to trigger error boundary from within components
 */
export function useAuthErrorHandler() {
  const handleAuthError = React.useCallback((error: Error) => {
    const isAuthError = 
      error.message.includes('Session expired') ||
      error.message.includes('Not authenticated') ||
      error.message.includes('401')

    if (isAuthError) {
      // Attempt recovery first
      authManager.refreshToken().then((token) => {
        if (!token) {
          // Redirect to sign in if refresh fails
          if (typeof window !== 'undefined') {
            window.location.href = '/signin'
          }
        }
      })
    }
  }, [])

  return { handleAuthError }
}

export default AuthErrorBoundary
