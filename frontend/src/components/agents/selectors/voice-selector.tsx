'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useVoices } from '@/hooks/use-voices'
import { Loader2 } from 'lucide-react'
import { Voice } from '@/types'

interface VoiceSelectorProps {
  value?: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

export function VoiceSelector({ value, onValueChange, disabled }: VoiceSelectorProps) {
  const { data: voices = [], isLoading } = useVoices()
  
  // Filter to only active voices
  const activeVoices = voices.filter((v: Voice) => v && v.status === 'active')

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Loading voices..." : "Select a voice"} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        ) : activeVoices.length === 0 ? (
          <div className="px-2 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            No active voices available
          </div>
        ) : (
          activeVoices.filter((voice): voice is Voice => Boolean(voice && voice.id)).map((voice: Voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              {voice.name || 'Unnamed Voice'}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
