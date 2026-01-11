'use client'

import { useAuthClient } from '@/lib/clerk-auth-client'
import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Client component that initializes the API client with authentication
 * This should be included in the app layout to ensure API client is configured
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthClient()
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/agents',
    '/campaigns',
    '/calls',
    '/voice-cloning',
    '/analytics',
    '/contacts',
    '/settings',
    '/billing',
    '/rag',
    '/tools',
    '/phone-numbers',
    '/conversations',
  ]
  
  const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route))
  const isAuthRoute = pathname?.startsWith('/signin') || pathname?.startsWith('/signup') || pathname === '/'

  useEffect(() => {
    // Only redirect if we're fully loaded and definitely not signed in
    // Don't redirect if we're still loading or if there's any uncertainty
    if (isLoaded && !isLoading && !isSignedIn && isProtectedRoute) {
      // Prevent redirect loops - only redirect if not already on signin
      if (pathname !== '/signin' && pathname !== '/signup') {
        router.push('/signin')
      }
    }
  }, [isLoaded, isLoading, isSignedIn, isProtectedRoute, router, pathname])

  // Show loading state while checking authentication
  // Don't block rendering if we're just waiting for client_id (not critical)
  if (!isLoaded) {
    return null // Or return a loading spinner
  }

  // If on a protected route and not authenticated, don't render children
  // But only if we're definitely not signed in (not just loading client_id)
  if (isProtectedRoute && !isSignedIn && !isLoading) {
    return null
  }

  return <>{children}</>
}

