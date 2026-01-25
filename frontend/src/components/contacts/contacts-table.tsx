'use client'

import { useState } from 'react'
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
      <div className="rounded-md border border-gray-200 dark:border-gray-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.size === contacts.length && contacts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(contact.id)}
                    onCheckedChange={(checked) => handleSelectOne(contact.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {getFullName(contact)}
                </TableCell>
                <TableCell>{contact.email || '-'}</TableCell>
                <TableCell>{contact.phone_number}</TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
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
  )
}
