'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Upload, X, Loader2 } from 'lucide-react'
import { useCreateKnowledgeBase } from '@/hooks/use-knowledge-bases'
import { useToast } from '@/hooks/use-toast'

interface CreateKBDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_FILE_TYPES = ['.pdf', '.txt', '.docx', '.doc', '.md']

export function CreateKBDialog({ isOpen, onClose, onSuccess }: CreateKBDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const createMutation = useCreateKnowledgeBase()

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
      toast({
        title: 'Invalid file type',
        description: `Allowed types: PDF, TXT, DOCX, MD`,
        variant: 'destructive',
      })
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        variant: 'destructive',
      })
      return
    }

    setSelectedFile(file)
  }, [toast])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: 'Validation error',
        description: 'Name is required',
        variant: 'destructive',
      })
      return
    }

    if (!selectedFile) {
      toast({
        title: 'Validation error',
        description: 'Please select a file',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        file: selectedFile, // Hook will convert to base64
      })

      toast({
        title: 'Knowledge base created',
        description: `"${name}" has been created successfully.`,
      })

      // Reset form
      setName('')
      setDescription('')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create knowledge base'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      setName('')
      setDescription('')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Knowledge Base</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Knowledge Base"
              disabled={isUploading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Description (Optional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this knowledge base contains..."
              rows={3}
              disabled={isUploading}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Document <span className="text-red-500">*</span>
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.docx,.doc,.md"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                disabled={isUploading}
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop a file here, or click to select
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Supported: PDF, TXT, DOCX, MD (max 50MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUploading || !name.trim() || !selectedFile}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Knowledge Base'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
