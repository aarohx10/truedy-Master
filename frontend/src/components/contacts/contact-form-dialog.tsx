'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Contact, ContactFolder, CreateContactData, UpdateContactData } from '@/types'

interface ContactFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: Contact | null
  folders: ContactFolder[]
  folderId?: string
  onSubmit: (data: CreateContactData | UpdateContactData) => Promise<void>
  isLoading?: boolean
}

export function ContactFormDialog({
  open,
  onOpenChange,
  contact,
  folders,
  folderId,
  onSubmit,
  isLoading = false,
}: ContactFormDialogProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState('')

  useEffect(() => {
    if (contact) {
      setFirstName(contact.first_name || '')
      setLastName(contact.last_name || '')
      setEmail(contact.email || '')
      setPhoneNumber(contact.phone_number || '')
      setSelectedFolderId(contact.folder_id)
    } else {
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhoneNumber('')
      setSelectedFolderId(folderId || '')
    }
  }, [contact, folderId, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber.trim() || !selectedFolderId) return

    const data = contact
      ? {
          folder_id: selectedFolderId,
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
          email: email.trim() || undefined,
          phone_number: phoneNumber.trim(),
        }
      : {
          folder_id: selectedFolderId,
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
          email: email.trim() || undefined,
          phone_number: phoneNumber.trim(),
        }

    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{contact ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder">Folder *</Label>
              <Select
                value={selectedFolderId}
                onValueChange={setSelectedFolderId}
                disabled={isLoading || !!folderId}
              >
                <SelectTrigger id="folder">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  maxLength={50}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  maxLength={50}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+12125550123"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                E.164 format (e.g., +12125550123)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !phoneNumber.trim() || !selectedFolderId}>
              {isLoading ? 'Saving...' : contact ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
