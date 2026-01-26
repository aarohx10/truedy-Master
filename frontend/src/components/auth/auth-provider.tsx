'use client'

import { useAuthClient } from '@/lib/clerk-auth-client'
import { useAuth, useOrganizationList, useUser } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'

/**
 * Client component that initializes the API client with authentication
 * This should be included in the app layout to ensure API client is configured
 * 
 * NOTE: Route protection is handled by Clerk middleware at the edge level.
 * This component only handles API client initialization and page view logging.
 * Do NOT add redirect logic here - it causes race conditions with the middleware.
 * 
 * ENHANCED: Automatic workspace creation - ensures user always has an organization
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize the auth client (sets up API token)
  useAuthClient()
  const { isLoaded, isSignedIn } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const { createOrganization, isLoaded: orgListLoaded } = useOrganizationList()
  const pathname = usePathname()
  const router = useRouter()
  const orgCreationAttempted = useRef(false)

  // Automatic workspace creation - if user has no organization, create one
  useEffect(() => {
    const ensureOrganization = async () => {
      // Only run if all auth data is loaded and user is signed in
      if (!isLoaded || !userLoaded || !orgListLoaded || !isSignedIn || !user || !createOrganization) {
        return
      }

      // Prevent multiple attempts
      if (orgCreationAttempted.current) {
        return
      }

      try {
        // Check if user has organizations
        const orgs = await user.organizationMemberships
        if (orgs && orgs.length > 0) {
          // User has org(s), nothing to do
          return
        }

        // User has no organization - create "Personal Workspace"
        orgCreationAttempted.current = true
        const orgName = user.fullName 
          ? `${user.fullName}'s Workspace`
          : user.primaryEmailAddress?.emailAddress?.split('@')[0] 
            ? `${user.primaryEmailAddress.emailAddress.split('@')[0]}'s Workspace`
            : 'My Workspace'
        
        console.log('[AUTH_PROVIDER] Creating automatic workspace for user:', user.id)
        const org = await createOrganization({ name: orgName })
        
        if (org) {
          console.log('[AUTH_PROVIDER] Workspace created successfully:', org.id)
          // The /auth/me endpoint will sync the org with database on next API call
          // No need to redirect - Clerk will handle the org context
        }
      } catch (error) {
        const rawError = error instanceof Error ? error : new Error(String(error))
        console.error('[AUTH_PROVIDER] Failed to create automatic workspace (RAW ERROR)', {
          userId: user?.id,
          error: rawError,
          errorMessage: rawError.message,
          errorStack: rawError.stack,
        })
        // Don't block the app - user can create org manually later
        orgCreationAttempted.current = false // Allow retry
      }
    }

    if (isLoaded && userLoaded && orgListLoaded && isSignedIn && user && createOrganization) {
      ensureOrganization()
    }
  }, [isLoaded, userLoaded, orgListLoaded, isSignedIn, user, createOrganization])

  useEffect(() => {
    // Log page view
    if (pathname) {
      logger.logPageView(pathname)
    }
  }, [pathname])

  // Show a minimal loading state while Clerk initializes
  // This prevents flash of content before auth state is known
  if (!isLoaded) {
    return null
  }

  // Always render children - let Clerk middleware handle protection
  // The middleware runs at edge level and handles redirects properly
  return <>{children}</>
}

