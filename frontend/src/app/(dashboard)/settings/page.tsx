'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to API Keys page by default
    router.replace('/settings/api-keys')
  }, [router])

  return null
}
