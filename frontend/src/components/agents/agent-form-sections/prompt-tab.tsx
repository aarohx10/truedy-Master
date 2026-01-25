'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface PromptTabProps {
  systemPrompt: string
  onSystemPromptChange: (value: string) => void
}

export function PromptTab({ systemPrompt, onSystemPromptChange }: PromptTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="system-prompt" className="text-sm font-medium">
          System Prompt
        </Label>
        <Textarea
          id="system-prompt"
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          placeholder="Enter the system prompt that defines how the agent behaves..."
          className="min-h-[400px] font-mono text-sm resize-none"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This prompt defines the agent's personality, behavior, and instructions for handling conversations.
        </p>
      </div>
    </div>
  )
}
