'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GreetingSettings, FirstSpeaker } from '@/types'

interface GreetingTabProps {
  greetingSettings: GreetingSettings
  onGreetingSettingsChange: (settings: GreetingSettings) => void
}

export function GreetingTab({ greetingSettings, onGreetingSettingsChange }: GreetingTabProps) {
  const updateField = (field: keyof GreetingSettings, value: any) => {
    onGreetingSettingsChange({
      ...greetingSettings,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="first-speaker" className="text-sm font-medium">
          First Speaker
        </Label>
        <Select
          value={greetingSettings.first_speaker}
          onValueChange={(value: FirstSpeaker) => updateField('first_speaker', value)}
        >
          <SelectTrigger id="first-speaker">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agent">Agent</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Who speaks first when the call starts
        </p>
      </div>

      {greetingSettings.first_speaker === 'agent' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="first-message-text" className="text-sm font-medium">
              First Message Text
            </Label>
            <Textarea
              id="first-message-text"
              value={greetingSettings.text || ''}
              onChange={(e) => updateField('text', e.target.value)}
              placeholder="Hello! How can I help you today?"
              rows={3}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              The exact text the agent will say first (optional if using prompt)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="first-message-prompt" className="text-sm font-medium">
              First Message Prompt
            </Label>
            <Textarea
              id="first-message-prompt"
              value={greetingSettings.prompt || ''}
              onChange={(e) => updateField('prompt', e.target.value)}
              placeholder="Greet the caller warmly and ask how you can help..."
              rows={3}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Prompt for generating the first message (optional if using text)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="first-message-delay" className="text-sm font-medium">
              First Message Delay
            </Label>
            <Input
              id="first-message-delay"
              value={greetingSettings.delay || ''}
              onChange={(e) => updateField('delay', e.target.value)}
              placeholder="2s"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Delay before the first message (e.g., "2s", "500ms")
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="uninterruptible"
              checked={greetingSettings.uninterruptible || false}
              onCheckedChange={(checked) => updateField('uninterruptible', checked)}
            />
            <Label htmlFor="uninterruptible" className="text-sm font-medium cursor-pointer">
              Uninterruptible
            </Label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
            Prevent the user from interrupting the first message
          </p>
        </>
      )}

      {greetingSettings.first_speaker === 'user' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="fallback-delay" className="text-sm font-medium">
              Fallback Delay
            </Label>
            <Input
              id="fallback-delay"
              value={greetingSettings.fallback_delay || ''}
              onChange={(e) => updateField('fallback_delay', e.target.value)}
              placeholder="5s"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Delay before using fallback if user doesn't speak
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fallback-text" className="text-sm font-medium">
              Fallback Text
            </Label>
            <Textarea
              id="fallback-text"
              value={greetingSettings.fallback_text || ''}
              onChange={(e) => updateField('fallback_text', e.target.value)}
              placeholder="Hello? Is anyone there?"
              rows={2}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Text to say if user doesn't speak within the delay
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fallback-prompt" className="text-sm font-medium">
              Fallback Prompt
            </Label>
            <Textarea
              id="fallback-prompt"
              value={greetingSettings.fallback_prompt || ''}
              onChange={(e) => updateField('fallback_prompt', e.target.value)}
              placeholder="Prompt the user to speak..."
              rows={2}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Prompt for generating fallback message (optional if using text)
            </p>
          </div>
        </>
      )}
    </div>
  )
}
