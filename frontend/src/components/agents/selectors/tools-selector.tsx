'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { useTools } from '@/hooks/use-tools'
import { Loader2, X } from 'lucide-react'
import { Tool } from '@/hooks/use-tools'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ToolsSelectorProps {
  value?: string[]
  onValueChange: (value: string[]) => void
  disabled?: boolean
}

export function ToolsSelector({ value = [], onValueChange, disabled }: ToolsSelectorProps) {
  const { data: tools = [], isLoading } = useTools()
  const [open, setOpen] = useState(false)

  const activeTools = tools.filter((t: Tool) => t && t.status === 'active')
  const selectedTools = activeTools.filter((t: Tool) => t && value.includes(t.id))

  const handleToggle = (toolId: string) => {
    if (value.includes(toolId)) {
      onValueChange(value.filter((id) => id !== toolId))
    } else {
      onValueChange([...value, toolId])
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
            {selectedTools.length === 0
              ? 'Select tools'
              : `${selectedTools.length} tool${selectedTools.length !== 1 ? 's' : ''} selected`}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-2 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Select Tools
            </span>
            {selectedTools.length > 0 && (
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
          ) : activeTools.length === 0 ? (
            <div className="px-4 py-8 text-sm text-gray-500 dark:text-gray-400 text-center">
              No active tools available
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {activeTools.filter((tool): tool is Tool => Boolean(tool && tool.id)).map((tool: Tool) => {
                const isSelected = value.includes(tool.id)
                return (
                  <div
                    key={tool.id}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer",
                      isSelected && "bg-gray-100 dark:bg-gray-900"
                    )}
                    onClick={() => handleToggle(tool.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(tool.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {tool.name}
                      </div>
                      {tool.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {tool.description}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {selectedTools.length > 0 && (
          <div className="p-2 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap gap-1">
              {selectedTools.map((tool: Tool) => (
                <Badge
                  key={tool.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {tool.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggle(tool.id)
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
