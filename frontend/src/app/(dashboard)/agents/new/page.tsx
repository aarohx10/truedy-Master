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
import { useCreateAgent } from '@/hooks/use-agents'
import { useVoices } from '@/hooks/use-voices'
import { useKnowledgeBases } from '@/hooks/use-knowledge-bases'
import { useToast } from '@/hooks/use-toast'
import { useAuthReady, useClientId } from '@/lib/clerk-auth-client'
import { Loader2, ArrowLeft } from 'lucide-react'
import { CreateAgentData } from '@/types'

export default function NewAgentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const isAuthReady = useAuthReady()
  const clientId = useClientId()
  const createAgentMutation = useCreateAgent()
  
  // Only fetch voices and KBs when auth is ready
  const { data: voices = [], isLoading: voicesLoading, error: voicesError } = useVoices('custom')
  const { data: knowledgeBases = [], isLoading: kbLoading, error: kbError } = useKnowledgeBases()
  
  const [name, setName] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.')
  const [voiceId, setVoiceId] = useState<string>('')
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Log errors for debugging and show user-friendly messages
  useEffect(() => {
    if (voicesError) {
      console.error('Error loading voices:', voicesError)
      // Don't show toast for background data loading errors - only log
    }
    if (kbError) {
      console.error('Error loading knowledge bases:', kbError)
      // Don't show toast for background data loading errors - only log
    }
  }, [voicesError, kbError])
  
  // Show error if auth is not ready after a delay
  useEffect(() => {
    if (!isAuthReady && clientId === null) {
      const timer = setTimeout(() => {
        if (!isAuthReady) {
          console.warn('[NewAgentPage] Auth not ready after delay')
        }
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isAuthReady, clientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !systemPrompt.trim()) {
      toast({
        title: 'Validation error',
        description: 'Name and system prompt are required',
        variant: 'destructive',
      })
      return
    }
    
    if (!isAuthReady || !clientId) {
      toast({
        title: 'Authentication required',
        description: 'Please wait for authentication to complete',
        variant: 'destructive',
      })
      return
    }
    
    setIsSubmitting(true)

    try {
      const agentData: CreateAgentData = {
        name: name.trim(),
        system_prompt: systemPrompt.trim(),
        voice_id: (voiceId && voiceId !== 'none') ? voiceId : undefined,
        knowledge_bases: (knowledgeBaseId && knowledgeBaseId !== 'none') ? [knowledgeBaseId] : [],
        model: 'fixie-ai/ultravox-v0_4-8k',
        tools: [],
      }

      const newAgent = await createAgentMutation.mutateAsync(agentData)

      toast({
        title: 'Agent created',
        description: `"${name}" has been created successfully.`,
      })

      // Navigate to agents list
      router.push('/agents')
    } catch (error) {
      console.error('Error creating agent:', error)
      
      // Extract error message
      let errorMessage = 'Failed to create agent. Please try again.'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message)
      }
      
      toast({
        title: 'Error creating agent',
        description: errorMessage,
        variant: 'destructive',
        duration: 8000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Safely filter voices and KBs with error handling
  const activeVoices = Array.isArray(voices) ? voices.filter(v => v?.status === 'active') : []
  const readyKBs = Array.isArray(knowledgeBases) ? knowledgeBases.filter(kb => kb?.status === 'ready') : []

  // Show loading state if auth is not ready
  if (!isAuthReady || !clientId) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
                <Button 
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
                </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Agent</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create a new AI agent with voice and knowledge base support
                </p>
              </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agent Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-white">
              Agent Name <span className="text-red-500">*</span>
                </label>
                <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My AI Agent"
              required
              maxLength={100}
              className="bg-white dark:bg-black border-gray-300 dark:border-gray-800"
            />
                    </div>

            {/* System Prompt */}
          <div className="space-y-2">
            <label htmlFor="systemPrompt" className="text-sm font-medium text-gray-900 dark:text-white">
              System Prompt <span className="text-red-500">*</span>
            </label>
              <Textarea
              id="systemPrompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful AI assistant..."
              required
              rows={8}
              maxLength={5000}
              className="bg-white dark:bg-black border-gray-300 dark:border-gray-800 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {systemPrompt.length}/5000 characters
            </p>
                          </div>

            {/* Voice Selection */}
          <div className="space-y-2">
            <label htmlFor="voice" className="text-sm font-medium text-gray-900 dark:text-white">
              Voice (Optional)
            </label>
            <Select value={voiceId || undefined} onValueChange={(value) => setVoiceId(value === "none" ? "" : value)}>
              <SelectTrigger className="bg-white dark:bg-black border-gray-300 dark:border-gray-800">
                <SelectValue placeholder="Select a voice (optional)" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="none">No voice</SelectItem>
                {voicesLoading ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500 dark:text-gray-400">Loading voices...</div>
                ) : activeVoices.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500 dark:text-gray-400">No active voices available</div>
                ) : (
                  activeVoices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                      {voice.name} ({voice.provider})
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            {activeVoices.length === 0 && !voicesLoading && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Create a voice in <button type="button" onClick={() => router.push('/voice-cloning')} className="text-primary hover:underline">Voice Cloning</button>
                </p>
              )}
            </div>

          {/* Knowledge Base Selection */}
          <div className="space-y-2">
            <label htmlFor="knowledgeBase" className="text-sm font-medium text-gray-900 dark:text-white">
              Knowledge Base (Optional)
                  </label>
            <Select value={knowledgeBaseId || undefined} onValueChange={(value) => setKnowledgeBaseId(value === "none" ? "" : value)}>
              <SelectTrigger className="bg-white dark:bg-black border-gray-300 dark:border-gray-800">
                <SelectValue placeholder="Select a knowledge base (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="none">No knowledge base</SelectItem>
                {kbLoading ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500 dark:text-gray-400">Loading knowledge bases...</div>
                ) : readyKBs.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500 dark:text-gray-400">No ready knowledge bases available</div>
                ) : (
                  readyKBs.map((kb) => (
                    <SelectItem key={kb.id} value={kb.id}>
                      {kb.name}
                    </SelectItem>
                  ))
                )}
                  </SelectContent>
                </Select>
            {readyKBs.length === 0 && !kbLoading && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Create a knowledge base in <button type="button" onClick={() => router.push('/rag')} className="text-primary hover:underline">Knowledge Base</button>
              </p>
            )}
                    </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
                    </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isAuthReady || !name.trim() || !systemPrompt.trim()}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Agent'
              )}
            </Button>
            </div>
        </form>
          </div>
    </AppLayout>
  )
}
