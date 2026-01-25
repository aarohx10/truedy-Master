'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Upload, FileText, Loader2 } from 'lucide-react'
import { ContactFolder, ContactImportRequest, CreateContactData } from '@/types'
import { apiClient, endpoints } from '@/lib/api'

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folders: ContactFolder[]
  onImportComplete: (result: { successful: number; failed: number }) => void
}

export function ImportDialog({
  open,
  onOpenChange,
  folders,
  onImportComplete,
}: ImportDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
    } else {
      alert('Please select a CSV file')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !selectedFolderId) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Read and parse CSV file
      const fileContent = await file.text()
      setUploadProgress(30)

      // Parse CSV (handle both comma and semicolon delimiters)
      const lines = fileContent.split('\n').filter(line => line.trim())
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row')
      }

      // Detect delimiter
      const delimiter = lines[0].includes(';') ? ';' : ','
      const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/"/g, ''))
      
      // Find phone_number column (handle variations)
      const phoneColumnIndex = headers.findIndex(h => 
        h.includes('phone') || h.includes('mobile') || h === 'phone_number'
      )
      
      if (phoneColumnIndex === -1) {
        throw new Error('CSV must contain a phone_number column')
      }

      // Parse contacts
      const contacts: CreateContactData[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''))
        const phoneNumber = values[phoneColumnIndex]?.trim()
        
        if (!phoneNumber) continue

        const contact: CreateContactData = {
          folder_id: selectedFolderId,
          phone_number: phoneNumber,
        }

        // Map other columns
        headers.forEach((header, idx) => {
          const value = values[idx]?.trim()
          if (!value) return

          if (header.includes('first') && !header.includes('last')) {
            contact.first_name = value
          } else if (header.includes('last') || (header.includes('name') && !header.includes('first'))) {
            contact.last_name = value
          } else if (header.includes('email')) {
            contact.email = value
          }
        })

        contacts.push(contact)
      }

      setUploadProgress(70)

      if (contacts.length === 0) {
        throw new Error('No valid contacts found in CSV file')
      }

      // Send contacts to backend
      const importData: ContactImportRequest = {
        folder_id: selectedFolderId,
        contacts: contacts,
      }

      const importResponse = await apiClient.post<{ data: { successful: number; failed: number } }>(
        endpoints.contacts.import,
        importData
      )

      setUploadProgress(100)
      onImportComplete(importResponse.data.data)
      onOpenChange(false)
      
      // Reset form
      setFile(null)
      setSelectedFolderId('')
      setUploadProgress(0)
    } catch (error) {
      console.error('Import failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to import contacts'
      alert(`Import failed: ${errorMessage}. Please check the CSV format and try again.`)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>
            Upload a CSV file with contacts. Required columns: phone_number. Optional: first_name, last_name, email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder">Folder *</Label>
              <Select
                value={selectedFolderId}
                onValueChange={setSelectedFolderId}
                disabled={isUploading}
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
            <div className="space-y-2">
              <Label htmlFor="file">CSV File *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="flex-1"
                />
                {file && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="h-4 w-4" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                  </div>
                )}
              </div>
            </div>
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading || !file || !selectedFolderId}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
