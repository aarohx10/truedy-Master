'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Folder, Plus, Search, Loader2 } from 'lucide-react'
import { useContactFolders, useCreateContactFolder, useExportContacts } from '@/hooks/use-contacts'
import { useToast } from '@/hooks/use-toast'
import { ContactFolder, CreateContactFolderData, UpdateContactFolderData } from '@/types'
import { FolderCard } from '@/components/contacts/folder-card'
import { FolderFormDialog } from '@/components/contacts/folder-form-dialog'

export default function ContactsPage() {
  const router = useRouter()
  const { data: folders = [], isLoading, error } = useContactFolders()
  const { toast } = useToast()
  const createMutation = useCreateContactFolder()
  const exportMutation = useExportContacts()

  const [searchQuery, setSearchQuery] = useState('')
  const [folderDialogOpen, setFolderDialogOpen] = useState(false)

  // Step 4: Direct Prop Check - Log folders in component
  console.log('[COMPONENT] FOLDERS_IN_COMPONENT:', folders)
  console.log('[COMPONENT] folders type:', typeof folders)
  console.log('[COMPONENT] folders isArray:', Array.isArray(folders))
  console.log('[COMPONENT] folders length:', folders?.length)
  console.log('[COMPONENT] isLoading:', isLoading)
  console.log('[COMPONENT] error:', error)

  const handleCreateFolder = () => {
    setFolderDialogOpen(true)
  }

  // Folder edit/delete removed - simplified structure only supports create
  const handleEditFolder = (folder: ContactFolder) => {
    toast({
      title: 'Not supported',
      description: 'Folder editing is not available in the simplified structure.',
      variant: 'destructive',
    })
  }

  const handleDeleteFolder = (folder: ContactFolder) => {
    toast({
      title: 'Not supported',
      description: 'Folder deletion is not available in the simplified structure.',
      variant: 'destructive',
    })
  }

  const handleFolderSubmit = async (data: CreateContactFolderData) => {
    try {
      await createMutation.mutateAsync(data)
      toast({
        title: 'Folder created',
        description: `"${data.name}" has been created.`,
      })
      setFolderDialogOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create folder'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const handleExportFolder = async (folder: ContactFolder) => {
    try {
      const blob = await exportMutation.mutateAsync(folder.id)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${folder.name}_contacts_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: 'Export started',
        description: 'Contacts are being exported.',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export contacts'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const filteredFolders = folders.filter((folder) =>
    searchQuery === '' ||
    folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Step 4: Log filtered results
  console.log('[COMPONENT] filteredFolders:', filteredFolders)
  console.log('[COMPONENT] filteredFolders length:', filteredFolders.length)
  console.log('[COMPONENT] searchQuery:', searchQuery)

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Folder className="h-8 w-8" />
              Contacts
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Organize your contacts into folders
            </p>
          </div>
          <Button
            onClick={handleCreateFolder}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Folder
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Folders Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>Failed to load folders. Please try again.</p>
          </div>
        ) : filteredFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 mb-4">
              <Folder className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No folders found' : 'No folders yet'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Create your first folder to organize your contacts'}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateFolder} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Folder
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onExport={handleExportFolder}
              />
            ))}
          </div>
        )}

        {/* Folder Form Dialog */}
        <FolderFormDialog
          open={folderDialogOpen}
          onOpenChange={setFolderDialogOpen}
          folder={null}
          onSubmit={handleFolderSubmit}
          isLoading={createMutation.isPending}
        />
      </div>
    </AppLayout>
  )
}
