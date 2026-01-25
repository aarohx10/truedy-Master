'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { useAIAssist } from '@/hooks/use-agents'
import { AgentAIAssistRequest } from '@/types'
import { Loader2, Send, Sparkles, MessageSquare } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AIAssistancePanelProps {
  agentContext?: Partial<any> // Current agent data for context
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIAssistancePanel({ agentContext }: AIAssistancePanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const aiAssistMutation = useAIAssist()

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      const request: AgentAIAssistRequest = {
        prompt: currentInput,
        context: agentContext,
      }

      const response = await aiAssistMutation.mutateAsync(request)

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.suggestion,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI assistance'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            AI Assistance
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMessages([])}
          className="text-xs"
        >
          New Chat
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get AI-powered suggestions for your agent
            </p>
            <div className="space-y-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleQuickAction('Help me create an agent')}
              >
                Help me create an agent
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <Card
                key={index}
                className={`${
                  message.role === 'user'
                    ? 'bg-gray-50 dark:bg-gray-900'
                    : 'bg-white dark:bg-black'
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                        message.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {message.role === 'user' ? 'U' : 'AI'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="space-y-2 border-t border-gray-200 dark:border-gray-800 pt-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          disabled={isLoading}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter to Submit
          </p>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
