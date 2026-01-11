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
        console.error('Error creating organization:', error)
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

