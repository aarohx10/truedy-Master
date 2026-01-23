'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { InviteMemberModal } from '@/components/settings/invite-member-modal'
import { useOrganizationMembers, useInviteMember } from '@/lib/organizations'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'
import { Key, CreditCard, Users, Building2, Plus, MoreVertical, Trash2, Shield, Mail, Loader2 } from 'lucide-react'
import { apiClient, endpoints } from '@/lib/api'
import { useClientId, useAuthReady } from '@/lib/clerk-auth-client'
import { useQuery } from '@tanstack/react-query'

interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  role: 'admin' | 'member' | 'developer'
  avatar?: string
  joinedAt: string
  lastActive?: string
}

export default function SettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTabParam = searchParams.get('tab') || 'api-keys'
  const [activeTab, setActiveTab] = useState(activeTabParam)

  // Update active tab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab') || 'api-keys'
    setActiveTab(tab)
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === 'billing') {
      router.push('/billing')
    } else {
      router.push(`/settings?tab=${value}`)
    }
  }
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const { toast } = useToast()
  const clientId = useClientId()
  const isAuthReady = useAuthReady()
  const { organization } = useOrganization()
  const { user } = useUser()
  const { getMembers } = useOrganizationMembers()

  // Fetch team members
  const { data: teamMembers = [], isLoading: membersLoading, refetch: refetchMembers } = useQuery<TeamMember[]>({
    queryKey: ['team-members', organization?.id],
    queryFn: async () => {
      if (!organization) return []
      return await getMembers() as TeamMember[]
    },
    enabled: !!organization && activeTab === 'team',
  })

  // Fetch client data for credits
  const { data: clientData } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const response = await apiClient.get(endpoints.auth.me)
      return response.data
    },
    enabled: isAuthReady && !!clientId && activeTab === 'billing',
  })

  const creditsBalance = clientData?.credits_balance || 0

  const handleInviteSuccess = () => {
    refetchMembers()
  }

  const handleRemoveMember = async (userId: string) => {
    if (!organization) return
    
    if (!confirm('Are you sure you want to remove this team member?')) {
      return
    }

    try {
      await organization.removeMember({ userId })
      toast({
        title: 'Member removed',
        description: 'Team member has been removed successfully.',
      })
      refetchMembers()
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[SETTINGS_PAGE] Error removing member (RAW ERROR)', {
        memberId,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      
      toast({
        title: 'Error removing member',
        description: rawError.message || 'Failed to remove member',
        variant: 'destructive',
        duration: 10000,
      })
    }
  }

  const handleStripePortal = () => {
    // TODO: Implement Stripe portal redirect
    toast({
      title: 'Stripe Portal',
      description: 'Stripe customer portal will be implemented soon.',
    })
  }

  const handleRenameWorkspace = async (newName: string) => {
    if (!organization) return

    try {
      await organization.update({ name: newName })
      toast({
        title: 'Workspace renamed',
        description: 'Workspace name has been updated successfully.',
      })
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[SETTINGS_PAGE] Error renaming workspace (RAW ERROR)', {
        newName,
        organizationId: organization?.id,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      
      toast({
        title: 'Error renaming workspace',
        description: rawError.message || 'Failed to rename workspace',
        variant: 'destructive',
        duration: 10000,
      })
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your workspace configuration and team.</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-900">
            <TabsTrigger value="api-keys" className="gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="workspace" className="gap-2">
              <Building2 className="h-4 w-4" />
              Workspace
            </TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ultravox-key" className="text-sm font-medium text-gray-900 dark:text-white">
                    Ultravox API Key
                  </Label>
                  <Input
                    id="ultravox-key"
                    type="password"
                    placeholder="Enter your Ultravox API key"
                    className="bg-white dark:bg-black border-gray-300 dark:border-gray-800"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Used for agent and tool management
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="elevenlabs-key" className="text-sm font-medium text-gray-900 dark:text-white">
                    ElevenLabs API Key
                  </Label>
                  <Input
                    id="elevenlabs-key"
                    type="password"
                    placeholder="Enter your ElevenLabs API key"
                    className="bg-white dark:bg-black border-gray-300 dark:border-gray-800"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Used for voice cloning operations
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-secret" className="text-sm font-medium text-gray-900 dark:text-white">
                    Webhook Secret
                  </Label>
                  <Input
                    id="webhook-secret"
                    type="password"
                    placeholder="Enter your webhook secret"
                    className="bg-white dark:bg-black border-gray-300 dark:border-gray-800"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Used to verify webhook requests from external services
                  </p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Save API Keys
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credits & Billing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">
                    Credits Remaining
                  </Label>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {creditsBalance.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    1 Credit = $1.00 USD
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.location.href = '/billing'}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Purchase Credits
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleStripePortal}
                  >
                    Stripe Portal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Members</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage team members and their access levels.
                </p>
              </div>
              <Button
                onClick={() => setInviteModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white gap-2"
                disabled={!organization && !user}
              >
                <Plus className="h-4 w-4" />
                Invite Member
              </Button>
            </div>

            {membersLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </CardContent>
              </Card>
            ) : !organization ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Workspace Found</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
                    A workspace will be created automatically when you invite your first team member. This allows you to collaborate with others.
                  </p>
                  <Button
                    onClick={() => setInviteModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workspace & Invite Member
                  </Button>
                </CardContent>
              </Card>
            ) : teamMembers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No team members</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Invite team members to collaborate on your workspace.
                  </p>
                  <Button
                    onClick={() => setInviteModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="text-gray-900 dark:text-white">Name</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Email</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Role</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member: TeamMember) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            {member.email}
                          </TableCell>
                          <TableCell>
                            {member.role === 'admin' ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                <Shield className="h-3 w-3" />
                                Admin
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Member
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {member.role !== 'admin' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="text-destructive hover:bg-red-50 dark:hover:bg-red-950"
                                    onClick={() => handleRemoveMember(member.userId)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            <InviteMemberModal
              isOpen={inviteModalOpen}
              onClose={() => setInviteModalOpen(false)}
              onSuccess={handleInviteSuccess}
            />
          </TabsContent>

          {/* Workspace Tab */}
          <TabsContent value="workspace" className="space-y-6 mt-6">
            {!organization ? (
              <Card>
                <CardContent className="py-6">
                  <div className="text-center space-y-4">
                    <Building2 className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Workspace Found</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        A workspace will be created automatically when you invite your first team member.
                      </p>
                      <Button
                        onClick={() => setInviteModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Workspace & Invite Member
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Workspace Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspace-name" className="text-sm font-medium text-gray-900 dark:text-white">
                      Workspace Name
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="workspace-name"
                        defaultValue={organization.name || ''}
                        placeholder="My Workspace"
                        className="bg-white dark:bg-black border-gray-300 dark:border-gray-800"
                      />
                      <Button
                        onClick={() => {
                          const input = document.getElementById('workspace-name') as HTMLInputElement
                          if (input?.value && input.value.trim()) {
                            handleRenameWorkspace(input.value.trim())
                          } else {
                            toast({
                              title: 'Validation error',
                              description: 'Workspace name cannot be empty',
                              variant: 'destructive',
                            })
                          }
                        }}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        Rename
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Change your workspace display name. This will update across the application.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
