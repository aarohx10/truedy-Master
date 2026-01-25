'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Plus, Search, Loader2, Upload, Download, Edit, Trash2 } from 'lucide-react'
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

export default function FolderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const folderId = params.folderId as string

  // Get folder from folders list (simplified - no separate get endpoint)
  const { data: folders = [], isLoading: foldersLoading } = useContactFolders()
  const folder = folders.find(f => f.id === folderId)
  const folderLoading = foldersLoading
  
  const { data: contacts = [], isLoading: contactsLoading } = useContacts(folderId)
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
          <ContactsTable
            contacts={filteredContacts}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
            onBulkDelete={handleBulkDelete}
            isLoading={contactsLoading}
          />
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
