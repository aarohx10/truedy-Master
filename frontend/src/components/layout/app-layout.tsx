'use client'

import { useEffect } from 'react'
import { useOrganization, useAuth } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'
import { useAppStore } from '@/stores/app-store'
import { cn } from '@/lib/utils'
import { Sidebar } from './sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarCollapsed, mobileMenuOpen, setMobileMenuOpen, modalOpen, setCurrentWorkspace } = useAppStore()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Client-side: redirect to select-org when signed in but no active org (avoids middleware redirect loop)
  useEffect(() => {
    if (!authLoaded || !orgLoaded) return
    if (!isSignedIn) return
    if (pathname?.startsWith('/select-org')) return
    if (!organization) {
      const redirect = pathname ? `/select-org?redirect=${encodeURIComponent(pathname)}` : '/select-org'
      router.replace(redirect)
    }
  }, [authLoaded, orgLoaded, isSignedIn, organization, pathname, router])

  // Show minimal loading while redirecting to select-org (no org)
  if (authLoaded && orgLoaded && isSignedIn && !organization) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
        <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to organization selection...</p>
      </div>
    )
  }

  // Sync Clerk organization with Zustand workspace store
  useEffect(() => {
    if (organization?.id) {
      setCurrentWorkspace({
        id: organization.id,
        name: organization.name || 'Organization',
        organizationId: organization.id,
        settings: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        credits: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  }, [organization?.id, organization?.name, organization?.slug, setCurrentWorkspace])

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
      <Sidebar />
      
      {/* Mobile/Tablet menu overlay - Universal overlay system */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[50] bg-white/50 dark:bg-black/50 backdrop-blur-[12px] xl:hidden pointer-events-auto"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300 ease-out w-full',
          // Desktop XL: adjust margin based on sidebar state (1280px+)
          // When modal is open, no margin needed
          modalOpen ? 'xl:ml-0' : (sidebarCollapsed ? 'xl:ml-16' : 'xl:ml-72'),
          // Mobile/Tablet: full width (below 1280px)
          'ml-0'
        )}
      >
        <main className="flex-1 overflow-hidden bg-white dark:bg-black">
          <div className="h-full overflow-y-auto overflow-x-hidden px-3 pb-4 pt-2 pr-[52px] sm:px-6 sm:pb-6 sm:pr-6 lg:px-8 xl:pt-[72px] xl:pb-8 xl:pr-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

