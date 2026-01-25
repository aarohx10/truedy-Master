'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VADSettings, MessageMedium } from '@/types'
import { AlertTriangle } from 'lucide-react'

interface SettingsTabProps {
  recordingEnabled: boolean
  onRecordingEnabledChange: (value: boolean) => void
  model: string
  onModelChange: (value: string) => void
  initialOutputMedium: MessageMedium
  onInitialOutputMediumChange: (value: MessageMedium) => void
  joinTimeout: string
  onJoinTimeoutChange: (value: string) => void
  maxDuration: string
  onMaxDurationChange: (value: string) => void
  timeExceededMessage: string
  onTimeExceededMessageChange: (value: string) => void
  temperature: number
  onTemperatureChange: (value: number) => void
  languageHint: string
  onLanguageHintChange: (value: string) => void
  vadSettings: VADSettings
  onVADSettingsChange: (settings: VADSettings) => void
}

export function SettingsTab({
  recordingEnabled,
  onRecordingEnabledChange,
  model,
  onModelChange,
  initialOutputMedium,
  onInitialOutputMediumChange,
  joinTimeout,
  onJoinTimeoutChange,
  maxDuration,
  onMaxDurationChange,
  timeExceededMessage,
  onTimeExceededMessageChange,
  temperature,
  onTemperatureChange,
  languageHint,
  onLanguageHintChange,
  vadSettings,
  onVADSettingsChange,
}: SettingsTabProps) {
  const updateVADField = (field: keyof VADSettings, value: any) => {
    onVADSettingsChange({
      ...vadSettings,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      {/* Call Recording */}
      <div className="flex items-center space-x-2">
        <Switch
          id="recording-enabled"
          checked={recordingEnabled}
          onCheckedChange={onRecordingEnabledChange}
        />
        <Label htmlFor="recording-enabled" className="text-sm font-medium cursor-pointer">
          Call Recording
        </Label>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
        Record calls for this agent
      </p>

      {/* Model */}
      <div className="space-y-2">
        <Label htmlFor="model" className="text-sm font-medium">
          Model
        </Label>
        <Select value={model} onValueChange={onModelChange}>
          <SelectTrigger id="model">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ultravox-v0.6">ultravox-v0.6</SelectItem>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Initial Output Medium */}
      <div className="space-y-2">
        <Label htmlFor="initial-output-medium" className="text-sm font-medium">
          Initial Output Medium
        </Label>
        <Select
          value={initialOutputMedium}
          onValueChange={(value: MessageMedium) => onInitialOutputMediumChange(value)}
        >
          <SelectTrigger id="initial-output-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MESSAGE_MEDIUM_VOICE">Voice</SelectItem>
            <SelectItem value="MESSAGE_MEDIUM_TEXT">Text</SelectItem>
            <SelectItem value="MESSAGE_MEDIUM_UNSPECIFIED">Unspecified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Join Timeout */}
      <div className="space-y-2">
        <Label htmlFor="join-timeout" className="text-sm font-medium">
          Join Timeout
        </Label>
        <Input
          id="join-timeout"
          value={joinTimeout}
          onChange={(e) => onJoinTimeoutChange(e.target.value)}
          placeholder="30s"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Maximum time to wait for call to be joined (e.g., "30s")
        </p>
      </div>

      {/* Max Duration */}
      <div className="space-y-2">
        <Label htmlFor="max-duration" className="text-sm font-medium">
          Max Duration
        </Label>
        <Input
          id="max-duration"
          value={maxDuration}
          onChange={(e) => onMaxDurationChange(e.target.value)}
          placeholder="3600s"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Maximum call duration (e.g., "3600s" for 1 hour)
        </p>
      </div>

      {/* Time Exceeded Message */}
      <div className="space-y-2">
        <Label htmlFor="time-exceeded-message" className="text-sm font-medium">
          Time Exceeded Message
        </Label>
        <Textarea
          id="time-exceeded-message"
          value={timeExceededMessage}
          onChange={(e) => onTimeExceededMessageChange(e.target.value)}
          placeholder="This call has reached its maximum duration. Thank you for calling!"
          rows={2}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Message to play when max duration is reached
        </p>
      </div>

      {/* Temperature */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="temperature" className="text-sm font-medium">
            Temperature: {typeof temperature === 'number' && !isNaN(temperature) ? temperature.toFixed(2) : '0.70'}
          </Label>
          <Input
            id="temperature"
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={typeof temperature === 'number' && !isNaN(temperature) ? temperature : 0.7}
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              onTemperatureChange(isNaN(val) ? 0.7 : Math.max(0, Math.min(1, val)))
            }}
            className="w-20"
          />
        </div>
        <Slider
          value={[typeof temperature === 'number' && !isNaN(temperature) ? Math.max(0, Math.min(1, temperature)) : 0.7]}
          onValueChange={([value]) => onTemperatureChange(typeof value === 'number' ? value : 0.7)}
          min={0}
          max={1}
          step={0.01}
          className="w-full"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Controls randomness in responses (0 = deterministic, 1 = creative)
        </p>
      </div>

      {/* Language Hint */}
      <div className="space-y-2">
        <Label htmlFor="language-hint" className="text-sm font-medium">
          Language Hint
        </Label>
        <Input
          id="language-hint"
          value={languageHint}
          onChange={(e) => onLanguageHintChange(e.target.value)}
          placeholder="en-US"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          BCP47 language code (e.g., "en-US", "es-ES")
        </p>
      </div>

      {/* VAD Settings */}
      <div className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Voice Activity Detection (VAD)
          </h3>
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Advanced Settings</AlertTitle>
            <AlertDescription>
              These settings affect when the agent detects speech. Adjust carefully as incorrect values can cause poor conversation flow.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-2">
          <Label htmlFor="turn-endpoint-delay" className="text-xs font-medium">
            Turn Endpoint Delay
          </Label>
          <Input
            id="turn-endpoint-delay"
            value={vadSettings.turn_endpoint_delay || ''}
            onChange={(e) => updateVADField('turn_endpoint_delay', e.target.value)}
            placeholder="500ms"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Delay before ending a turn after silence (e.g., "500ms")
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimum-turn-duration" className="text-xs font-medium">
            Minimum Turn Duration
          </Label>
          <Input
            id="minimum-turn-duration"
            value={vadSettings.minimum_turn_duration || ''}
            onChange={(e) => updateVADField('minimum_turn_duration', e.target.value)}
            placeholder="200ms"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Minimum duration for a turn to be considered valid
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimum-interruption-duration" className="text-xs font-medium">
            Minimum Interruption Duration
          </Label>
          <Input
            id="minimum-interruption-duration"
            value={vadSettings.minimum_interruption_duration || ''}
            onChange={(e) => updateVADField('minimum_interruption_duration', e.target.value)}
            placeholder="100ms"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Minimum duration for an interruption to be detected
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="frame-activation-threshold" className="text-xs font-medium">
              Frame Activation Threshold: {vadSettings.frame_activation_threshold?.toFixed(2) || '0.00'}
            </Label>
            <Input
              id="frame-activation-threshold"
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={vadSettings.frame_activation_threshold || 0}
              onChange={(e) => updateVADField('frame_activation_threshold', parseFloat(e.target.value) || 0)}
              className="w-20"
            />
          </div>
          <Slider
            value={[vadSettings.frame_activation_threshold || 0]}
            onValueChange={([value]) => updateVADField('frame_activation_threshold', value)}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Threshold for detecting voice activity (0-1)
          </p>
        </div>
      </div>
    </div>
  )
}
