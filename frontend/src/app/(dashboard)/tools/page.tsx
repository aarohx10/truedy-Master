'use client'

import { useState, useEffect } from 'react'
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
import { Wrench, Plus, Search, Loader2, Trash2, ExternalLink, Edit2 } from 'lucide-react'
import { apiClient, endpoints } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useAuthReady } from '@/lib/clerk-auth-client'
import { useTools, useCreateTool, useUpdateTool, useDeleteTool, Tool } from '@/hooks/use-tools'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function ToolsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const isAuthReady = useAuthReady()
  
  const { data: tools = [], isLoading, error } = useTools()
  const createMutation = useCreateTool()
  const updateMutation = useUpdateTool()
  const deleteMutation = useDeleteTool()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  // Tool form state
  const [toolName, setToolName] = useState('')
  const [modelToolName, setModelToolName] = useState('')
  const [description, setDescription] = useState('')
  const [httpMethod, setHttpMethod] = useState('POST')
  const [baseUrlPattern, setBaseUrlPattern] = useState('')
  const [dynamicParams, setDynamicParams] = useState<Array<{name: string, location: string, schema: any, required: boolean}>>([])

  // Load tool data when editing
  useEffect(() => {
    if (selectedTool && editDialogOpen) {
      setToolName(selectedTool.name)
      setDescription(selectedTool.description || '')
      setHttpMethod(selectedTool.method)
      setBaseUrlPattern(selectedTool.endpoint)
      setDynamicParams(Array.isArray(selectedTool.parameters) ? selectedTool.parameters : [])
      // Extract modelToolName from tool definition if available, or generate from name
      setModelToolName(selectedTool.name.toLowerCase().replace(/\s+/g, '_'))
    } else if (!editDialogOpen) {
      // Reset form when dialog closes
      setToolName('')
      setModelToolName('')
      setDescription('')
      setHttpMethod('POST')
      setBaseUrlPattern('')
      setDynamicParams([])
    }
  }, [selectedTool, editDialogOpen])

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
          dynamicParameters: dynamicParams.length > 0 ? dynamicParams : [],
          http: {
            baseUrlPattern: baseUrlPattern,
            httpMethod: httpMethod,
          },
        },
      }

      await createMutation.mutateAsync(toolDefinition)

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

        {/* Tools List */}
        <Card className="border-gray-200 dark:border-gray-900">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>Failed to load tools. Please try again.</p>
              </div>
            ) : tools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
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
              </div>
            ) : (
              <div className="space-y-4">
                {/* Filter tools by search query */}
                {tools
                  .filter((tool) => 
                    searchQuery === '' || 
                    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                          <Badge variant={tool.status === 'active' ? 'default' : 'secondary'}>
                            {tool.status}
                          </Badge>
                        </div>
                        {tool.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {tool.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                          <span>{tool.method}</span>
                          <span className="truncate max-w-md">{tool.endpoint}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTool(tool)
                            setEditDialogOpen(true)
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
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
                disabled={isCreating || !isAuthReady || createMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isCreating || createMutation.isPending ? (
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

        {/* Edit Tool Dialog */}
        {selectedTool && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black border-gray-200 dark:border-gray-900">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                  <Wrench className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  Edit Tool
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
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-900">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditDialogOpen(false)
                    setSelectedTool(null)
                  }}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!selectedTool) return
                    
                    const toolDefinition = {
                      name: toolName,
                      definition: {
                        modelToolName: modelToolName || selectedTool.name.toLowerCase().replace(/\s+/g, '_'),
                        description: description,
                        dynamicParameters: dynamicParams.length > 0 ? dynamicParams : [],
                        http: {
                          baseUrlPattern: baseUrlPattern,
                          httpMethod: httpMethod,
                        },
                      },
                    }

                    try {
                      await updateMutation.mutateAsync({
                        id: selectedTool.id,
                        data: toolDefinition,
                      })

                      toast({
                        title: 'Tool updated',
                        description: `"${toolName}" has been updated successfully.`,
                      })

                      setEditDialogOpen(false)
                      setSelectedTool(null)
                    } catch (error) {
                      const errorMessage = error instanceof Error ? error.message : 'Failed to update tool'
                      toast({
                        title: 'Error',
                        description: errorMessage,
                        variant: 'destructive',
                      })
                    }
                  }}
                  disabled={updateMutation.isPending || !toolName.trim() || !baseUrlPattern.trim()}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppLayout>
  )
}
