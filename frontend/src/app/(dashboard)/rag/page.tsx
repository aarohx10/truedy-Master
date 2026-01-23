'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import { NewSourcePanel } from '@/components/rag/new-source-panel'
import { Search, Plus, Database, FileText, MoreVertical, Trash, ArrowRight, Loader2 } from 'lucide-react'
import { useKnowledgeBases, useKnowledgeBase } from '@/hooks/use-knowledge-bases'
import { apiClient, endpoints } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'

export default function RAGCollectionsPage() {
  const { data: knowledgeBases = [], isLoading: knowledgeBasesLoading, isFetched: knowledgeBasesFetched } = useKnowledgeBases()
  const [newSourceOpen, setNewSourceOpen] = useState(false)
  const [viewingKbId, setViewingKbId] = useState<string | null>(null)
  const [selectedKbId, setSelectedKbId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // Get knowledge base details when viewing
  const { data: viewingKb, isLoading: viewingKbLoading } = useKnowledgeBase(viewingKbId || '')
  
  // Filter knowledge bases by search query
  const filteredKnowledgeBases = knowledgeBases.filter(kb =>
    kb.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kb.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteFile = async (kbId: string, docId: string) => {
    try {
      // TODO: Implement delete document endpoint if needed
      toast({
        title: 'Delete file',
        description: 'File deletion will be implemented',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete file',
        variant: 'destructive',
      })
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Knowledge Base</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage knowledge bases for your agents
          </p>
        </div>

        {/* Search Bar */}
        {knowledgeBases.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search knowledge bases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:max-w-md focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        )}

        {/* Knowledge Bases List */}
        {knowledgeBasesLoading && !knowledgeBasesFetched ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={`skeleton-${i}`} className="border-gray-200 dark:border-gray-900">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredKnowledgeBases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKnowledgeBases.map((kb) => (
              <Card 
                key={kb.id} 
                className="border-gray-200 dark:border-gray-900 hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <CardContent className="p-6">
                  {/* Knowledge Base Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 flex-shrink-0">
                      <Database className="h-5 w-5 text-primary dark:text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                        {kb.name}
                      </h3>
                      {kb.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                          {kb.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Knowledge Base Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Status: <strong className="text-gray-900 dark:text-white">{kb.status}</strong>
                      </span>
                    </div>
                    {kb.document_counts && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">{kb.document_counts.total || 0}</strong> documents
                          {kb.document_counts.indexed > 0 && (
                            <span className="text-gray-500 dark:text-gray-500 ml-1">
                              ({kb.document_counts.indexed} indexed)
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all"
                        onClick={() => {
                          setSelectedKbId(kb.id)
                          setNewSourceOpen(true)
                        }}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Content
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all"
                        onClick={() => setViewingKbId(kb.id)}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-gray-200 dark:border-gray-900">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 mb-4">
                <Database className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'No knowledge bases found' : 'No knowledge bases yet'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
                {searchQuery 
                  ? 'Try adjusting your search terms to find what you\'re looking for.'
                  : 'Create your first knowledge base to store information for your AI agents.'
                }
              </p>
              {!searchQuery && (
                <Button
                  className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30"
                  onClick={() => setNewSourceOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Create Knowledge Base
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Knowledge Base Dialog */}
      <Dialog open={viewingKbId !== null} onOpenChange={(open) => !open && setViewingKbId(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-black border-gray-200 dark:border-gray-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
              <Database className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              Knowledge Base - {viewingKb?.name || 'Loading...'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {viewingKbLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : viewingKb?.documents && viewingKb.documents.length > 0 ? (
              <div className="space-y-2">
                {/* File List */}
                <div className="divide-y divide-gray-200 dark:divide-gray-900 border border-gray-200 dark:border-gray-900 rounded-lg overflow-hidden">
                  {viewingKb.documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between px-4 py-3 hover:bg-primary/5 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {doc.name}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            <span>{doc.type}</span>
                            <span>•</span>
                            <span>{doc.status}</span>
                            {doc.chunk_count > 0 && (
                              <>
                                <span>•</span>
                                <span>{doc.chunk_count} chunks</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-black border-gray-200 dark:border-gray-900">
                          <DropdownMenuItem 
                            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => viewingKbId && handleDeleteFile(viewingKbId, doc.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 dark:text-gray-400">No documents in this knowledge base.</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setViewingKbId(null)}
            >
              Close
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 gap-2"
              onClick={() => {
                setSelectedKbId(viewingKbId)
                setViewingKbId(null)
                setNewSourceOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              Add Content
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Source Panel */}
      <NewSourcePanel 
        isOpen={newSourceOpen} 
        onClose={() => {
          setNewSourceOpen(false)
          setSelectedKbId(null)
          queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] })
          if (viewingKbId) {
            queryClient.invalidateQueries({ queryKey: ['knowledge-base', viewingKbId] })
          }
        }}
        kbId={selectedKbId || undefined}
      />
    </AppLayout>
  )
}
