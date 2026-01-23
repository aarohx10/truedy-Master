'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Folder, Plus, Loader2, Trash2, MoreVertical } from 'lucide-react'
import { apiClient, endpoints } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useAuthReady, useClientId } from '@/lib/clerk-auth-client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ContactFolder {
  id: string
  name: string
  description?: string
  contact_count?: number
  created_at: string
}

export default function ContactsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const isAuthReady = useAuthReady()
  const clientId = useClientId()
  const queryClient = useQueryClient()
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [folderDescription, setFolderDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Fetch folders
  const { data: folders = [], isLoading } = useQuery({
    queryKey: ['contact-folders', clientId],
    queryFn: async () => {
      const response = await apiClient.get<ContactFolder[]>(endpoints.contacts.folders.list)
      return response.data
    },
    enabled: isAuthReady && !!clientId,
  })

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await apiClient.post<ContactFolder>(endpoints.contacts.folders.create, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-folders', clientId] })
      setFolderName('')
      setFolderDescription('')
      setCreateDialogOpen(false)
      toast({
        title: 'Folder created',
        description: 'Contact folder has been created successfully.',
      })
    },
    onError: (error: Error) => {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[CONTACTS_PAGE] Error creating folder (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      
      toast({
        title: 'Error creating folder',
        description: rawError.message,
        variant: 'destructive',
        duration: 10000,
      })
    },
  })

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: string) => {
      await apiClient.delete(endpoints.contacts.folders.delete(folderId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-folders', clientId] })
      toast({
        title: 'Folder deleted',
        description: 'Folder has been deleted. Contacts have been moved to unorganized.',
      })
    },
    onError: (error: Error) => {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[CONTACTS_PAGE] Error deleting folder (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      
      toast({
        title: 'Error deleting folder',
        description: rawError.message,
        variant: 'destructive',
        duration: 10000,
      })
    },
  })

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast({
        title: 'Validation error',
        description: 'Folder name is required',
        variant: 'destructive',
      })
      return
    }

    createFolderMutation.mutate({
      name: folderName.trim(),
      description: folderDescription.trim() || undefined,
    })
  }

  const handleDeleteFolder = (folderId: string, folderName: string) => {
    if (!confirm(`Are you sure you want to delete "${folderName}"? Contacts in this folder will be moved to unorganized.`)) {
      return
    }
    deleteFolderMutation.mutate(folderId)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contacts</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Organize your contacts into folders
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Folder
          </Button>
        </div>

        {/* Folders Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : folders.length === 0 ? (
          <Card className="border-gray-200 dark:border-gray-900">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 mb-4">
                <Folder className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No folders yet</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                Create your first folder to organize your contacts.
              </p>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Folder
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <Card
                key={folder.id}
                className="border-gray-200 dark:border-gray-900 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => router.push(`/contacts/${folder.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                        <Folder className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                          {folder.name}
                        </h3>
                        {folder.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {folder.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteFolder(folder.id, folder.name)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{folder.contact_count || 0}</span>
                    <span>contact{(folder.contact_count || 0) !== 1 ? 's' : ''}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Folder Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-900">
            <DialogHeader>
              <DialogTitle className="text-lg text-gray-900 dark:text-white">
                Create Folder
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="folderName" className="text-sm font-medium text-gray-900 dark:text-white">
                  Folder Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="folderName"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g., Real Estate Leads"
                  className="bg-white dark:bg-black border-gray-300 dark:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="folderDescription" className="text-sm font-medium text-gray-900 dark:text-white">
                  Description (Optional)
                </Label>
                <Textarea
                  id="folderDescription"
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                  placeholder="Describe the purpose of this folder..."
                  rows={3}
                  className="bg-white dark:bg-black border-gray-300 dark:border-gray-800 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-900">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false)
                  setFolderName('')
                  setFolderDescription('')
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={createFolderMutation.isPending || !folderName.trim()}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {createFolderMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Folder'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
