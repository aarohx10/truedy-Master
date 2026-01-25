'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Wand2, Plus, Search, Loader2, MoreVertical, Edit, Trash2, Play, Copy } from 'lucide-react'
import { useAgents, useDeleteAgent } from '@/hooks/use-agents'
import { useToast } from '@/hooks/use-toast'
import { Agent } from '@/types'
import { TemplateSelectionModal } from '@/components/agents/template-selection-modal'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { formatDistanceToNow } from 'date-fns'

export default function AgentsPage() {
  const router = useRouter()
  const { data: agents = [], isLoading, error } = useAgents()
  const { toast } = useToast()
  const deleteMutation = useDeleteAgent()

  const [searchQuery, setSearchQuery] = useState('')
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCreateAgent = () => {
    setTemplateModalOpen(true)
  }

  const handleEdit = (agent: Agent) => {
    router.push(`/agents/${agent.id}`)
  }

  const handleDelete = (agent: Agent) => {
    setAgentToDelete(agent)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!agentToDelete) return

    setIsDeleting(true)
    try {
      await deleteMutation.mutateAsync(agentToDelete.id)
      toast({
        title: 'Agent deleted',
        description: `"${agentToDelete.name}" has been deleted.`,
      })
      setDeleteDialogOpen(false)
      setAgentToDelete(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete agent'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTest = (agent: Agent) => {
    router.push(`/agents/${agent.id}?test=true`)
  }

  const handleDuplicate = (agent: Agent) => {
    // Navigate to new agent page with template data
    router.push(`/agents/new?template=${agent.id}`)
  }

  const filteredAgents = agents.filter((agent) =>
    searchQuery === '' ||
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'creating':
        return 'secondary'
      case 'failed':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Wand2 className="h-8 w-8" />
              Agents
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create and manage AI agents for your calls
            </p>
          </div>
          <Button
            onClick={handleCreateAgent}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Agent
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Agents List */}
        <Card className="border-gray-200 dark:border-gray-900">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>Failed to load agents. Please try again.</p>
              </div>
            ) : filteredAgents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 mb-4">
                  <Wand2 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No agents found' : 'No agents yet'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Create your first agent to start making AI-powered calls.'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={handleCreateAgent}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Agent
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Voice</TableHead>
                    <TableHead>Tools</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <TableCell className="font-medium">
                        <button
                          onClick={() => handleEdit(agent)}
                          className="text-left hover:text-primary transition-colors"
                        >
                          {agent.name}
                        </button>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {agent.description || 'No description'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(agent.status)}>
                          {agent.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {agent.voice_id ? 'Configured' : 'Not set'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {agent.tools?.length || 0} tool{agent.tools?.length !== 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDistanceToNow(new Date(agent.updated_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(agent)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTest(agent)}>
                              <Play className="h-4 w-4 mr-2" />
                              Test
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(agent)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(agent)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Template Selection Modal */}
        <TemplateSelectionModal
          open={templateModalOpen}
          onOpenChange={setTemplateModalOpen}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Agent</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{agentToDelete?.name}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setAgentToDelete(null)
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
