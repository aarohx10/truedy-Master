'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, BookOpen, Loader2 } from 'lucide-react'
import { useKnowledgeBases, useDeleteKnowledgeBase } from '@/hooks/use-knowledge-bases'
import { useToast } from '@/hooks/use-toast'
import { CreateKBDialog } from '@/components/knowledge-base/create-kb-dialog'
import { EditKBDialog } from '@/components/knowledge-base/edit-kb-dialog'
import { KBListTable } from '@/components/knowledge-base/kb-list-table'
import { KnowledgeBase } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export default function KnowledgeBasePage() {
  const { data: knowledgeBases = [], isLoading, error } = useKnowledgeBases()
  const { toast } = useToast()
  const deleteMutation = useDeleteKnowledgeBase()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedKB, setSelectedKB] = useState<KnowledgeBase | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [kbToDelete, setKbToDelete] = useState<KnowledgeBase | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (kb: KnowledgeBase) => {
    setSelectedKB(kb)
    setEditDialogOpen(true)
  }

  const handleDelete = (kb: KnowledgeBase) => {
    setKbToDelete(kb)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!kbToDelete) return

    setIsDeleting(true)
    try {
      await deleteMutation.mutateAsync(kbToDelete.id)
      toast({
        title: 'Knowledge base deleted',
        description: `"${kbToDelete.name}" has been deleted.`,
      })
      setDeleteDialogOpen(false)
      setKbToDelete(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete knowledge base'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRefresh = () => {
    // React Query will automatically refetch when mutations succeed
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-8 w-8" />
              Knowledge Base
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Upload documents and manage your knowledge bases
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Knowledge Base
          </Button>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Your Knowledge Bases</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>Failed to load knowledge bases. Please try again.</p>
              </div>
            ) : (
              <KBListTable
                knowledgeBases={knowledgeBases}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <CreateKBDialog
          isOpen={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={handleRefresh}
        />

        {/* Edit Dialog */}
        <EditKBDialog
          isOpen={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false)
            setSelectedKB(null)
          }}
          knowledgeBase={selectedKB}
          onSuccess={handleRefresh}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Knowledge Base</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete &quot;{kbToDelete?.name}&quot;? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setKbToDelete(null)
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
