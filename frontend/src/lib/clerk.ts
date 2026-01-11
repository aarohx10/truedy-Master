/**
 * Clerk Configuration
 * Centralized Clerk setup and utilities
 */
import { clerkClient } from '@clerk/nextjs/server'

export { clerkClient }

/**
 * Get Clerk user ID from session token
 */
export async function getClerkUserId(token: string): Promise<string | null> {
  try {
    // Clerk tokens contain user ID in the 'sub' claim
    const parts = token.split('.')
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
      return payload.sub || null
    }
  } catch (error) {
    console.error('Error extracting Clerk user ID:', error)
  }
  return null
}

/**
 * Get organization ID from Clerk token
 */
export async function getClerkOrganizationId(token: string): Promise<string | null> {
  try {
    const parts = token.split('.')
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
      // Clerk org ID is in org_id or org_slug claim
      return payload.org_id || payload.org_slug || null
    }
  } catch (error) {
    console.error('Error extracting Clerk organization ID:', error)
  }
  return null
}

