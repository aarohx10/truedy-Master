'use client'

import { useOrganization, useOrganizationList, useUser } from '@clerk/nextjs'
import { apiClient } from './api'

/**
 * Hook to sync Clerk organization with database client
 * This ensures that when a user joins/creates an organization in Clerk,
 * the corresponding client is created/updated in the database
 */
export function useOrganizationSync() {
  const { organization } = useOrganization()
  const { user } = useUser()

  // Sync organization with database when organization changes
  const syncOrganization = async () => {
    if (!organization || !user) return

    try {
      // Call /auth/me endpoint which will create/update client if needed
      const response = await apiClient.get('/auth/me')
      const userData = response.data as any

      if (userData?.client_id) {
        // Update organization metadata with client_id for future lookups
        // This is done via webhook in production, but we can also do it here
        console.log('Organization synced with client:', userData.client_id)
      }
    } catch (error) {
      console.error('Failed to sync organization:', error)
    }
  }

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
      console.error('Failed to get organization members:', error)
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
      console.error('Failed to invite member:', error)
      throw error
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
      console.error('Failed to create organization:', error)
      throw error
    }
  }

  return { createOrg, user }
}

