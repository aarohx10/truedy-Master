'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Folder, FolderOpen, MoreVertical, Download } from 'lucide-react'
import { ContactFolder } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface FolderCardProps {
  folder: ContactFolder
  onExport?: (folder: ContactFolder) => void
}

export function FolderCard({ folder, onExport }: FolderCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    router.push(`/contacts/${folder.id}`)
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-gray-200 dark:border-gray-900",
        isHovered && "shadow-lg scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20 flex-shrink-0">
              {isHovered ? (
                <FolderOpen className="h-6 w-6 text-primary" />
              ) : (
                <Folder className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                {folder.name}
              </h3>
              {folder.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {folder.description}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              {onExport && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onExport(folder)
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-900">
          <Badge variant="secondary" className="font-medium">
            {folder.contact_count || 0} {folder.contact_count === 1 ? 'contact' : 'contacts'}
          </Badge>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(folder.created_at), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
