'use client'

import { KnowledgeBase } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2 } from 'lucide-react'
// Format date helper
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  } catch {
    return '-'
  }
}

interface KBListTableProps {
  knowledgeBases: KnowledgeBase[]
  onEdit: (kb: KnowledgeBase) => void
  onDelete: (kb: KnowledgeBase) => void
}

export function KBListTable({ knowledgeBases, onEdit, onDelete }: KBListTableProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="default">Ready</Badge>
      case 'creating':
        return <Badge variant="secondary">Processing</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getFileTypeBadge = (fileType?: string) => {
    if (!fileType) return <Badge variant="outline">Unknown</Badge>
    return <Badge variant="outline">{fileType.toUpperCase()}</Badge>
  }

  if (knowledgeBases.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No knowledge bases yet. Create your first one to get started.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>File Type</TableHead>
          <TableHead>File Size</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {knowledgeBases.map((kb) => (
          <TableRow key={kb.id}>
            <TableCell className="font-medium">{kb.name}</TableCell>
            <TableCell className="max-w-xs truncate">
              {kb.description || '-'}
            </TableCell>
            <TableCell>{getFileTypeBadge(kb.file_type)}</TableCell>
            <TableCell>{formatFileSize(kb.file_size)}</TableCell>
            <TableCell>{getStatusBadge(kb.status)}</TableCell>
            <TableCell>
              {kb.created_at ? formatDate(kb.created_at) : '-'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(kb)}
                  disabled={kb.status !== 'ready'}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(kb)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
