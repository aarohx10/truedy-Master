'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit, Trash2, MoreVertical } from 'lucide-react'
import { Contact } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface ContactsTableProps {
  contacts: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
  onBulkDelete?: (contactIds: string[]) => void
  isLoading?: boolean
}

export function ContactsTable({
  contacts,
  onEdit,
  onDelete,
  onBulkDelete,
  isLoading = false,
}: ContactsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Flatten Metadata: Extract all unique custom field keys from metadata across all contacts
  const customFields = useMemo(() => {
    const fieldSet = new Set<string>()
    contacts.forEach(contact => {
      if (contact.metadata && typeof contact.metadata === 'object') {
        Object.keys(contact.metadata).forEach(key => {
          fieldSet.add(key)
        })
      }
    })
    return Array.from(fieldSet).sort()
  }, [contacts])

  // Standard columns that should always be visible
  const standardColumns = ['name', 'email', 'phone_number', 'company_name', 'industry', 'location', 'pin_code', 'keywords']

  // Get all columns to display (standard + custom from metadata)
  const allColumns = useMemo(() => {
    const cols: string[] = []
    
    // Always show standard columns if they have data
    contacts.forEach(contact => {
      if (contact.company_name) cols.push('company_name')
      if (contact.industry) cols.push('industry')
      if (contact.location) cols.push('location')
      if (contact.pin_code) cols.push('pin_code')
      if (contact.keywords && contact.keywords.length > 0) cols.push('keywords')
    })
    
    // Add custom fields from metadata
    customFields.forEach(field => {
      if (!cols.includes(field)) {
        cols.push(field)
      }
    })
    
    // Remove duplicates and sort
    return Array.from(new Set(cols)).sort()
  }, [contacts, customFields])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(contacts.map((c) => c.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedIds.size > 0) {
      onBulkDelete(Array.from(selectedIds))
      setSelectedIds(new Set())
    }
  }

  const getFullName = (contact: Contact) => {
    const parts = [contact.first_name, contact.last_name].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : 'Unnamed'
  }

  const renderCellValue = (contact: Contact, column: string) => {
    // Standard fields
    if (column === 'name') {
      return getFullName(contact)
    }
    if (column === 'email') {
      return contact.email || '-'
    }
    if (column === 'phone_number') {
      return contact.phone_number
    }
    if (column === 'company_name') {
      return contact.company_name || '-'
    }
    if (column === 'industry') {
      return contact.industry || '-'
    }
    if (column === 'location') {
      return contact.location || '-'
    }
    if (column === 'pin_code') {
      return contact.pin_code || '-'
    }
    if (column === 'keywords') {
      return contact.keywords && contact.keywords.length > 0 
        ? contact.keywords.join(', ') 
        : '-'
    }
    
    // Custom fields from metadata
    if (contact.metadata && typeof contact.metadata === 'object' && column in contact.metadata) {
      const value = contact.metadata[column]
      if (Array.isArray(value)) {
        return value.join(', ')
      }
      return String(value) || '-'
    }
    
    return '-'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading contacts...</div>
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-gray-500 dark:text-gray-400">No contacts found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedIds.size > 0 && onBulkDelete && (
        <div className="flex items-center justify-between p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
          <span className="text-sm font-medium">
            {selectedIds.size} contact{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
          >
            Delete Selected
          </Button>
        </div>
      )}
      <div className="rounded-md border border-gray-200 dark:border-gray-900 overflow-auto max-h-[calc(100vh-400px)]">
        <div className="overflow-x-auto min-w-full" style={{ minWidth: 'max-content' }}>
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-20">
              <TableRow>
                <TableHead className="w-12 sticky left-0 bg-white dark:bg-gray-900 z-30 border-r border-gray-200 dark:border-gray-800">
                  <Checkbox
                    checked={selectedIds.size === contacts.length && contacts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="min-w-[150px]">Phone Number</TableHead>
              {/* Dynamic standard columns */}
              {contacts.some(c => c.company_name) && (
                <TableHead className="min-w-[150px]">Company</TableHead>
              )}
              {contacts.some(c => c.industry) && (
                <TableHead className="min-w-[120px]">Industry</TableHead>
              )}
              {contacts.some(c => c.location) && (
                <TableHead className="min-w-[150px]">Location</TableHead>
              )}
              {contacts.some(c => c.pin_code) && (
                <TableHead className="min-w-[100px]">Pin Code</TableHead>
              )}
              {contacts.some(c => c.keywords && c.keywords.length > 0) && (
                <TableHead className="min-w-[150px]">Keywords</TableHead>
              )}
              {/* Dynamic custom columns from metadata */}
              {customFields.map((field) => (
                <TableHead key={field} className="capitalize min-w-[120px]">
                  {field.replace(/_/g, ' ')}
                </TableHead>
              ))}
              <TableHead className="min-w-[120px]">Created</TableHead>
              <TableHead className="w-12 sticky right-0 bg-white dark:bg-gray-900 z-30 border-l border-gray-200 dark:border-gray-800"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="sticky left-0 bg-white dark:bg-gray-900 z-20 border-r border-gray-200 dark:border-gray-800">
                  <Checkbox
                    checked={selectedIds.has(contact.id)}
                    onCheckedChange={(checked) => handleSelectOne(contact.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium min-w-[150px]">
                  {getFullName(contact)}
                </TableCell>
                <TableCell className="min-w-[200px]">{contact.email || '-'}</TableCell>
                <TableCell className="min-w-[150px]">{contact.phone_number}</TableCell>
                {/* Dynamic standard columns */}
                {contacts.some(c => c.company_name) && (
                  <TableCell className="min-w-[150px]">{contact.company_name || '-'}</TableCell>
                )}
                {contacts.some(c => c.industry) && (
                  <TableCell className="min-w-[120px]">{contact.industry || '-'}</TableCell>
                )}
                {contacts.some(c => c.location) && (
                  <TableCell className="min-w-[150px]">{contact.location || '-'}</TableCell>
                )}
                {contacts.some(c => c.pin_code) && (
                  <TableCell className="min-w-[100px]">{contact.pin_code || '-'}</TableCell>
                )}
                {contacts.some(c => c.keywords && c.keywords.length > 0) && (
                  <TableCell className="min-w-[150px]">
                    {contact.keywords && contact.keywords.length > 0 
                      ? contact.keywords.join(', ') 
                      : '-'}
                  </TableCell>
                )}
                {/* Dynamic custom columns from metadata */}
                {customFields.map((field) => (
                  <TableCell key={field} className="min-w-[120px]">
                    {renderCellValue(contact, field)}
                  </TableCell>
                ))}
                <TableCell className="text-sm text-gray-500 dark:text-gray-400 min-w-[120px]">
                  {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="sticky right-0 bg-white dark:bg-gray-900 z-20 border-l border-gray-200 dark:border-gray-800">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(contact)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(contact)}
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
        </div>
      </div>
    </div>
  )
}
