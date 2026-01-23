/**
 * Server-side Clerk authentication utilities
 * This file is server-only and should NOT be imported in client components
 */
import { auth } from '@clerk/nextjs/server'

/**
 * Server-side function to get Clerk auth and configure API client
 * Use this in server components or API routes
 */
export async function getServerAuthConfig() {
  try {
    const { userId, getToken, orgId } = await auth()
    
    if (!userId) {
      return { token: null, clientId: null, userId: null, orgId: null }
    }

    let token: string | null = null
    try {
      token = await getToken()
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[CLERK_AUTH_SERVER] Error getting Clerk token in server context (RAW ERROR)', {
        userId,
        orgId,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      return { token: null, clientId: null, userId: null, orgId: null }
    }
    
    if (!token) {
      return { token: null, clientId: null, userId: null, orgId: null }
    }

    // For now, client_id will be fetched from /auth/me endpoint
    // In the future, we can get it from organization metadata
    return { token, clientId: null, userId, orgId }
  } catch (error) {
    const rawError = error instanceof Error ? error : new Error(String(error))
    console.error('[CLERK_AUTH_SERVER] Error getting auth config (RAW ERROR)', {
      error: rawError,
      errorMessage: rawError.message,
      errorStack: rawError.stack,
      errorName: rawError.name,
      fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
    })
    return { token: null, clientId: null, userId: null, orgId: null }
  }
}

