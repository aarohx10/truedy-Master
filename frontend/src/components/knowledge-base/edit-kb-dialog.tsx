'use client'

import { useState, useEffect } from 'react'
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
import { Loader2 } from 'lucide-react'
import { useUpdateKnowledgeBase } from '@/hooks/use-knowledge-bases'
import { useToast } from '@/hooks/use-toast'
import { KnowledgeBase } from '@/types'

interface EditKBDialogProps {
  isOpen: boolean
  onClose: () => void
  knowledgeBase: KnowledgeBase | null
  onSuccess?: () => void
}

export function EditKBDialog({ isOpen, onClose, knowledgeBase, onSuccess }: EditKBDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const updateMutation = useUpdateKnowledgeBase()

  useEffect(() => {
    if (knowledgeBase) {
      setName(knowledgeBase.name || '')
      setDescription(knowledgeBase.description || '')
      setContent(knowledgeBase.content || '')
    }
  }, [knowledgeBase])

  const handleSubmit = async () => {
    if (!knowledgeBase) return

    if (!name.trim()) {
      toast({
        title: 'Validation error',
        description: 'Name is required',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)

    try {
      await updateMutation.mutateAsync({
        id: knowledgeBase.id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          content: content.trim() || undefined,
        },
      })

      toast({
        title: 'Knowledge base updated',
        description: `"${name}" has been updated successfully.`,
      })

      onSuccess?.()
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update knowledge base'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    if (!isSaving && knowledgeBase) {
      setName(knowledgeBase.name || '')
      setDescription(knowledgeBase.description || '')
      setContent(knowledgeBase.content || '')
      onClose()
    }
  }

  if (!knowledgeBase) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Knowledge Base</DialogTitle>
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
              placeholder="Knowledge Base Name"
              disabled={isSaving}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description..."
              rows={2}
              disabled={isSaving}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Content
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Knowledge base content..."
              rows={15}
              className="font-mono text-sm"
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Edit the extracted text content directly. Changes will be saved to the knowledge base.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving || !name.trim()}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
