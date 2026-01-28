'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/app-store'
import { useState, useTransition } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useUser, UserButton, OrganizationSwitcher, UserProfile } from '@clerk/nextjs'
import {
  Home,
  BarChart3,
  Wand2,
  Users,
  PhoneOutgoing,
  Smartphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Key,
  CreditCard,
  Building2,
  ArrowLeft,
  Mic2,
  Wrench,
  BookOpen,
  Phone,
} from 'lucide-react'

const iconMap: Record<string, any> = {
  Home,
  BarChart3,
  Wand2,
  Users,
  PhoneOutgoing,
  Smartphone,
  Settings,
  Key,
  CreditCard,
  Building2,
  Mic2,
  Wrench,
  BookOpen,
  Phone,
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUser()
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen, modalOpen } = useAppStore()
  const [, startTransition] = useTransition()
  const [clickedPath, setClickedPath] = useState<string | null>(null)
  const isSettingsView = pathname === '/settings' || pathname.startsWith('/settings/') || pathname === '/billing'

  const handleNavigation = (href: string) => {
    setClickedPath(href)
    
    if (mobileMenuOpen) {
      setMobileMenuOpen(false)
    }

    startTransition(() => {
      router.push(href)
      setTimeout(() => setClickedPath(null), 300)
    })
  }

  const handleBackToDashboard = () => {
    handleNavigation('/dashboard')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {!mobileMenuOpen && !modalOpen && (
        <Button
          variant="default"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="fixed top-2 right-2 z-[100] xl:hidden shadow-lg bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-gray-100 h-11 w-11 rounded-lg p-2.5"
        >
          <Menu className="h-6 w-6 text-white dark:text-black" strokeWidth={2} />
        </Button>
      )}

      <aside
        className={cn(
          'fixed top-0 z-[60] h-screen sidebar-modern transition-all duration-300',
          'w-72 right-0',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
          'xl:left-0 xl:right-auto xl:translate-x-0',
          sidebarCollapsed ? 'xl:w-20' : 'xl:w-72',
          modalOpen && 'hidden'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={cn(
            "flex h-16 shrink-0 items-center bg-white dark:bg-black",
            sidebarCollapsed && !mobileMenuOpen ? "justify-center px-2" : "justify-between px-6"
          )}>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <>
                <button 
                  onClick={() => handleNavigation('/dashboard')} 
                  className="flex items-center space-x-3 group cursor-pointer relative"
                >
                  <Image
                    src="/icons/Frame 1000004887.png"
                    alt="Truedy AI Logo"
                    width={150}
                    height={40}
                    className="h-10 w-auto object-contain transition-all duration-200 group-hover:opacity-80 group-active:scale-95 dark:block hidden"
                    priority
                  />
                  <Image
                    src="/icons/image2.jpg"
                    alt="Truedy AI Logo"
                    width={120}
                    height={32}
                    className="h-8 w-auto object-contain transition-all duration-200 group-hover:opacity-80 group-active:scale-95 dark:hidden block"
                    priority
                  />
                </button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="xl:hidden text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="hidden xl:flex text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </>
            )}
            
            {sidebarCollapsed && !mobileMenuOpen && (
              <button 
                onClick={() => handleNavigation('/dashboard')} 
                className="flex items-center justify-center group cursor-pointer"
              >
                <Image
                  src="/icons/image1.jpg"
                  alt="Truedy AI"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-all duration-200 group-active:scale-95"
                  priority
                />
              </button>
            )}
          </div>

          {/* Workspace Switcher - Top of Sidebar */}
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-900">
              <OrganizationSwitcher
                hidePersonal={true}
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    organizationSwitcherTrigger: "w-full justify-between px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors",
                    organizationPreview: "text-gray-900 dark:text-white",
                  },
                }}
                afterSelectOrganizationUrl="/dashboard"
                afterCreateOrganizationUrl="/dashboard"
              />
            </div>
          )}

          {/* Navigation */}
          <nav className={cn(
            "flex-1 overflow-y-auto scrollbar-hide",
            sidebarCollapsed && !mobileMenuOpen ? "px-2" : "px-6"
          )}>
            {isSettingsView ? (
              /* Settings View (Tier 2) */
              <>
                {/* Back to Dashboard */}
                <div className="mb-6">
                  <button
                    onClick={handleBackToDashboard}
                    className={cn(
                      'sidebar-nav-item w-full',
                      sidebarCollapsed && !mobileMenuOpen && 'justify-center px-2'
                    )}
                  >
                    <ArrowLeft className={cn('sidebar-icon', sidebarCollapsed && !mobileMenuOpen ? '' : 'mr-3')} />
                    {(!sidebarCollapsed || mobileMenuOpen) && <span className="transition-all">Back to Dashboard</span>}
                  </button>
                </div>

                {/* Settings Items */}
                <div className="space-y-1">
                {[
                  { title: 'API Keys', href: '/settings/api-keys', icon: 'Key' },
                  { title: 'Billing', href: '/settings/billing', icon: 'CreditCard' },
                  { title: 'Team', href: '/settings/team', icon: 'Users' },
                ].map((item) => {
                  const Icon = iconMap[item.icon]
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  const isClickedActive = clickedPath === item.href

                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          'sidebar-nav-item w-full',
                          (isActive || isClickedActive) && 'active',
                          sidebarCollapsed && !mobileMenuOpen && 'justify-center px-2'
                        )}
                      >
                        <Icon className={cn('sidebar-icon', sidebarCollapsed && !mobileMenuOpen ? '' : 'mr-3')} />
                        {(!sidebarCollapsed || mobileMenuOpen) && <span className="transition-all">{item.title}</span>}
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              /* Dashboard View (Tier 1) */
              <>
                {/* Home */}
                <div className="mb-6">
                  <button
                    onClick={() => handleNavigation('/dashboard')}
                    className={cn(
                      'sidebar-nav-item w-full',
                      (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) && 'active',
                      sidebarCollapsed && !mobileMenuOpen && 'justify-center px-2'
                    )}
                  >
                    <Home className={cn('sidebar-icon', sidebarCollapsed && !mobileMenuOpen ? '' : 'mr-3')} />
                    {(!sidebarCollapsed || mobileMenuOpen) && <span className="transition-all">Home</span>}
                  </button>
                </div>

                {/* Main Navigation Items */}
                <div className="space-y-1 mb-6">
                  {[
                    { title: 'Analytics', href: '/analytics', icon: 'BarChart3' },
                    { title: 'Agents', href: '/agents', icon: 'Wand2' },
                    { title: 'Voices', href: '/voice-cloning', icon: 'Mic2' },
                    { title: 'Knowledge Base', href: '/knowledge-base', icon: 'BookOpen' },
                    { title: 'Tools', href: '/tools', icon: 'Wrench' },
                    { title: 'Contacts', href: '/contacts', icon: 'Users' },
                    { title: 'Calls', href: '/calls', icon: 'Phone' },
                    { title: 'Outbound', href: '/campaigns', icon: 'PhoneOutgoing' },
                    { title: 'Phone Numbers', href: '/phone-numbers', icon: 'Smartphone' },
                  ].map((item) => {
                    const Icon = iconMap[item.icon]
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    const isClickedActive = clickedPath === item.href

                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          'sidebar-nav-item w-full',
                          (isActive || isClickedActive) && 'active',
                          sidebarCollapsed && !mobileMenuOpen && 'justify-center px-2'
                        )}
                      >
                        <Icon className={cn('sidebar-icon', sidebarCollapsed && !mobileMenuOpen ? '' : 'mr-3')} />
                        {(!sidebarCollapsed || mobileMenuOpen) && <span className="transition-all">{item.title}</span>}
                      </button>
                    )
                  })}
                </div>

                {/* Settings Button */}
                <div className="mb-6">
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className={cn(
                      'sidebar-nav-item w-full',
                      (pathname === '/settings' || pathname.startsWith('/settings/') || pathname === '/billing') && 'active',
                      sidebarCollapsed && !mobileMenuOpen && 'justify-center px-2'
                    )}
                  >
                    <Settings className={cn('sidebar-icon', sidebarCollapsed && !mobileMenuOpen ? '' : 'mr-3')} />
                    {(!sidebarCollapsed || mobileMenuOpen) && <span className="transition-all">Settings</span>}
                  </button>
                </div>
              </>
            )}
          </nav>

          {/* Footer - Theme Toggle & User Profile */}
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-900 space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Theme</span>
                <ThemeToggle />
              </div>

              {/* Clerk UserButton - Bottom Left */}
              <div className="flex items-center">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonTrigger: "w-full justify-start px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors",
                      userButtonPopoverCard: "bg-white dark:bg-black border-gray-200 dark:border-gray-900",
                    },
                  }}
                  showName={true}
                  afterSignOutUrl="/"
                >
                  <UserProfile.Page
                    label="Voice Settings"
                    labelIcon={<Mic2 className="h-4 w-4" />}
                    url="voice"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Voice Settings</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Voice cloning and voice settings will be available here.
                      </p>
                    </div>
                  </UserProfile.Page>
                  <UserProfile.Page
                    label="API Keys"
                    labelIcon={<Key className="h-4 w-4" />}
                    url="api-keys"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">API Keys</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage your API keys for external integrations.
                      </p>
                    </div>
                  </UserProfile.Page>
                </UserButton>
              </div>
            </div>
          )}

          {/* Collapsed Footer */}
          {(sidebarCollapsed && !mobileMenuOpen) && (
            <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-900 flex flex-col items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              
              <ThemeToggle />

              {/* Clerk UserButton - Collapsed */}
              <UserButton
                appearance={{
                  elements: {
                    userButtonTrigger: "h-10 w-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors",
                  },
                }}
                showName={false}
                afterSignOutUrl="/"
              />
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
