'use client'

import { useUser, useAuth, useOrganization } from '@clerk/nextjs'
import { useEffect, useState, useRef, useCallback } from 'react'
import { apiClient } from './api'
import { authManager } from './auth-manager'
import { debugLogger } from './debug-logger'

/**
 * Hook to initialize API client with Clerk token and client_id
 * This replaces the NextAuth useAuthClient hook
 * 
 * NOTE: This hook does NOT handle redirects. Route protection is handled by
 * Clerk middleware at the edge level. This hook only manages the API client
 * token and client_id state.
 * 
 * ARCHITECTURE:
 * - AuthManager singleton is the single source of truth for token/clientId
 * - This hook syncs Clerk state to AuthManager
 * - apiClient reads from AuthManager
 */

// ============================================================
// Global fetch lock to prevent multiple concurrent /auth/me calls
// ============================================================
let globalClientIdFetchPromise: Promise<string | null> | null = null
let globalClientIdFetchTime = 0
const CLIENT_ID_CACHE_TTL = 60000 // 60 seconds cache

/**
 * Fetch client_id from API with global locking to prevent duplicate calls
 */
async function fetchClientIdFromAPI(token: string): Promise<string | null> {
  // Check if we have a cached client_id in authManager
  const cachedClientId = authManager.getClientId()
  if (cachedClientId) {
    // Only use cache if we've successfully fetched from API before (globalClientIdFetchTime > 0)
    // AND the cache is still fresh
    if (globalClientIdFetchTime > 0) {
      const cacheAge = Date.now() - globalClientIdFetchTime
      if (cacheAge < CLIENT_ID_CACHE_TTL) {
        debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Using cached client_id', { clientId: cachedClientId })
        return cachedClientId
      }
    }
    // If globalClientIdFetchTime is 0, it means we've never fetched from API
    // The cached client_id might be from org metadata, so we should still fetch to verify
  }
  
  // If there's already a fetch in progress, wait for it
  if (globalClientIdFetchPromise) {
    debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Waiting for existing client_id fetch')
    return globalClientIdFetchPromise
  }
  
  // Start new fetch
  debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Fetching client_id from API /auth/me')
  globalClientIdFetchPromise = (async () => {
    try {
      // Set token before making API call so it can authenticate
      authManager.setAuth(token, null)
      apiClient.setToken(token)
      
      const response = await apiClient.get('/auth/me')
      const userData = response.data as any
      
      if (userData?.client_id) {
        const fetchedClientId = userData.client_id
        debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Client ID fetched from API', {
          clientId: fetchedClientId,
        })
        globalClientIdFetchTime = Date.now()
        authManager.setAuth(token, fetchedClientId)
        return fetchedClientId
      }
      return null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      debugLogger.logError('CLIENT_ID_LOOKUP', error instanceof Error ? error : new Error(errorMessage), {
        endpoint: '/auth/me',
      })
      
      // Check if it's a network/CORS error (not auth error)
      const isNetworkError = errorMessage.includes('CORS') || 
                             errorMessage.includes('Failed to fetch') || 
                             errorMessage.includes('network') ||
                             errorMessage.includes('ERR_FAILED')
      
      if (isNetworkError) {
        debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Network error - continuing without client_id', {
          error: errorMessage,
        })
        console.warn('[useAuthClient] Network error fetching client_id:', errorMessage)
      } else {
        console.error('[useAuthClient] Failed to fetch client_id:', error)
      }
      return null
    } finally {
      // Clear the promise after completion
      globalClientIdFetchPromise = null
    }
  })()
  
  return globalClientIdFetchPromise
}

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
      console.error('[useAuthClient] Failed to get Clerk token:', error)
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
          console.error('[useAuthClient] Failed to refresh token on visibility change:', error)
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
  
  // Main auth setup effect
  useEffect(() => {
    const currentSetupId = ++setupIdRef.current
    
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
      return
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
        hasFetchedClientIdRef.current = false
      } else if (!wasSignedIn) {
        debugLogger.logAuth('AUTH_STATE', 'User not authenticated')
      } else {
        debugLogger.logAuth('AUTH_STATE', 'Auth state temporarily false, may be refreshing')
      }
      setIsLoading(false)
      return
    }

    // Prevent concurrent setup calls
    if (isSettingUpRef.current) {
      debugLogger.logAuth('AUTH_SETUP', 'Setup already in progress, skipping')
      return
    }

    // User is authenticated - set up token and client_id
    const setupAuth = async () => {
      // Check if this setup is still current
      if (currentSetupId !== setupIdRef.current) {
        debugLogger.logAuth('AUTH_SETUP', 'Stale setup, aborting', { currentSetupId, latestId: setupIdRef.current })
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
            setIsLoading(false)
            isSettingUpRef.current = false
            return
          }
        }
        
        if (!token) {
          debugLogger.logAuth('TOKEN_GET', 'Token is null, user may need to re-authenticate')
          console.warn('[useAuthClient] Clerk token is null')
          setIsLoading(false)
          isSettingUpRef.current = false
          return
        }
        
        // Check if still current after async operation
        if (currentSetupId !== setupIdRef.current) {
          debugLogger.logAuth('AUTH_SETUP', 'Setup became stale, aborting')
          isSettingUpRef.current = false
          return
        }

        // Get client_id from organization metadata or API
        let extractedClientId: string | null = authManager.getClientId()

        // Check organization metadata for client_id first
        if (organization) {
          debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Checking organization metadata for client_id', {
            orgId: organization.id,
          })
          const orgMetadata = organization.publicMetadata as any
          const orgClientId = orgMetadata?.client_id || null
          
          if (orgClientId) {
            debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Client ID found in organization metadata', {
              clientId: orgClientId,
            })
            extractedClientId = orgClientId
          } else {
            debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Client ID not found in organization metadata')
          }
        }

        // If no client_id from org, fetch from API using global fetch lock
        if (!extractedClientId) {
          // Use global fetch lock to prevent duplicate calls
          extractedClientId = await fetchClientIdFromAPI(token)
        }
        
        // Check if still current after async operations
        if (currentSetupId !== setupIdRef.current) {
          debugLogger.logAuth('AUTH_SETUP', 'Setup became stale after fetching clientId, aborting')
          isSettingUpRef.current = false
          return
        }

        // Set final auth state
        authManager.setAuth(token, extractedClientId)
        apiClient.setToken(token)
        if (extractedClientId) {
          apiClient.setClientId(extractedClientId)
        }
        setClientId(extractedClientId)
        setIsLoading(false)
        
        debugLogger.logAuth('AUTH_SETUP', 'Auth setup complete', {
          hasToken: true,
          clientId: extractedClientId,
          setupId: currentSetupId,
        })
      } catch (error) {
        console.error('[useAuthClient] Error setting up auth:', error)
        setIsLoading(false)
      } finally {
        isSettingUpRef.current = false
      }
    }

    setupAuth()
  }, [user, userLoaded, isSignedIn, getToken, organization])

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
    clientId,
    organization,
    // Expose refresh function for manual refresh if needed
    refreshToken: () => authManager.refreshToken(),
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
