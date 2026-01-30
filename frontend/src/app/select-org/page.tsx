'use client'

import { useOrganizationList, useOrganization, useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Building2, Plus, Loader2 } from 'lucide-react'

export default function SelectOrgPage() {
  const { organizationList, isLoaded: orgListLoaded, setActive, createOrganization } = useOrganizationList()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/dashboard'
  const [isCreating, setIsCreating] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const hasRedirectedRef = useRef(false)
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const createInProgressRef = useRef(false)

  // When user already has an active org (e.g. landed here from bookmark), redirect once
  useEffect(() => {
    if (hasRedirectedRef.current || isCreating) return
    if (!orgLoaded || !organization || !orgListLoaded) return

    hasRedirectedRef.current = true
    if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
    redirectTimeoutRef.current = setTimeout(() => {
      window.location.replace(redirectUrl)
    }, 400)

    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
    }
  }, [orgLoaded, organization, redirectUrl, isCreating, orgListLoaded])

  const handleSelectOrg = async (orgId: string) => {
    try {
      hasRedirectedRef.current = true
      await setActive({ organization: orgId })
      await new Promise((r) => setTimeout(r, 400))
      window.location.replace(redirectUrl)
    } catch (error) {
      console.error('[SELECT_ORG] Failed to set active organization:', error)
      hasRedirectedRef.current = false
    }
  }

  // Handle organization creation programmatically (bypasses invite screen)
  const handleCreateOrg = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!createOrganization || isCreating || createInProgressRef.current) {
      return
    }

    // Use provided name or default
    const finalOrgName = orgName.trim() || (user?.fullName ? `${user.fullName}'s Organization` : 'My Organization')

    createInProgressRef.current = true
    setIsCreating(true)
    hasRedirectedRef.current = true
    
    try {
      // Create organization programmatically - this bypasses Clerk's invite screen (one org only)
      const newOrg = await createOrganization({ 
        name: finalOrgName
      })
      
      if (newOrg) {
        await setActive({ organization: newOrg.id })
        await new Promise((r) => setTimeout(r, 500))
        window.location.replace(redirectUrl)
      } else {
        throw new Error('Organization creation returned null')
      }
    } catch (error) {
      console.error('[SELECT_ORG] Failed to create organization:', error)
      createInProgressRef.current = false
      setIsCreating(false)
      hasRedirectedRef.current = false
      alert('Failed to create organization. Please try again.')
    }
  }

  if (!orgListLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading organizations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="text-center px-8 pt-8 pb-6 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Select organization
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose an organization to continue, or create a new one
            </p>
          </div>

          <div className="px-8 py-6">
            {/* Organization List */}
            {organizationList && organizationList.length > 0 ? (
              <div className="space-y-2 mb-6">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Your organizations
                </p>
                {organizationList.map((org) => (
                  <button
                    key={org.organization.id}
                    onClick={() => handleSelectOrg(org.organization.id)}
                    className="w-full text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {org.organization.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {org.role === 'org:admin' ? 'Administrator' : 'Member'}
                        </p>
                      </div>
                      {org.organization.id === organization?.id && (
                        <span className="text-xs bg-primary text-white px-3 py-1 rounded-full font-medium">
                          Active
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You don't have any organizations yet
                </p>
              </div>
            )}

            {/* Divider */}
            {(organizationList && organizationList.length > 0) && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    Or
                  </span>
                </div>
              </div>
            )}

            {/* Create New Organization */}
            <div className="w-full">
              {!showCreateForm ? (
                <button
                  type="button"
                  onClick={() => setShowCreateForm(true)}
                  disabled={isCreating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Create new organization
                    </>
                  )}
                </button>
              ) : (
                <form onSubmit={handleCreateOrg} className="space-y-4">
                  <div>
                    <label htmlFor="org-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Organization name
                    </label>
                    <input
                      id="org-name"
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="My Organization"
                      autoFocus
                      disabled={isCreating}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false)
                        setOrgName('')
                      }}
                      disabled={isCreating}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? 'Creating...' : 'Create organization'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Info Text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
              Organizations help you organize your team and data
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
