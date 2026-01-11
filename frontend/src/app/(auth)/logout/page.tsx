'use client'

import { useEffect } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const { signOut } = useClerk()
  const router = useRouter()

  useEffect(() => {
    signOut({ fallbackRedirectUrl: '/' })
  }, [signOut, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Signing out...</p>
    </div>
  )
}
