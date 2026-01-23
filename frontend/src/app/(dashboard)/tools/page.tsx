'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Wrench, Plus, Search, Loader2, Trash2, ExternalLink } from 'lucide-react'
import { apiClient, endpoints } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useAuthReady } from '@/lib/clerk-auth-client'

export default function ToolsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const isAuthReady = useAuthReady()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  
  // Tool form state
  const [toolName, setToolName] = useState('')
  const [modelToolName, setModelToolName] = useState('')
  const [description, setDescription] = useState('')
  const [httpMethod, setHttpMethod] = useState('POST')
  const [baseUrlPattern, setBaseUrlPattern] = useState('')
  const [dynamicParams, setDynamicParams] = useState<Array<{name: string, location: string, schema: any, required: boolean}>>([])

  const handleCreateTool = async () => {
    if (!toolName.trim() || !modelToolName.trim() || !description.trim() || !baseUrlPattern.trim()) {
      toast({
        title: 'Validation error',
        description: 'Name, Model Tool Name, Description, and URL are required',
        variant: 'destructive',
      })
      return
    }

    if (!isAuthReady) {
      toast({
        title: 'Authentication required',
        description: 'Please wait for authentication to complete',
        variant: 'destructive',
      })
      return
    }

    setIsCreating(true)

    try {
      // Build Ultravox-compatible tool definition
      const toolDefinition = {
        name: toolName,
        definition: {
          modelToolName: modelToolName,
          description: description,
          dynamicParameters: dynamicParams,
          http: {
            baseUrlPattern: baseUrlPattern,
            httpMethod: httpMethod,
          },
        },
      }

      await apiClient.post(endpoints.tools.create, toolDefinition)

      toast({
        title: 'Tool created',
        description: `"${toolName}" has been created successfully.`,
      })

      // Reset form and close dialog
      setToolName('')
      setModelToolName('')
      setDescription('')
      setBaseUrlPattern('')
      setHttpMethod('POST')
      setDynamicParams([])
      setCreateDialogOpen(false)
      
      // TODO: Refresh tools list when implemented
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[TOOLS_PAGE] Error creating tool (RAW ERROR)', {
        toolName,
        modelToolName,
        description,
        httpMethod,
        baseUrlPattern,
        dynamicParams,
        toolDefinition,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      
      toast({
        title: 'Error creating tool',
        description: rawError.message || 'Failed to create tool',
        variant: 'destructive',
        duration: 10000,
      })
    } finally {
      setIsCreating(false)
    }
  }

  const addDynamicParam = () => {
    setDynamicParams([...dynamicParams, {
      name: '',
      location: 'PARAMETER_LOCATION_BODY',
      schema: { type: 'string' },
      required: false,
    }])
  }

  const removeDynamicParam = (index: number) => {
    setDynamicParams(dynamicParams.filter((_, i) => i !== index))
  }

  const updateDynamicParam = (index: number, field: string, value: any) => {
    const updated = [...dynamicParams]
    updated[index] = { ...updated[index], [field]: value }
    setDynamicParams(updated)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Integrations</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create and manage tools for your agents
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Tool
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Tools List - Placeholder */}
        <Card className="border-gray-200 dark:border-gray-900">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 mb-4">
              <Wrench className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No tools found</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
              Create your first tool to enable integrations with external APIs and services.
            </p>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Tool
            </Button>
          </CardContent>
        </Card>

        {/* Create Tool Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black border-gray-200 dark:border-gray-900">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                <Wrench className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                Create Tool
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Tool Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Tool Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder="My API Tool"
                  className="w-full focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Display name for the tool (max 40 characters)
                </p>
              </div>

              {/* Model Tool Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Model Tool Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={modelToolName}
                  onChange={(e) => setModelToolName(e.target.value)}
                  placeholder="my_api_tool"
                  className="w-full focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Name the LLM uses to call this tool (alphanumeric, underscores, hyphens only)
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe when and how the agent should use this tool..."
                  rows={4}
                  className="w-full focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>

              {/* HTTP Method and URL */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Method</label>
                  <Select value={httpMethod} onValueChange={setHttpMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Base URL Pattern <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={baseUrlPattern}
                    onChange={(e) => setBaseUrlPattern(e.target.value)}
                    placeholder="https://api.example.com/endpoint"
                    className="w-full focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Dynamic Parameters */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Dynamic Parameters
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDynamicParam}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Parameter
                  </Button>
                </div>
                
                {dynamicParams.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    No parameters defined. Add parameters that the LLM will extract from the conversation.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {dynamicParams.map((param, index) => (
                      <div key={index} className="flex gap-2 items-start p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Parameter name"
                            value={param.name}
                            onChange={(e) => updateDynamicParam(index, 'name', e.target.value)}
                            className="text-sm"
                          />
                          <Select
                            value={param.location}
                            onValueChange={(value) => updateDynamicParam(index, 'location', value)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PARAMETER_LOCATION_BODY">Body</SelectItem>
                              <SelectItem value="PARAMETER_LOCATION_QUERY">Query</SelectItem>
                              <SelectItem value="PARAMETER_LOCATION_PATH">Path</SelectItem>
                              <SelectItem value="PARAMETER_LOCATION_HEADER">Header</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDynamicParam(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-900">
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTool}
                disabled={isCreating || !isAuthReady}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Tool'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
