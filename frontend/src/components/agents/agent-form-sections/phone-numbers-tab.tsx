'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PhoneIncoming, PhoneOutgoing, Plus, Copy, CheckCircle2 } from 'lucide-react'
import { useGetAgentNumbers, useGetAgentWebhookUrl, useAssignNumber, useUnassignNumber } from '@/hooks/use-telephony'
import { usePhoneNumbers } from '@/hooks/use-telephony'
import { useToast } from '@/hooks/use-toast'
import { PhoneNumberAssignmentModal } from '@/components/telephony/phone-number-assignment-modal'
import { PhoneNumber } from '@/hooks/use-telephony'

interface PhoneNumbersTabProps {
  agentId: string
}

export function PhoneNumbersTab({ agentId }: PhoneNumbersTabProps) {
  const { data: agentNumbers, isLoading } = useGetAgentNumbers(agentId)
  const { data: webhookUrlData } = useGetAgentWebhookUrl(agentId)
  const { data: allNumbers = [] } = usePhoneNumbers()
  const assignMutation = useAssignNumber()
  const unassignMutation = useUnassignNumber()
  const { toast } = useToast()

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState<PhoneNumber | null>(null)
  const [assignmentType, setAssignmentType] = useState<'inbound' | 'outbound'>('inbound')
  const [copied, setCopied] = useState(false)

  const inboundNumbers = agentNumbers?.inbound || []
  const outboundNumbers = agentNumbers?.outbound || []

  const handleAssign = (type: 'inbound' | 'outbound') => {
    // Find an available number to assign, or use the first one
    const availableNumber = allNumbers.find(
      (n) => (type === 'inbound' ? !n.inbound_agent_id : !n.outbound_agent_id)
    ) || allNumbers[0]
    
    if (!availableNumber) {
      toast({
        title: 'No numbers available',
        description: 'Please purchase or import a phone number first.',
        variant: 'destructive',
      })
      return
    }
    
    setSelectedNumber(availableNumber)
    setAssignmentType(type)
    setAssignmentModalOpen(true)
  }

  const handleUnassign = async (numberId: string, type: 'inbound' | 'outbound') => {
    try {
      await unassignMutation.mutateAsync({
        number_id: numberId,
        assignment_type: type,
      })
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleCopyWebhookUrl = () => {
    if (webhookUrlData?.webhook_url) {
      navigator.clipboard.writeText(webhookUrlData.webhook_url)
      setCopied(true)
      toast({
        title: 'Copied',
        description: 'Webhook URL copied to clipboard',
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Check if agent has any BYOC numbers (non-Trudy-managed)
  const hasBYOCNumbers = [...inboundNumbers, ...outboundNumbers].some(
    (n) => !allNumbers.find((all) => all.id === n.id)?.is_trudy_managed
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-gray-600 dark:text-gray-400">Loading phone numbers...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Inbound Numbers Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <PhoneIncoming className="h-5 w-5 text-green-600" />
                Inbound Numbers
              </CardTitle>
              <CardDescription>
                When someone calls these numbers, this agent will answer
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAssign('inbound')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Assign Number
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {inboundNumbers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <PhoneIncoming className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No inbound numbers assigned</p>
              <p className="text-xs mt-1">Assign a number to enable inbound calls</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inboundNumbers.map((number) => {
                const fullNumber = allNumbers.find((n) => n.id === number.id)
                return (
                  <div
                    key={number.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-900 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <PhoneIncoming className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">{number.phone_number}</div>
                        {fullNumber && !fullNumber.is_trudy_managed && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            BYOC - Configure webhook in your carrier console
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnassign(number.id, 'inbound')}
                    >
                      Remove
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Outbound Numbers Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <PhoneOutgoing className="h-5 w-5 text-blue-600" />
                Outbound Numbers
              </CardTitle>
              <CardDescription>
                These numbers will be used as caller ID when this agent makes outbound calls
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAssign('outbound')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Assign Number
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {outboundNumbers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <PhoneOutgoing className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No outbound numbers assigned</p>
              <p className="text-xs mt-1">Assign a number to set caller ID for outbound calls</p>
            </div>
          ) : (
            <div className="space-y-3">
              {outboundNumbers.map((number) => {
                const fullNumber = allNumbers.find((n) => n.id === number.id)
                return (
                  <div
                    key={number.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-900 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <PhoneOutgoing className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{number.phone_number}</div>
                        {fullNumber && !fullNumber.is_trudy_managed && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            BYOC - Configure webhook in your carrier console
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnassign(number.id, 'outbound')}
                    >
                      Remove
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* BYOC Webhook URL Section */}
      {hasBYOCNumbers && webhookUrlData && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">BYOC Webhook Configuration</CardTitle>
            <CardDescription>
              For BYOC (Bring Your Own Carrier) numbers, configure your carrier's webhook to point
              to this URL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-900 rounded-lg">
              <div className="flex items-center justify-between gap-4">
                <code className="text-sm flex-1 break-all">{webhookUrlData.webhook_url}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyWebhookUrl}
                  className="gap-2 flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Setup Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>Go to your carrier's console (Twilio, Telnyx, etc.)</li>
                <li>Find the webhook settings for your phone number</li>
                <li>Paste the webhook URL above into the "A Call Comes In" field</li>
                <li>Save the configuration</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignment Modal */}
      {selectedNumber && (
        <PhoneNumberAssignmentModal
          open={assignmentModalOpen}
          onOpenChange={setAssignmentModalOpen}
          phoneNumber={selectedNumber}
          assignmentType={assignmentType}
          onSuccess={() => {
            setAssignmentModalOpen(false)
            setSelectedNumber(null)
          }}
        />
      )}
    </div>
  )
}
