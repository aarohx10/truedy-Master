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
let lastOrgId: string | null = null // Track last organization ID to invalidate cache on change
const CLIENT_ID_CACHE_TTL = 60000 // 60 seconds cache

/**
 * Fetch client_id from API with global locking to prevent duplicate calls
 */
async function fetchClientIdFromAPI(token: string, currentOrgId?: string | null): Promise<string | null> {
  // Invalidate cache if organization changed
  if (currentOrgId && lastOrgId && currentOrgId !== lastOrgId) {
    debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Organization changed, invalidating cache', {
      oldOrgId: lastOrgId,
      newOrgId: currentOrgId,
    })
    globalClientIdFetchPromise = null
    globalClientIdFetchTime = 0
  }
  lastOrgId = currentOrgId || null

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
      const rawError = error instanceof Error ? error : new Error(String(error))
      const errorMessage = rawError.message || String(error)
      
      console.error('[CLERK_AUTH_CLIENT] Failed to fetch client_id (RAW ERROR)', {
        endpoint: '/auth/me',
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      
      debugLogger.logError('CLIENT_ID_LOOKUP', rawError, {
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
        console.warn('[CLERK_AUTH_CLIENT] Network error fetching client_id:', errorMessage)
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
      const hasFetchedClientIdRef = useRef(false)
  
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

  // Watch for organization changes and refresh client_id
  useEffect(() => {
    if (!organization || !isSignedIn || !user) return

    const orgId = organization.id
    const orgMetadata = organization.publicMetadata as any
    const orgClientId = orgMetadata?.client_id || null

    debugLogger.logAuth('ORG_CHANGE_CHECK', 'Checking organization for client_id changes', {
      orgId,
      orgClientId,
      currentClientId: clientId,
    })

    // If organization changed or client_id not in metadata, refresh
    if (orgClientId && orgClientId !== clientId) {
      debugLogger.logAuth('ORG_CHANGE', 'Organization client_id changed, refreshing', {
        orgId,
        oldClientId: clientId,
        newClientId: orgClientId,
      })

      // Clear cache to force fresh fetch
      globalClientIdFetchPromise = null
      globalClientIdFetchTime = 0
      lastOrgId = orgId

      // Refetch client_id from API to ensure consistency
      getToken().then(token => {
        if (token) {
          fetchClientIdFromAPI(token, organization.id).then(newClientId => {
            if (newClientId) {
              authManager.setAuth(token, newClientId)
              apiClient.setClientId(newClientId)
              setClientId(newClientId)
              debugLogger.logAuth('ORG_CHANGE', 'Client ID refreshed after org change', {
                orgId,
                newClientId,
              })
            }
          }).catch(error => {
            debugLogger.logError('ORG_CHANGE', error instanceof Error ? error : new Error(String(error)))
          })
        }
      })
    } else if (orgId && orgId !== lastOrgId) {
      // Organization ID changed but metadata doesn't have client_id yet
      // Clear cache and force refresh
      debugLogger.logAuth('ORG_CHANGE', 'Organization ID changed, clearing cache', {
        oldOrgId: lastOrgId,
        newOrgId: orgId,
      })
      globalClientIdFetchPromise = null
      globalClientIdFetchTime = 0
      lastOrgId = orgId
      
      // Refetch to get updated client_id
      getToken().then(token => {
        if (token) {
          fetchClientIdFromAPI(token, orgId).then(newClientId => {
            if (newClientId) {
              authManager.setAuth(token, newClientId)
              apiClient.setClientId(newClientId)
              setClientId(newClientId)
            }
          })
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
        // Reset the ref - safe to access since we're in the hook's scope
        if (isMounted) {
          hasFetchedClientIdRef.current = false
        }
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
          // Pass organization.id to invalidate cache if org changes
          extractedClientId = await fetchClientIdFromAPI(token, organization?.id)
          if (extractedClientId && isMounted) {
            hasFetchedClientIdRef.current = true
          }
        } else if (isMounted) {
          // Client ID came from org metadata, mark as fetched
          hasFetchedClientIdRef.current = true
        }
        
        // Check if component is still mounted and setup is still current after async operations
        if (!isMounted || currentSetupId !== setupIdRef.current) {
          debugLogger.logAuth('AUTH_SETUP', 'Setup became stale or unmounted after fetching clientId, aborting', {
            currentSetupId,
            latestId: setupIdRef.current,
            isMounted
          })
          isSettingUpRef.current = false
          return
        }

        // Set final auth state (only if still mounted)
        if (isMounted) {
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

  // Subscribe to organization metadata changes for real-time updates
  useEffect(() => {
    if (!organization || !isSignedIn || !user) return

    // Check for metadata changes periodically (Clerk doesn't provide real-time subscription)
    // The main detection is via the useEffect watching organization.id above
    // This is a fallback to catch metadata updates
    const checkOrgMetadata = () => {
      const orgMetadata = organization.publicMetadata as any
      const orgClientId = orgMetadata?.client_id || null
      
      if (orgClientId && orgClientId !== clientId) {
        debugLogger.logAuth('ORG_METADATA_CHANGE', 'Organization metadata updated, refreshing client_id', {
          orgId: organization.id,
          newClientId: orgClientId,
          currentClientId: clientId,
        })
        
        // Clear cache and refresh
        globalClientIdFetchPromise = null
        globalClientIdFetchTime = 0
        lastOrgId = organization.id
        
        // Trigger refresh
        getToken().then(token => {
          if (token) {
            fetchClientIdFromAPI(token, organization.id).then(newClientId => {
              if (newClientId) {
                authManager.setAuth(token, newClientId)
                apiClient.setClientId(newClientId)
                setClientId(newClientId)
              }
            })
          }
        })
      }
    }

    // Check immediately
    checkOrgMetadata()
    
    // Set up interval to check for metadata changes (every 5 seconds)
    // This catches cases where metadata is updated but organization.id doesn't change
    const intervalId = setInterval(checkOrgMetadata, 5000)
    
    return () => clearInterval(intervalId)
  }, [organization?.id, organization?.publicMetadata, clientId, isSignedIn, user, getToken])

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
    refreshToken: () => {
      // Clear cache and force refresh
      globalClientIdFetchPromise = null
      globalClientIdFetchTime = 0
      lastOrgId = null
      authManager.refreshToken()
    },
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
