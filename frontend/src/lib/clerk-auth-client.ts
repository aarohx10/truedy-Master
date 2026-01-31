'use client'

import { useUser, useAuth, useOrganization } from '@clerk/nextjs'
import { useEffect, useState, useRef, useCallback } from 'react'
import { apiClient } from './api'
import { authManager } from './auth-manager'
import { debugLogger } from './debug-logger'

/**
 * Hook to initialize API client with Clerk token and org scope.
 * Backend extracts org_id from JWT; no client_id lookup from API.
 *
 * ARCHITECTURE:
 * - AuthManager is the single source of truth for token (and optional clientId from org metadata)
 * - apiClient sends only JWT; backend uses Clerk JWT for org_id
 */

export function useAuthClient() {
  const { user, isLoaded: userLoaded } = useUser()
  const { getToken, isSignedIn } = useAuth()
  const { organization } = useOrganization()
  const [clientId, setClientId] = useState<string | null>(authManager.getClientId())
  const [isLoading, setIsLoading] = useState(true)
  
      // Refs to prevent race conditions
      const isSettingUpRef = useRef(false)
      const setupIdRef = useRef(0)
      const wasSignedInRef = useRef(false)
  
  // Memoized getToken wrapper to pass to authManager
  const getClerkToken = useCallback(async (): Promise<string | null> => {
    try {
      return await getToken()
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[CLERK_AUTH_CLIENT] Failed to get Clerk token (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      return null
    }
  }, [getToken])
  
  // Set up authManager's getToken function
  useEffect(() => {
    authManager.setGetTokenFn(getClerkToken)
  }, [getClerkToken])
  
  // Visibility change handler - refresh token when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isSignedIn && user) {
        debugLogger.logAuth('VISIBILITY_CHANGE', 'Tab became visible, refreshing token')
        try {
          const freshToken = await getToken()
          if (freshToken) {
            authManager.setAuth(freshToken, authManager.getClientId())
          }
        } catch (error) {
          const rawError = error instanceof Error ? error : new Error(String(error))
          console.error('[CLERK_AUTH_CLIENT] Failed to refresh token on visibility change (RAW ERROR)', {
            error: rawError,
            errorMessage: rawError.message,
            errorStack: rawError.stack,
            errorName: rawError.name,
            fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
          })
        }
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [getToken, isSignedIn, user])
  
  // Subscribe to authManager token changes
  useEffect(() => {
    const unsubscribe = authManager.onTokenChange((token) => {
      if (token === null) {
        setClientId(null)
      }
    })
    return unsubscribe
  }, [])

  // Sync clientId from org metadata when org or metadata changes (no API lookup)
  useEffect(() => {
    if (!organization || !isSignedIn || !user) return
    const orgMetadata = organization.publicMetadata as Record<string, unknown>
    const orgClientId = (orgMetadata?.client_id as string) || null
    if (orgClientId !== clientId) {
      getToken().then(token => {
        if (token) {
          authManager.setAuth(token, orgClientId)
          setClientId(orgClientId)
        }
      })
    }
  }, [organization?.id, organization?.publicMetadata, clientId, isSignedIn, user, getToken])
  
  // Main auth setup effect
  useEffect(() => {
    const currentSetupId = ++setupIdRef.current
    let isMounted = true // Track if component is still mounted
    
    debugLogger.logAuth('AUTH_STATE', 'Auth state check', {
      userLoaded,
      isSignedIn,
      hasUser: !!user,
      isRefreshing: authManager.isRefreshing,
      setupId: currentSetupId,
    })

    if (!userLoaded) {
      setIsLoading(true)
      debugLogger.logAuth('AUTH_STATE', 'User not loaded yet, waiting...')
      return () => {
        isMounted = false
      }
    }

    // Track previous signed-in state
    const wasSignedIn = wasSignedInRef.current
    wasSignedInRef.current = !!isSignedIn

    if (!isSignedIn || !user) {
      // Only clear tokens if we were previously signed in and are now signed out
      // Don't clear during token refresh operations
      if (wasSignedIn && !authManager.isRefreshing) {
        debugLogger.logAuth('AUTH_STATE', 'User signed out, clearing auth')
        authManager.clearAuth()
        apiClient.clearToken()
        setClientId(null)
      } else if (!wasSignedIn) {
        debugLogger.logAuth('AUTH_STATE', 'User not authenticated')
      } else {
        debugLogger.logAuth('AUTH_STATE', 'Auth state temporarily false, may be refreshing')
      }
      setIsLoading(false)
      return () => {
        isMounted = false
      }
    }

    // Prevent concurrent setup calls
    if (isSettingUpRef.current) {
      debugLogger.logAuth('AUTH_SETUP', 'Setup already in progress, skipping')
      return
    }

    // User is authenticated - set up token and client_id
    const setupAuth = async () => {
      // Check if component is still mounted and setup is still current
      if (!isMounted || currentSetupId !== setupIdRef.current) {
        debugLogger.logAuth('AUTH_SETUP', 'Stale setup or unmounted, aborting', { 
          currentSetupId, 
          latestId: setupIdRef.current,
          isMounted 
        })
        return
      }
      
      isSettingUpRef.current = true
      
      debugLogger.logAuth('AUTH_SETUP', 'Starting auth setup', {
        userId: user.id,
        hasOrganization: !!organization,
        setupId: currentSetupId,
      })
      
      try {
        // Get Clerk session token
        let token: string | null = null
        try {
          debugLogger.logAuth('TOKEN_GET', 'Getting Clerk token')
          token = await getToken()
          debugLogger.logAuth('TOKEN_GET', 'Clerk token retrieved', {
            tokenLength: token?.length || 0,
          })
        } catch (tokenError) {
          debugLogger.logError('TOKEN_GET', tokenError instanceof Error ? tokenError : new Error(String(tokenError)))
          console.error('[useAuthClient] Error getting Clerk token:', tokenError)
          
          // Retry once after a short delay
          try {
            debugLogger.logAuth('TOKEN_GET', 'Retrying token retrieval after 500ms')
            await new Promise(resolve => setTimeout(resolve, 500))
            token = await getToken()
            debugLogger.logAuth('TOKEN_GET', 'Token retrieved on retry', {
              tokenLength: token?.length || 0,
            })
          } catch (retryError) {
            debugLogger.logError('TOKEN_GET', retryError instanceof Error ? retryError : new Error(String(retryError)), {
              attempt: 'retry',
            })
            console.error('[useAuthClient] Failed to get token after retry:', retryError)
            if (isMounted) {
              setIsLoading(false)
            }
            isSettingUpRef.current = false
            return
          }
        }
        
        if (!token) {
          debugLogger.logAuth('TOKEN_GET', 'Token is null, user may need to re-authenticate')
          console.warn('[useAuthClient] Clerk token is null')
          if (isMounted) {
            setIsLoading(false)
          }
          isSettingUpRef.current = false
          return
        }
        
        // Check if component is still mounted and setup is still current
        if (!isMounted || currentSetupId !== setupIdRef.current) {
          debugLogger.logAuth('AUTH_SETUP', 'Setup became stale or unmounted, aborting', {
            currentSetupId,
            latestId: setupIdRef.current,
            isMounted
          })
          isSettingUpRef.current = false
          return
        }

        // Org scope: use only org metadata for clientId (backend uses JWT org_id; no API lookup)
        let extractedClientId: string | null = null
        if (organization) {
          const orgMetadata = organization.publicMetadata as Record<string, unknown>
          extractedClientId = (orgMetadata?.client_id as string) || null
        }

        // Set final auth state (only if still mounted)
        if (isMounted) {
          authManager.setAuth(token, extractedClientId)
          apiClient.setToken(token)
          setClientId(extractedClientId)
          setIsLoading(false)
          
          debugLogger.logAuth('AUTH_SETUP', 'Auth setup complete', {
            hasToken: true,
            clientId: extractedClientId,
            setupId: currentSetupId,
          })
        }
      } catch (error) {
        console.error('[useAuthClient] Error setting up auth:', error)
        if (isMounted) {
          setIsLoading(false)
        }
      } finally {
        if (isMounted) {
          isSettingUpRef.current = false
        }
      }
    }

    setupAuth()
    
    // Cleanup function to mark component as unmounted
    return () => {
      isMounted = false
    }
  }, [user, userLoaded, isSignedIn, getToken, organization])

  // Get orgId (organization-first approach)
  const orgId = organization?.id || null
  
  return { 
    user: user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      name: user.fullName || user.firstName || user.lastName || '',
      imageUrl: user.imageUrl || '',
      organization: organization ? {
        id: organization.id,
        name: organization.name || '',
        slug: organization.slug || '',
      } : null,
    } : null,
    isLoading,
    hasToken: authManager.hasToken(), // Indicates if authManager has a valid token
    clientId, // Keep for billing endpoints only
    orgId, // CRITICAL: Organization ID for main app features (organization-first approach)
    organization,
    refreshToken: () => authManager.refreshToken(),
    getToken: getClerkToken,
  }
}

// Export function to get clientId for use in React Query keys
export function useClientId(): string | null {
  const { clientId } = useAuthClient()
  return clientId
}

// Export a hook to subscribe to auth ready state
export function useAuthReady(): boolean {
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    let mounted = true
    
    authManager.waitForAuth(10000).then((ready) => {
      if (mounted) {
        setIsReady(ready)
      }
    })
    
    return () => {
      mounted = false
    }
  }, [])
  
  return isReady
}
