'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InactivityMessage, EndBehavior } from '@/types'
import { Plus, Trash2 } from 'lucide-react'

interface InactivityMessagesTabProps {
  inactivityMessages: InactivityMessage[]
  onInactivityMessagesChange: (messages: InactivityMessage[]) => void
}

export function InactivityMessagesTab({
  inactivityMessages,
  onInactivityMessagesChange,
}: InactivityMessagesTabProps) {
  const addMessage = () => {
    onInactivityMessagesChange([
      ...inactivityMessages,
      {
        duration: '30s',
        message: '',
        endBehavior: 'END_BEHAVIOR_UNSPECIFIED',
      },
    ])
  }

  const removeMessage = (index: number) => {
    onInactivityMessagesChange(inactivityMessages.filter((_, i) => i !== index))
  }

  const updateMessage = (index: number, field: keyof InactivityMessage, value: any) => {
    const updated = [...inactivityMessages]
    if (!updated[index]) {
      updated[index] = {
        duration: '30s',
        message: '',
        endBehavior: 'END_BEHAVIOR_UNSPECIFIED',
      }
    }
    updated[index] = {
      ...updated[index],
      [field]: value,
    }
    onInactivityMessagesChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Inactivity Messages
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Messages to play when the user is inactive for a specified duration
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addMessage}>
          <Plus className="h-4 w-4 mr-2" />
          Add Message
        </Button>
      </div>

      {inactivityMessages.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No inactivity messages configured</p>
          <p className="text-xs mt-1">Click "Add Message" to create one</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inactivityMessages.filter(Boolean).map((message, index) => (
            <Card key={index} className="border-gray-200 dark:border-gray-800">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Message {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMessage(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Duration</Label>
                  <Input
                    value={message?.duration || ''}
                    onChange={(e) => updateMessage(index, 'duration', e.target.value)}
                    placeholder="30s"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Inactivity duration before this message plays (e.g., "30s", "1m")
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Message</Label>
                  <Textarea
                    value={message?.message || ''}
                    onChange={(e) => updateMessage(index, 'message', e.target.value)}
                    placeholder="Are you still there?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">End Behavior</Label>
                  <Select
                    value={message?.endBehavior || 'END_BEHAVIOR_UNSPECIFIED'}
                    onValueChange={(value: EndBehavior) =>
                      updateMessage(index, 'endBehavior', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="END_BEHAVIOR_UNSPECIFIED">Unspecified</SelectItem>
                      <SelectItem value="END_BEHAVIOR_HANG_UP_SOFT">Hang Up (Soft)</SelectItem>
                      <SelectItem value="END_BEHAVIOR_HANG_UP_STRICT">Hang Up (Strict)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    What happens when this message finishes
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
