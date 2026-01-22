'use client'

import { useAuthClient } from '@/lib/clerk-auth-client'
import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { logger } from '@/lib/logger'

/**
 * Client component that initializes the API client with authentication
 * This should be included in the app layout to ensure API client is configured
 * 
 * NOTE: Route protection is handled by Clerk middleware at the edge level.
 * This component only handles API client initialization and page view logging.
 * Do NOT add redirect logic here - it causes race conditions with the middleware.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize the auth client (sets up API token)
  useAuthClient()
  const { isLoaded } = useAuth()
  const pathname = usePathname()

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

