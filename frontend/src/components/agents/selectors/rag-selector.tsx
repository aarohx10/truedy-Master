'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { useKnowledgeBases } from '@/hooks/use-knowledge-bases'
import { Loader2, X } from 'lucide-react'
import { KnowledgeBase } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface RAGSelectorProps {
  value?: string[]
  onValueChange: (value: string[]) => void
  disabled?: boolean
}

export function RAGSelector({ value = [], onValueChange, disabled }: RAGSelectorProps) {
  const { data: knowledgeBases = [], isLoading } = useKnowledgeBases()
  const [open, setOpen] = useState(false)

  // Filter to only ready knowledge bases
  const readyKBs = knowledgeBases.filter((kb: KnowledgeBase) => kb && kb.status === 'ready')
  const selectedKBs = readyKBs.filter((kb: KnowledgeBase) => kb && value.includes(kb.id))

  const handleToggle = (kbId: string) => {
    if (value.includes(kbId)) {
      onValueChange(value.filter((id) => id !== kbId))
    } else {
      onValueChange([...value, kbId])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={disabled || isLoading}
        >
          <span className="text-sm">
            {selectedKBs.length === 0
              ? 'Select knowledge bases'
              : `${selectedKBs.length} KB${selectedKBs.length !== 1 ? 's' : ''} selected`}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-2 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Select Knowledge Bases
            </span>
            {selectedKBs.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onValueChange([])}
                className="h-7 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          ) : readyKBs.length === 0 ? (
            <div className="px-4 py-8 text-sm text-gray-500 dark:text-gray-400 text-center">
              No ready knowledge bases available
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {readyKBs.filter((kb): kb is KnowledgeBase => Boolean(kb && kb.id)).map((kb: KnowledgeBase) => {
                const isSelected = value.includes(kb.id)
                return (
                  <div
                    key={kb.id}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer",
                      isSelected && "bg-gray-100 dark:bg-gray-900"
                    )}
                    onClick={() => handleToggle(kb.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(kb.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {kb.name}
                      </div>
                      {kb.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {kb.description}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {selectedKBs.length > 0 && (
          <div className="p-2 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap gap-1">
              {selectedKBs.filter((kb): kb is KnowledgeBase => Boolean(kb && kb.id)).map((kb: KnowledgeBase) => (
                <Badge
                  key={kb.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {kb.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggle(kb.id)
                    }}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
