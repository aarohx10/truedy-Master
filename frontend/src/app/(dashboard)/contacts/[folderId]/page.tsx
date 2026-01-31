'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Plus, Search, Loader2, Upload, Download, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useContacts,
  useContactFolders,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useExportContacts,
} from '@/hooks/use-contacts'
import { useToast } from '@/hooks/use-toast'
import { Contact, CreateContactData, UpdateContactData } from '@/types'
import { ContactsTable } from '@/components/contacts/contacts-table'
import { ContactFormDialog } from '@/components/contacts/contact-form-dialog'
import { ImportDialog } from '@/components/contacts/import-dialog'
import { FolderFormDialog } from '@/components/contacts/folder-form-dialog'
import { useAuthClient } from '@/lib/clerk-auth-client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function FolderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const folderId = params.folderId as string
  const queryClient = useQueryClient()
  const { orgId } = useAuthClient()

  // Get folder from folders list (simplified - no separate get endpoint)
  const { data: folders = [], isLoading: foldersLoading } = useContactFolders()
  const folder = folders.find(f => f.id === folderId)
  const folderLoading = foldersLoading
  
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const { data: contactsData, isLoading: contactsLoading } = useContacts(folderId, currentPage, pageSize)
  const contacts = contactsData?.contacts || []
  const pagination = contactsData?.pagination
  const { toast } = useToast()

  const createMutation = useCreateContact()
  const updateMutation = useUpdateContact()
  const deleteMutation = useDeleteContact()
  const exportMutation = useExportContacts()

  const [searchQuery, setSearchQuery] = useState('')
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [folderDialogOpen, setFolderDialogOpen] = useState(false)
  const [deleteContactDialogOpen, setDeleteContactDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)

  const handleCreateContact = () => {
    setEditingContact(null)
    setContactDialogOpen(true)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setContactDialogOpen(true)
  }

  const handleDeleteContact = (contact: Contact) => {
    setContactToDelete(contact)
    setDeleteContactDialogOpen(true)
  }

  const handleConfirmDeleteContact = async () => {
    if (!contactToDelete) return

    try {
      await deleteMutation.mutateAsync({ id: contactToDelete.id, folderId })
      toast({
        title: 'Contact deleted',
        description: 'Contact has been deleted.',
      })
      setDeleteContactDialogOpen(false)
      setContactToDelete(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete contact'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const handleBulkDelete = async (contactIds: string[]) => {
    try {
      // Delete contacts one by one (simplified - no bulk delete endpoint)
      await Promise.all(
        contactIds.map(id => deleteMutation.mutateAsync({ id, folderId }))
      )
      toast({
        title: 'Contacts deleted',
        description: `${contactIds.length} contact${contactIds.length !== 1 ? 's' : ''} deleted.`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete contacts'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const handleContactSubmit = async (data: CreateContactData | UpdateContactData) => {
    try {
      if (editingContact) {
        await updateMutation.mutateAsync({ id: editingContact.id, data: data as UpdateContactData })
        toast({
          title: 'Contact updated',
          description: 'Contact has been updated.',
        })
      } else {
        await createMutation.mutateAsync(data as CreateContactData)
        toast({
          title: 'Contact created',
          description: 'Contact has been added.',
        })
      }
      setContactDialogOpen(false)
      setEditingContact(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save contact'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const handleImportComplete = (result: { successful: number; failed: number }) => {
    toast({
      title: 'Import completed',
      description: `${result.successful} contact${result.successful !== 1 ? 's' : ''} imported${result.failed > 0 ? `, ${result.failed} failed` : ''}.`,
    })
    // Invalidate and refetch contacts to show the newly imported ones
    // Reset to page 1 to see the newly imported contacts
    setCurrentPage(1)
    if (orgId && folderId) {
      queryClient.invalidateQueries({ queryKey: ['contacts', orgId, folderId] })
      queryClient.refetchQueries({ queryKey: ['contacts', orgId, folderId] })
      // Also refresh folder count
      queryClient.invalidateQueries({ queryKey: ['contact-folders', orgId] })
    }
  }

  const handleExport = async () => {
    try {
      const blob = await exportMutation.mutateAsync(folderId)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${folder?.name || 'contacts'}_${new Date().toISOString().split('T')[0]}.csv`
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

  const handleEditFolder = () => {
    if (folder) {
      setFolderDialogOpen(true)
    }
  }

  // Folder editing removed - simplified structure doesn't support folder updates
  const handleFolderSubmit = async (data: any) => {
    // Folder editing not supported in simplified structure
    toast({
      title: 'Not supported',
      description: 'Folder editing is not available in the simplified structure.',
      variant: 'destructive',
    })
    setFolderDialogOpen(false)
  }

  // Filter contacts by search query (client-side filtering on current page)
  const filteredContacts = contacts.filter((contact) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.toLowerCase()
    return (
      fullName.includes(query) ||
      (contact.email || '').toLowerCase().includes(query) ||
      (contact.phone_number || '').includes(query)
    )
  })

  // Reset to page 1 when folder changes
  useEffect(() => {
    setCurrentPage(1)
  }, [folderId])

  if (folderLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </AppLayout>
    )
  }

  if (!folder) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Folder not found</p>
          <Button onClick={() => router.push('/contacts')} className="mt-4">
            Back to Contacts
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/contacts')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {folder.name}
              </h1>
              {folder.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {folder.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleEditFolder}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Folder
            </Button>
            <Button
              variant="outline"
              onClick={() => setImportDialogOpen(true)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              className="gap-2"
              disabled={exportMutation.isPending}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={handleCreateContact}
              className="bg-primary hover:bg-primary/90 text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {folder.contact_count || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Contacts Table */}
        {contactsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <ContactsTable
              contacts={filteredContacts}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
              onBulkDelete={handleBulkDelete}
              isLoading={contactsLoading}
            />
            
            {/* Pagination Controls */}
            {pagination && pagination.total > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} contacts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                    <Select
                      value={String(pageSize)}
                      onValueChange={(value) => {
                        setPageSize(Number(value))
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || contactsLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum: number
                      if (pagination.pages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={contactsLoading}
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(pagination?.pages || 1, p + 1))}
                    disabled={currentPage >= (pagination?.pages || 1) || contactsLoading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Contact Form Dialog */}
        <ContactFormDialog
          open={contactDialogOpen}
          onOpenChange={setContactDialogOpen}
          contact={editingContact}
          folders={folders}
          folderId={folderId}
          onSubmit={handleContactSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        {/* Import Dialog */}
        <ImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          folders={folders}
          folderId={folderId}
          onImportComplete={handleImportComplete}
        />

        {/* Folder Form Dialog - Disabled in simplified structure */}
        {folder && (
          <FolderFormDialog
            open={folderDialogOpen}
            onOpenChange={setFolderDialogOpen}
            folder={folder}
            onSubmit={handleFolderSubmit}
            isLoading={false}
          />
        )}

        {/* Delete Contact Confirmation Dialog */}
        {deleteContactDialogOpen && contactToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-2">Delete Contact</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete this contact? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteContactDialogOpen(false)
                    setContactToDelete(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDeleteContact}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
