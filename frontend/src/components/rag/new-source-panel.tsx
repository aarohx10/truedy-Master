'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface NewSourcePanelProps {
  isOpen: boolean
  onClose: () => void
  kbId?: string
}

export function NewSourcePanel({ isOpen, onClose, kbId }: NewSourcePanelProps) {
  const [sourceType, setSourceType] = useState<'web' | 'document'>('web')
  const [url, setUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  if (!isOpen) return null

  const handleSave = async () => {
    if (!kbId) {
      toast({
        title: 'Error',
        description: 'Knowledge base ID is required',
        variant: 'destructive',
      })
      return
    }

    if (sourceType === 'web' && !url) {
      toast({
        title: 'URL required',
        description: 'Please enter a URL',
        variant: 'destructive',
      })
      return
    }

    if (sourceType === 'document' && !selectedFile) {
      toast({
        title: 'File required',
        description: 'Please select a file',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      
      if (sourceType === 'web') {
        formData.append('url', url)
      } else {
        formData.append('file', selectedFile!)
      }

      await apiClient.upload(`/kb/${kbId}/add-content`, formData)

      toast({
        title: 'Content added',
        description: sourceType === 'web' 
          ? 'URL is being processed and indexed.'
          : 'File is being processed and indexed.',
      })

      // Reset form
      setUrl('')
      setSelectedFile(null)
      onClose()
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[NEW_SOURCE_PANEL] Error adding content (RAW ERROR)', {
        kbId,
        sourceType,
        url,
        fileName: selectedFile?.name,
        fileSize: selectedFile?.size,
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      
      toast({
        title: 'Error adding content',
        description: rawError.message || 'Failed to add content',
        variant: 'destructive',
        duration: 10000,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[70] bg-white/50 dark:bg-black/50 backdrop-blur-[12px] transition-opacity pointer-events-auto"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-[25px] pointer-events-none">
        <div
          className={cn(
            'relative w-[600px] max-h-[500px] bg-white dark:bg-black rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-900',
            'transition-all duration-300 pointer-events-auto',
            isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-[25px] py-4 border-b border-gray-200 dark:border-gray-900 bg-white dark:bg-black rounded-t-2xl flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Content</h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden px-[25px] py-[25px]">
            <div className="flex flex-col gap-4 h-full">
              {/* Source Type Tabs */}
              <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setSourceType('web')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors border-b-2 rounded-t-lg',
                    sourceType === 'web'
                      ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  Web
                </button>
                <button
                  onClick={() => setSourceType('document')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors border-b-2 rounded-t-lg',
                    sourceType === 'document'
                      ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  Document
                </button>
              </div>

              {/* Source Type Content */}
              <div className="pt-2">
                {sourceType === 'web' ? (
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-sm font-medium text-gray-900 dark:text-white">
                      URL
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="bg-white dark:bg-black border-gray-300 dark:border-gray-800 rounded-lg"
                      disabled={isProcessing}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="file" className="text-sm font-medium text-gray-900 dark:text-white">
                      Upload Document
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer bg-white dark:bg-black">
                      <Input
                        id="file"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        disabled={isProcessing}
                      />
                      <label htmlFor="file" className="cursor-pointer">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          PDF, DOC, DOCX, TXT (max. 20MB)
                        </p>
                        {selectedFile && (
                          <p className="text-xs text-primary mt-2 font-medium">
                            Selected: {selectedFile.name}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Processing Status */}
              {isProcessing && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing and indexing content...</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-[25px] py-4 border-t border-gray-200 dark:border-gray-900 bg-white dark:bg-black rounded-b-2xl flex-shrink-0">
            <Button
              onClick={handleSave}
              disabled={
                isProcessing ||
                (sourceType === 'web' ? !url : !selectedFile)
              }
              className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
