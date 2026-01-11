'use client'

import { useUser, useAuth, useOrganization } from '@clerk/nextjs'
import { useEffect, useState, useRef } from 'react'
import { apiClient } from './api'
import { debugLogger } from './debug-logger'

// Global cache for clientId to prevent duplicate fetches
let cachedClientId: string | null = null
let isFetchingClientId = false
const clientIdPromise: { current: Promise<string | null> | null } = { current: null }

/**
 * Hook to initialize API client with Clerk token and client_id
 * This replaces the NextAuth useAuthClient hook
 */
export function useAuthClient() {
  const { user, isLoaded: userLoaded } = useUser()
  const { getToken, isSignedIn } = useAuth()
  const { organization } = useOrganization()
  const [clientId, setClientId] = useState<string | null>(cachedClientId)
  const [isLoading, setIsLoading] = useState(true)
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    debugLogger.logAuth('AUTH_STATE', 'Auth state check', {
      userLoaded,
      isSignedIn,
      hasUser: !!user,
    })

    if (!userLoaded) {
      setIsLoading(true)
      debugLogger.logAuth('AUTH_STATE', 'User not loaded yet, waiting...')
      return
    }

    if (!isSignedIn || !user) {
      // Not authenticated - clear everything
      debugLogger.logAuth('AUTH_STATE', 'User not authenticated, clearing tokens')
      apiClient.clearToken()
      setClientId(null)
      cachedClientId = null
      hasFetchedRef.current = false
      setIsLoading(false)
      return
    }

    // User is authenticated - set up token and client_id
    const setupAuth = async () => {
      debugLogger.logAuth('AUTH_SETUP', 'Starting auth setup', {
        userId: user.id,
        hasOrganization: !!organization,
      })
      
      try {
        // Get Clerk session token with retry logic
        let token: string | null = null
        try {
          debugLogger.logAuth('TOKEN_GET', 'Getting Clerk token')
          token = await getToken()
          debugLogger.logAuth('TOKEN_GET', 'Clerk token retrieved', {
            tokenLength: token?.length || 0,
          })
        } catch (tokenError) {
          debugLogger.logError('TOKEN_GET', tokenError instanceof Error ? tokenError : new Error(String(tokenError)))
          console.error('Error getting Clerk token:', tokenError)
          // Try to refresh and get token again
          try {
            debugLogger.logAuth('TOKEN_GET', 'Retrying token retrieval after 500ms')
            // Clerk automatically refreshes tokens, so we can retry once
            await new Promise(resolve => setTimeout(resolve, 500))
            token = await getToken()
            debugLogger.logAuth('TOKEN_GET', 'Token retrieved on retry', {
              tokenLength: token?.length || 0,
            })
          } catch (retryError) {
            debugLogger.logError('TOKEN_GET', retryError instanceof Error ? retryError : new Error(String(retryError)), {
              attempt: 'retry',
            })
            console.error('Failed to get token after retry:', retryError)
            setIsLoading(false)
            return
          }
        }
        
        if (!token) {
          debugLogger.logAuth('TOKEN_GET', 'Token is null, user may need to re-authenticate')
          console.warn('Clerk token is null, user may need to re-authenticate')
          setIsLoading(false)
          return
        }
        
        apiClient.setToken(token)

        // Try to get client_id from organization metadata or fetch from API
        let extractedClientId: string | null = null

        // Check organization metadata for client_id
        if (organization) {
          debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Checking organization metadata for client_id', {
            orgId: organization.id,
          })
          const orgMetadata = organization.publicMetadata as any
          extractedClientId = orgMetadata?.client_id || null
          
          if (extractedClientId) {
            debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Client ID found in organization metadata', {
              clientId: extractedClientId,
            })
            apiClient.setClientId(extractedClientId)
            setClientId(extractedClientId)
            cachedClientId = extractedClientId
            setIsLoading(false)
            return
          } else {
            debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Client ID not found in organization metadata')
          }
        }

        // If no client_id from org, fetch from API
        if (!extractedClientId && !cachedClientId && !hasFetchedRef.current) {
          hasFetchedRef.current = true
          
          if (!isFetchingClientId) {
            isFetchingClientId = true
            debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Fetching client_id from API /auth/me')
            
            // Create a single promise for all concurrent requests
            if (!clientIdPromise.current) {
              clientIdPromise.current = apiClient.get('/auth/me')
                .then((response) => {
                  const userData = response.data as any
                  if (userData?.client_id) {
                    debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Client ID fetched from API', {
                      clientId: userData.client_id,
                    })
                    cachedClientId = userData.client_id
                    apiClient.setClientId(userData.client_id)
                    return userData.client_id
                  }
                  return null
                })
                .catch(async (error) => {
                  const errorMessage = error instanceof Error ? error.message : String(error)
                  debugLogger.logError('CLIENT_ID_LOOKUP', error instanceof Error ? error : new Error(errorMessage), {
                    endpoint: '/auth/me',
                  })
                  
                  // Check if it's a CORS/network error (not an auth error)
                  const isCorsError = errorMessage.includes('CORS') || 
                                     errorMessage.includes('Failed to fetch') || 
                                     errorMessage.includes('network') ||
                                     errorMessage.includes('ERR_FAILED')
                  
                  // If it's a CORS/network error, don't treat it as auth failure
                  // Just log it and continue - user can still use the app
                  if (isCorsError) {
                    debugLogger.logAuth('CLIENT_ID_LOOKUP', 'CORS/Network error - continuing without client_id', {
                      error: errorMessage,
                    })
                    console.warn('CORS error fetching client_id - continuing without it:', errorMessage)
                    // Return null but don't fail - user is still authenticated via Clerk
                    return null
                  }
                  
                  // If 401/403, token might be expired - try to refresh
                  if (errorMessage?.includes('401') || errorMessage?.includes('403')) {
                    debugLogger.logAuth('TOKEN_REFRESH', 'Token expired, attempting refresh')
                    try {
                      // Get fresh token
                      const freshToken = await getToken({ template: undefined })
                      if (freshToken) {
                        debugLogger.logAuth('TOKEN_REFRESH', 'Token refreshed, retrying /auth/me')
                        apiClient.setToken(freshToken)
                        // Retry the request once
                        const retryResponse = await apiClient.get('/auth/me')
                        const retryUserData = retryResponse.data as any
                        if (retryUserData?.client_id) {
                          debugLogger.logAuth('CLIENT_ID_LOOKUP', 'Client ID fetched after token refresh', {
                            clientId: retryUserData.client_id,
                          })
                          cachedClientId = retryUserData.client_id
                          apiClient.setClientId(retryUserData.client_id)
                          return retryUserData.client_id
                        }
                      }
                    } catch (retryError) {
                      debugLogger.logError('TOKEN_REFRESH', retryError instanceof Error ? retryError : new Error(String(retryError)))
                      console.error('Retry after token refresh failed:', retryError)
                    }
                  }
                  
                  // For other errors, return null but don't fail auth
                  return null
                })
                .finally(() => {
                  isFetchingClientId = false
                  // Clear promise after 100ms to allow state updates
                  setTimeout(() => {
                    clientIdPromise.current = null
                  }, 100)
                })
            }
            
            // Wait for the shared promise
            clientIdPromise.current.then((id) => {
              if (id) {
                setClientId(id)
              }
              setIsLoading(false)
            })
          }
        } else if (cachedClientId) {
          // Use cached clientId
          setClientId(cachedClientId)
          apiClient.setClientId(cachedClientId)
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error setting up auth:', error)
        setIsLoading(false)
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
    clientId,
    organization,
  }
}

// Export function to get clientId for use in React Query keys
export function useClientId(): string | null {
  const { clientId } = useAuthClient()
  return clientId
}

