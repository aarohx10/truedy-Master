'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogDescription,
} from '@/components/ui/dialog'
import { Key, Plus, Trash2, Copy, Check, Loader2 } from 'lucide-react'
import { useApiKeys, useCreateApiKey, useDeleteApiKey, type CreateApiKeyData } from '@/hooks/use-api-keys'
import { useToast } from '@/hooks/use-toast'

export default function ApiKeysPage() {
  const { data: apiKeys = [], isLoading } = useApiKeys()
  const createMutation = useCreateApiKey()
  const deleteMutation = useDeleteApiKey()
  const { toast } = useToast()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [apiKeyToDelete, setApiKeyToDelete] = useState<string | null>(null)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null)

  // Form state - just the key name
  const [keyName, setKeyName] = useState<string>('')

  const handleCreateApiKey = async () => {
    if (!keyName.trim()) {
      toast({
        title: 'Validation error',
        description: 'Please enter a name for your API key',
        variant: 'destructive',
      })
      return
    }

    try {
      const data: CreateApiKeyData = {
        key_name: keyName.trim(),
        generate: true, // Always generate
      }

      const result = await createMutation.mutateAsync(data)
      
      // Show generated key in dialog
      if (result.api_key) {
        setGeneratedKey(result.api_key)
      }

      // Reset form
      setKeyName('')
      setCreateDialogOpen(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleDeleteApiKey = (apiKeyId: string) => {
    setApiKeyToDelete(apiKeyId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!apiKeyToDelete) return

    try {
      await deleteMutation.mutateAsync(apiKeyToDelete)
      setDeleteDialogOpen(false)
      setApiKeyToDelete(null)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKeyId(keyId)
      toast({
        title: 'Copied to clipboard',
        description: 'API key has been copied to your clipboard.',
      })
      setTimeout(() => setCopiedKeyId(null), 2000)
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">API Keys</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your API keys
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white gap-2"
          >
            <Plus className="h-4 w-4" />
            Create API Key
          </Button>
        </div>

        {/* API Keys Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Your API Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-12">
                <Key className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No API Keys
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Get started by creating your first API key
                </p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.key_name}</TableCell>
                      <TableCell>
                        {new Date(key.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteApiKey(key.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create API Key Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Enter a name for your new API key. A secure key will be generated automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name *</Label>
                <Input
                  id="key-name"
                  placeholder="e.g., Production API Key"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateApiKey()
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCreateDialogOpen(false)
                    setKeyName('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateApiKey}
                  disabled={createMutation.isPending || !keyName.trim()}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create API Key'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Generated Key Display Dialog */}
        <Dialog open={!!generatedKey} onOpenChange={(open) => !open && setGeneratedKey(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>API Key Generated</DialogTitle>
              <DialogDescription>
                Your API key has been generated. Copy it now - you won't be able to see it again!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Generated API Key</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={generatedKey || ''}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generatedKey && copyToClipboard(generatedKey, 'generated')}
                    className="flex-shrink-0"
                  >
                    {copiedKeyId === 'generated' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> This is the only time you'll be able to see this API key.
                  Make sure to copy and store it securely.
                </p>
              </div>
              <div className="flex items-center justify-end">
                <Button
                  onClick={() => setGeneratedKey(null)}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  I've Copied It
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete API Key</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this API key? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setApiKeyToDelete(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                variant="destructive"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
