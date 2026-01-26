'use client'

import { useState, useEffect } from 'react'
import { useOrganization, useOrganizationList, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { apiClient, endpoints } from '@/lib/api'

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function InviteMemberModal({ isOpen, onClose, onSuccess }: InviteMemberModalProps) {
  const { toast } = useToast()
  const { organization } = useOrganization()
  const { createOrganization } = useOrganizationList()
  const { user } = useUser()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'org:admin' | 'org:member'>('org:member')
  const [isInviting, setIsInviting] = useState(false)
  const [isCreatingOrg, setIsCreatingOrg] = useState(false)
  const [canInvite, setCanInvite] = useState(false)
  const [checkingPermission, setCheckingPermission] = useState(true)

  // Check if current user has client_admin role in Supabase (not just Clerk)
  useEffect(() => {
    const checkInvitePermission = async () => {
      if (!isOpen) return
      
      setCheckingPermission(true)
      try {
        const response = await apiClient.get(endpoints.auth.me)
        // Response structure: { data: UserResponse, meta: {...} }
        // UserResponse has: { id, client_id, email, role, ... }
        const userData = response.data as any
        const userRole = userData?.role || userData?.data?.role
        
        // Only client_admin can invite members (enforced in Supabase, not just Clerk)
        const hasPermission = userRole === 'client_admin'
        setCanInvite(hasPermission)
        
        if (!hasPermission && userRole) {
          // Only show error if we got a role but it's not admin
          // Don't show error if still loading/checking
          console.warn('[INVITE_MEMBER_MODAL] User does not have client_admin role:', userRole)
        }
      } catch (error) {
        console.error('[INVITE_MEMBER_MODAL] Failed to check permissions:', error)
        setCanInvite(false)
        // Don't show toast on every check - only show if user tries to invite
      } finally {
        setCheckingPermission(false)
      }
    }
    
    if (isOpen) {
      checkInvitePermission()
    }
  }, [isOpen])

  const handleInvite = async () => {
    if (!email.trim()) {
      toast({
        title: 'Validation error',
        description: 'Email address is required',
        variant: 'destructive',
      })
      return
    }

    // Verify permission before inviting
    if (!canInvite) {
      toast({
        title: 'Permission denied',
        description: 'Only workspace admins can invite team members.',
        variant: 'destructive',
      })
      return
    }

    // If no organization exists, create one first
    let activeOrg = organization
    if (!activeOrg && user && createOrganization) {
      setIsCreatingOrg(true)
      try {
        const orgName = user.fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'My Workspace'
        activeOrg = await createOrganization({ name: orgName })
        toast({
          title: 'Workspace created',
          description: 'Your workspace has been created. Sending invitation...',
        })
      } catch (error) {
        const rawError = error instanceof Error ? error : new Error(String(error))
        const errorMessage = rawError.message || 'Failed to create workspace. Please try again.'
        const isOrgFeatureDisabled = errorMessage.includes('organizations feature is not enabled') || 
                                     errorMessage.includes('organizations feature')
        
        console.error('[INVITE_MEMBER_MODAL] Error creating workspace (RAW ERROR)', {
          orgName,
          error: rawError,
          errorMessage: rawError.message,
          errorStack: rawError.stack,
          errorName: rawError.name,
          errorCause: (rawError as any).cause,
          fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
          isOrgFeatureDisabled,
        })
        
        toast({
          title: 'Error creating workspace',
          description: isOrgFeatureDisabled 
            ? 'Organizations feature is not enabled in Clerk. Please enable it in your Clerk Dashboard at https://dashboard.clerk.com'
            : errorMessage,
          variant: 'destructive',
          duration: 10000, // Show longer for important config errors
        })
        setIsCreatingOrg(false)
        return
      } finally {
        setIsCreatingOrg(false)
      }
    }

    if (!activeOrg) {
      toast({
        title: 'Error',
        description: 'No workspace available. Please refresh the page and try again.',
        variant: 'destructive',
      })
      return
    }

    setIsInviting(true)

    try {
      await activeOrg.inviteMember({ emailAddress: email.trim(), role })
      
      toast({
        title: 'Invitation sent',
        description: `Invitation has been sent to ${email}`,
      })

      setEmail('')
      setRole('org:member')
      onSuccess?.()
      onClose()
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[INVITE_MEMBER_MODAL] Error sending invitation (RAW ERROR)', {
        email,
        role,
        organizationId: activeOrg?.id,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      
      toast({
        title: 'Error sending invitation',
        description: rawError.message || 'Failed to send invitation',
        variant: 'destructive',
        duration: 10000,
      })
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-900">
        <DialogHeader>
          <DialogTitle className="text-lg text-gray-900 dark:text-white">Invite Team Member</DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Send an invitation to join your workspace. They will receive an email with instructions.
            {!canInvite && !checkingPermission && (
              <span className="block mt-2 text-red-500 dark:text-red-400">
                Only workspace admins can invite team members.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@example.com"
              className="bg-white dark:bg-black border-gray-300 dark:border-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-900 dark:text-white">
              Role
            </Label>
            <Select value={role} onValueChange={(value) => setRole(value as 'org:admin' | 'org:member')}>
              <SelectTrigger className="bg-white dark:bg-black border-gray-300 dark:border-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="org:member">Member</SelectItem>
                <SelectItem value="org:admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-900">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isInviting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={isInviting || isCreatingOrg || !email.trim() || !canInvite || checkingPermission}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isCreatingOrg ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating workspace...
              </>
            ) : isInviting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Invitation'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
