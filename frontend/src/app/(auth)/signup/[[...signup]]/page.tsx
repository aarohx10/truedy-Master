'use client'

import { SignUp } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useUser, useOrganizationList } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const { user, isLoaded: userLoaded } = useUser()
  const { createOrganization } = useOrganizationList()
  const router = useRouter()

  // Auto-create organization on first signup
  useEffect(() => {
    const createOrgIfNeeded = async () => {
      if (!userLoaded || !user || !createOrganization) return

      try {
        // Check if user already has organizations
        const orgs = await user.organizationMemberships
        if (orgs && orgs.length > 0) {
          // User already has an org, redirect to dashboard
          router.push('/dashboard')
          return
        }

        // Create organization for new user
        const orgName = user.fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'My Organization'
        const org = await createOrganization({ name: orgName })
        
        if (org) {
          // Organization created, redirect to dashboard
          // The /auth/me endpoint will sync the org with database
          router.push('/dashboard')
        }
      } catch (error) {
        const rawError = error instanceof Error ? error : new Error(String(error))
        console.error('[SIGNUP_PAGE] Error creating organization (RAW ERROR)', {
          userId: user?.id,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          error: rawError,
          errorMessage: rawError.message,
          errorStack: rawError.stack,
          errorName: rawError.name,
          errorCause: (rawError as any).cause,
          fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
        })
        // Continue to dashboard anyway - org can be created later
        router.push('/dashboard')
      }
    }

    // Only run if user just signed up (no orgs yet)
    if (userLoaded && user && createOrganization) {
      createOrgIfNeeded()
    }
  }, [user, userLoaded, createOrganization, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp 
        routing="path"
        path="/signup"
        signInUrl="/signin"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
      />
    </div>
  )
}

