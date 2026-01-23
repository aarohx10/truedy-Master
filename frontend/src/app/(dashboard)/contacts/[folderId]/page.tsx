'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
import { ArrowLeft, Upload, Download, Plus, Search, MoreVertical, Edit, Trash2, Loader2, Folder } from 'lucide-react'
import { apiClient, endpoints } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useAuthReady, useClientId } from '@/lib/clerk-auth-client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatPhoneNumber } from '@/lib/utils'

interface Contact {
  id: string
  phone_number: string
  first_name?: string
  last_name?: string
  email?: string
  custom_fields?: Record<string, any>
  created_at: string
}

interface ContactFolder {
  id: string
  name: string
  description?: string
}

export default function FolderContactsPage() {
  const router = useRouter()
  const params = useParams()
  const folderId = params.folderId as string
  const { toast } = useToast()
  const isAuthReady = useAuthReady()
  const clientId = useClientId()
  const queryClient = useQueryClient()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [addContactDialogOpen, setAddContactDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  // Contact form state
  const [phoneNumber, setPhoneNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  // Fetch folder details
  const { data: folders = [] } = useQuery({
    queryKey: ['contact-folders', clientId],
    queryFn: async () => {
      const response = await apiClient.get<ContactFolder[]>(endpoints.contacts.folders.list)
      return response.data
    },
    enabled: isAuthReady && !!clientId,
  })
  
  const folder = folders.find(f => f.id === folderId)

  // Fetch contacts for this folder
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts', clientId, folderId],
    queryFn: async () => {
      const response = await apiClient.get<Contact[]>(`${endpoints.contacts.list}?folder_id=${folderId}`)
      return response.data
    },
    enabled: isAuthReady && !!clientId && !!folderId,
  })

  // Create contact mutation
  const createContactMutation = useMutation({
    mutationFn: async (data: { phone_number: string; first_name?: string; last_name?: string; email?: string; folder_id: string }) => {
      const response = await apiClient.post<Contact>(endpoints.contacts.create, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', clientId, folderId] })
      queryClient.invalidateQueries({ queryKey: ['contact-folders', clientId] })
      setPhoneNumber('')
      setFirstName('')
      setLastName('')
      setEmail('')
      setAddContactDialogOpen(false)
      toast({
        title: 'Contact added',
        description: 'Contact has been added successfully.',
      })
    },
    onError: (error: Error) => {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[CONTACTS_FOLDER_PAGE] Error adding contact (RAW ERROR)', {
        folderId,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      
      toast({
        title: 'Error adding contact',
        description: rawError.message,
        variant: 'destructive',
        duration: 10000,
      })
    },
  })

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (contactId: string) => {
      await apiClient.delete(endpoints.contacts.delete(contactId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', clientId, folderId] })
      queryClient.invalidateQueries({ queryKey: ['contact-folders', clientId] })
      toast({
        title: 'Contact deleted',
        description: 'Contact has been deleted successfully.',
      })
    },
    onError: (error: Error) => {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[CONTACTS_FOLDER_PAGE] Error deleting contact (RAW ERROR)', {
        folderId,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      
      toast({
        title: 'Error deleting contact',
        description: rawError.message,
        variant: 'destructive',
        duration: 10000,
      })
    },
  })

  const handleAddContact = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: 'Validation error',
        description: 'Phone number is required',
        variant: 'destructive',
      })
      return
    }

    createContactMutation.mutate({
      phone_number: phoneNumber.trim(),
      first_name: firstName.trim() || undefined,
      last_name: lastName.trim() || undefined,
      email: email.trim() || undefined,
      folder_id: folderId,
    })
  }

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: 'Validation error',
        description: 'Please select a file to import',
        variant: 'destructive',
      })
      return
    }

    // TODO: Implement CSV/XLSX import
    toast({
      title: 'Import coming soon',
      description: 'CSV/XLSX import will be implemented soon.',
    })
  }

  const handleExport = () => {
    // TODO: Implement CSV export
    toast({
      title: 'Export coming soon',
      description: 'CSV export will be implemented soon.',
    })
  }

  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase()
    const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.toLowerCase()
    return (
      fullName.includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.phone_number.includes(query)
    )
  })

  if (!folder) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
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
              onClick={() => router.push('/contacts')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-primary" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{folder.name}</h1>
              </div>
              {folder.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{folder.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
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
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={() => setAddContactDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Contacts Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : filteredContacts.length === 0 ? (
          <Card className="border-gray-200 dark:border-gray-900">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 mb-4">
                <Folder className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No contacts in this folder</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                {searchQuery
                  ? 'No contacts match your search'
                  : 'Import your first contacts to this folder to get started'}
              </p>
              {!searchQuery && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setImportDialogOpen(true)}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Import Contacts
                  </Button>
                  <Button
                    onClick={() => setAddContactDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Contact
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200 dark:border-gray-900">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-900">
                      <TableHead className="text-gray-900 dark:text-white">Name</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Email</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Phone</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id} className="hover:bg-primary/5">
                        <TableCell className="font-medium text-gray-900 dark:text-white">
                          {contact.first_name || contact.last_name
                            ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                            : '—'}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {contact.email || '—'}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white">
                          {formatPhoneNumber(contact.phone_number)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="hover:bg-primary/5">
                                <Edit className="mr-2 h-4 w-4 text-primary" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive hover:bg-red-50 dark:hover:bg-red-950"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this contact?')) {
                                    deleteContactMutation.mutate(contact.id)
                                  }
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Contact Dialog */}
        <Dialog open={addContactDialogOpen} onOpenChange={setAddContactDialogOpen}>
          <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-900">
            <DialogHeader>
              <DialogTitle className="text-lg text-gray-900 dark:text-white">
                Add Contact
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="bg-white dark:bg-black border-gray-300 dark:border-gray-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="bg-white dark:bg-black border-gray-300 dark:border-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="bg-white dark:bg-black border-gray-300 dark:border-gray-800"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="bg-white dark:bg-black border-gray-300 dark:border-gray-800"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-900">
              <Button
                variant="outline"
                onClick={() => {
                  setAddContactDialogOpen(false)
                  setPhoneNumber('')
                  setFirstName('')
                  setLastName('')
                  setEmail('')
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddContact}
                disabled={createContactMutation.isPending || !phoneNumber.trim()}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {createContactMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Contact'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-900">
            <DialogHeader>
              <DialogTitle className="text-lg text-gray-900 dark:text-white">
                Import Contacts
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  CSV/XLSX File
                </label>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="bg-white dark:bg-black border-gray-300 dark:border-gray-800"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Upload a CSV or Excel file with columns: phone_number, first_name, last_name, email
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-900">
              <Button
                variant="outline"
                onClick={() => {
                  setImportDialogOpen(false)
                  setSelectedFile(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!selectedFile}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
