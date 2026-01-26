'use client'

import { useOrganization, useOrganizationList, useUser } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'
import { apiClient, endpoints } from './api'
import { authManager } from './auth-manager'

/**
 * Hook to sync Clerk organization with database client
 * This ensures that when a user joins/creates an organization in Clerk,
 * the corresponding client is created/updated in the database
 * 
 * ENHANCED: Automatically triggers /auth/me when organization switches
 */
export function useOrganizationSync() {
  const { organization } = useOrganization()
  const { user } = useUser()
  const lastOrgIdRef = useRef<string | null>(null)

  // Sync organization with database when organization changes
  const syncOrganization = async () => {
    if (!organization || !user) return

    try {
      // Call /auth/me endpoint which will:
      // 1. Check Clerk org metadata for client_id
      // 2. Create/update client if needed
      // 3. Ensure user is linked to correct client_id
      const response = await apiClient.get(endpoints.auth.me)
      // Response structure: { data: UserResponse, meta: {...} }
      // UserResponse has: { id, client_id, email, role, ... }
      const userData = response.data as any
      const clientId = userData?.client_id || userData?.data?.client_id

      if (clientId) {
        // Update authManager with the client_id
        authManager.setClientId(clientId)
        console.log('[ORGANIZATIONS] Organization synced with client:', clientId)
      } else {
        console.warn('[ORGANIZATIONS] No client_id found in /auth/me response')
      }
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ORGANIZATIONS] Failed to sync organization (RAW ERROR)', {
        organizationId: organization?.id,
        userId: user?.id,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
    }
  }

  // Automatically trigger sync when organization changes
  useEffect(() => {
    const currentOrgId = organization?.id || null
    
    // Only sync if organization actually changed
    if (currentOrgId && currentOrgId !== lastOrgIdRef.current) {
      console.log('[ORGANIZATIONS] Organization changed, triggering sync:', {
        previousOrgId: lastOrgIdRef.current,
        newOrgId: currentOrgId
      })
      lastOrgIdRef.current = currentOrgId
      
      // Trigger /auth/me to refresh client_id and sync with new organization
      // This ensures the entire dashboard "flips" to the new organization's data
      syncOrganization().then(() => {
        // Force a page refresh to ensure all queries use the new client_id
        // This is more reliable than invalidating all queries
        console.log('[ORGANIZATIONS] Organization sync complete, refreshing page to load new workspace data')
        window.location.reload()
      }).catch((error) => {
        console.error('[ORGANIZATIONS] Failed to sync organization:', error)
        // Still refresh to prevent stale data
        window.location.reload()
      })
    }
  }, [organization?.id, user?.id])

  return { syncOrganization, organization }
}

/**
 * Hook to get organization members using Clerk API
 */
export function useOrganizationMembers() {
  const { organization } = useOrganization()
  const { user } = useUser()

  const getMembers = async () => {
    if (!organization) return []

    try {
      // Use Clerk's organization members API
      const members = await organization.getMemberships()
      return members.data.map((membership) => ({
        id: membership.id,
        userId: membership.publicUserData?.userId || '',
        name: membership.publicUserData?.firstName && membership.publicUserData?.lastName
          ? `${membership.publicUserData.firstName} ${membership.publicUserData.lastName}`
          : membership.publicUserData?.identifier || 'Unknown User',
        email: membership.publicUserData?.identifier || '',
        role: membership.role === 'org:admin' ? 'admin' : membership.role === 'org:member' ? 'member' : 'developer',
        avatar: membership.publicUserData?.imageUrl || '',
        joinedAt: membership.createdAt?.toISOString() || new Date().toISOString(),
        lastActive: membership.updatedAt?.toISOString() || '',
      }))
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ORGANIZATIONS] Failed to get organization members (RAW ERROR)', {
        organizationId: organization?.id,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      return []
    }
  }

  return { getMembers, organization, user }
}

/**
 * Hook to invite a user to the organization
 */
export function useInviteMember() {
  const { organization } = useOrganization()

  const inviteMember = async (email: string, role: 'org:admin' | 'org:member' = 'org:member') => {
    if (!organization) {
      throw new Error('No organization selected')
    }

    try {
      // Use Clerk's invite API
      const invitation = await organization.inviteMember({ emailAddress: email, role })
      return invitation
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ORGANIZATIONS] Failed to invite member (RAW ERROR)', {
        email,
        role,
        organizationId: organization?.id,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      throw rawError
    }
  }

  return { inviteMember, organization }
}

/**
 * Hook to create an organization for a new user
 * This should be called on first signup
 */
export function useCreateOrganization() {
  const { user } = useUser()
  const { createOrganization } = useOrganizationList()

  const createOrg = async (name: string) => {
    if (!user) {
      throw new Error('User must be authenticated to create organization')
    }

    if (!createOrganization) {
      throw new Error('Organization creation is not available')
    }

    try {
      // Create organization in Clerk
      const org = await createOrganization({ name })
      return org
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ORGANIZATIONS] Failed to create organization (RAW ERROR)', {
        name,
        userId: user?.id,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      throw rawError
    }
  }

  return { createOrg, user }
}

