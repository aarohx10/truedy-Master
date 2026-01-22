'use client'

import { SignIn, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SignInPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  // If user is already signed in, redirect to dashboard immediately
  // This prevents the redirect loop where user lands on signin while authenticated
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/dashboard')
    }
  }, [isLoaded, isSignedIn, router])

  // Don't render SignIn component if user is already signed in
  // This prevents Clerk from also trying to redirect
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  if (isSignedIn) {
    // Already redirecting in useEffect, just show loading
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-gray-500">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn 
        routing="path"
        path="/signin"
        signUpUrl="/signup"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  )
}

