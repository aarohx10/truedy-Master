'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2, PhoneIncoming, PhoneOutgoing } from 'lucide-react'
import { useAssignNumber } from '@/hooks/use-telephony'
import { useAgents } from '@/hooks/use-agents'
import { PhoneNumber } from '@/hooks/use-telephony'

interface PhoneNumberAssignmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phoneNumber: PhoneNumber
  assignmentType: 'inbound' | 'outbound'
  onSuccess?: () => void
}

export function PhoneNumberAssignmentModal({
  open,
  onOpenChange,
  phoneNumber,
  assignmentType,
  onSuccess,
}: PhoneNumberAssignmentModalProps) {
  const { data: agents = [] } = useAgents()
  const assignMutation = useAssignNumber()
  const [selectedAgentId, setSelectedAgentId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAgentId) return

    try {
      await assignMutation.mutateAsync({
        number_id: phoneNumber.id,
        agent_id: selectedAgentId,
        assignment_type: assignmentType,
      })
      onSuccess?.()
      onOpenChange(false)
      setSelectedAgentId('')
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setSelectedAgentId('')
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {assignmentType === 'inbound' ? (
              <PhoneIncoming className="h-5 w-5 text-green-600" />
            ) : (
              <PhoneOutgoing className="h-5 w-5 text-blue-600" />
            )}
            Assign Number for {assignmentType === 'inbound' ? 'Inbound' : 'Outbound'}
          </DialogTitle>
          <DialogDescription>
            {assignmentType === 'inbound'
              ? 'When someone calls this number, the selected agent will answer.'
              : 'When this agent makes outbound calls, this number will be used as the caller ID.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone Number</div>
              <div className="font-medium">{phoneNumber.phone_number}</div>
            </div>

            <div className="space-y-2">
              <Label>Select Agent</Label>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an agent..." />
                </SelectTrigger>
                <SelectContent>
                  {agents
                    .filter((agent) => agent.status === 'active')
                    .map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {agents.filter((agent) => agent.status === 'active').length === 0 && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  No active agents available. Create an agent first.
                </p>
              )}
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {assignmentType === 'inbound' ? (
                  <>
                    <strong>Inbound calls:</strong> When someone dials {phoneNumber.phone_number},
                    the selected agent will automatically answer and handle the call.
                  </>
                ) : (
                  <>
                    <strong>Outbound calls:</strong> When the selected agent makes outbound calls,
                    {phoneNumber.phone_number} will appear as the caller ID.
                  </>
                )}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedAgentId || assignMutation.isPending}
              className="gap-2"
            >
              {assignMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  {assignmentType === 'inbound' ? (
                    <PhoneIncoming className="h-4 w-4" />
                  ) : (
                    <PhoneOutgoing className="h-4 w-4" />
                  )}
                  Assign Number
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
