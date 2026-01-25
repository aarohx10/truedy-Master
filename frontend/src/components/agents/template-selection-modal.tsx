'use client'

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAgentTemplates, useCreateDraftAgent } from '@/hooks/use-agents'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Sparkles } from 'lucide-react'
import { AgentTemplate } from '@/types'

interface TemplateSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TemplateSelectionModal({ open, onOpenChange }: TemplateSelectionModalProps) {
  const router = useRouter()
  const { data: templates = [], isLoading } = useAgentTemplates()
  const createDraftMutation = useCreateDraftAgent()
  const { toast } = useToast()

  const handleSelectTemplate = async (template: AgentTemplate | null) => {
    try {
      const newAgent = await createDraftMutation.mutateAsync(template?.id)
      router.push(`/agents/${newAgent.id}`)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error creating agent',
        description: 'Failed to create new agent. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black border-gray-200 dark:border-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900 dark:text-white">
            Choose a Template
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Select a template to get started, or start from scratch
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {isLoading || createDraftMutation.isPending ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {createDraftMutation.isPending ? 'Creating agent...' : 'Loading templates...'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Start from Scratch Option */}
              <Card
                className="cursor-pointer hover:border-primary transition-colors border-2 border-dashed"
                onClick={() => handleSelectTemplate(null)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Start from Scratch
                  </CardTitle>
                  <CardDescription>
                    Create a custom agent from the ground up
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Templates Grid */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">
                  Pre-built Templates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {template.description || 'No description'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          {template.category && (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                              {template.category}
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectTemplate(template)
                            }}
                          >
                            Use Template
                          </Button>
                        </div>
                        {template.system_prompt && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 line-clamp-3">
                            {template.system_prompt.substring(0, 150)}...
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
