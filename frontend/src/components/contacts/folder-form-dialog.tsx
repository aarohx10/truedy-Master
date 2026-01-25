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
import { Textarea } from '@/components/ui/textarea'
import { ContactFolder, CreateContactFolderData, UpdateContactFolderData } from '@/types'

interface FolderFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folder?: ContactFolder | null
  onSubmit: (data: CreateContactFolderData | UpdateContactFolderData) => Promise<void>
  isLoading?: boolean
}

export function FolderFormDialog({
  open,
  onOpenChange,
  folder,
  onSubmit,
  isLoading = false,
}: FolderFormDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (folder) {
      setName(folder.name || '')
      setDescription(folder.description || '')
    } else {
      setName('')
      setDescription('')
    }
  }, [folder, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const data = folder
      ? { name: name.trim(), description: description.trim() || undefined }
      : { name: name.trim(), description: description.trim() || undefined }

    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{folder ? 'Edit Folder' : 'Create Folder'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter folder name"
                required
                maxLength={100}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter folder description (optional)"
                maxLength={500}
                rows={3}
                disabled={isLoading}
              />
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
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? 'Saving...' : folder ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
