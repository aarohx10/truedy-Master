'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Phone, Plus, Loader2, MoreVertical, PhoneIncoming, PhoneOutgoing, X } from 'lucide-react'
import { usePhoneNumbers, useAssignNumber, useUnassignNumber } from '@/hooks/use-telephony'
import { useAgents } from '@/hooks/use-agents'
import { useToast } from '@/hooks/use-toast'
import { PhoneNumber } from '@/hooks/use-telephony'
import { BuyNumberModal } from '@/components/telephony/buy-number-modal'
import { ImportNumberModal } from '@/components/telephony/import-number-modal'
import { PhoneNumberAssignmentModal } from '@/components/telephony/phone-number-assignment-modal'

export default function PhoneNumbersPage() {
  const { data: phoneNumbers = [], isLoading } = usePhoneNumbers()
  const { data: agents = [] } = useAgents()
  const assignMutation = useAssignNumber()
  const unassignMutation = useUnassignNumber()
  const { toast } = useToast()

  const [buyModalOpen, setBuyModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState<PhoneNumber | null>(null)
  const [assignmentType, setAssignmentType] = useState<'inbound' | 'outbound'>('inbound')

  const handleAssign = (number: PhoneNumber, type: 'inbound' | 'outbound') => {
    setSelectedNumber(number)
    setAssignmentType(type)
    setAssignmentModalOpen(true)
  }

  const handleUnassign = async (number: PhoneNumber, type: 'inbound' | 'outbound') => {
    try {
      await unassignMutation.mutateAsync({
        number_id: number.id,
        assignment_type: type,
      })
    } catch (error) {
      // Error handled by hook
    }
  }

  const getAgentName = (agentId?: string) => {
    if (!agentId) return null
    const agent = agents.find(a => a.id === agentId)
    return agent?.name || 'Unknown Agent'
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Phone Numbers</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage phone numbers and assign them to agents for inbound and outbound calls
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all"
              onClick={() => setBuyModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Buy Number
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 gap-2"
              onClick={() => setImportModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Import Number
            </Button>
          </div>
        </div>

        {/* Phone Numbers Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : phoneNumbers.length === 0 ? (
          <div className="border border-gray-200 dark:border-gray-900 rounded-lg bg-white dark:bg-black">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No phone numbers
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get started by buying a number or importing an existing one
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setBuyModalOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Buy Number
                </Button>
                <Button
                  onClick={() => setImportModalOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Import Number
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 dark:border-gray-900 rounded-lg bg-white dark:bg-black">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Inbound Agent</TableHead>
                  <TableHead>Outbound Agent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phoneNumbers.map((number) => (
                  <TableRow key={number.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <TableCell className="font-medium">
                      {number.phone_number}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          number.status === 'active'
                            ? 'default'
                            : number.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {number.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={number.is_trudy_managed ? 'default' : 'outline'}>
                        {number.is_trudy_managed ? 'Trudy-Managed' : 'BYOC'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {number.inbound_agent_id ? (
                        <div className="flex items-center gap-2">
                          <PhoneIncoming className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{getAgentName(number.inbound_agent_id)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleUnassign(number, 'inbound')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleAssign(number, 'inbound')}
                        >
                          <PhoneIncoming className="h-3 w-3" />
                          Assign Inbound
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {number.outbound_agent_id ? (
                        <div className="flex items-center gap-2">
                          <PhoneOutgoing className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{getAgentName(number.outbound_agent_id)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleUnassign(number, 'outbound')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleAssign(number, 'outbound')}
                        >
                          <PhoneOutgoing className="h-3 w-3" />
                          Assign Outbound
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!number.inbound_agent_id && (
                            <DropdownMenuItem onClick={() => handleAssign(number, 'inbound')}>
                              <PhoneIncoming className="h-4 w-4 mr-2" />
                              Assign for Inbound
                            </DropdownMenuItem>
                          )}
                          {!number.outbound_agent_id && (
                            <DropdownMenuItem onClick={() => handleAssign(number, 'outbound')}>
                              <PhoneOutgoing className="h-4 w-4 mr-2" />
                              Assign for Outbound
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Modals */}
        <BuyNumberModal
          open={buyModalOpen}
          onOpenChange={setBuyModalOpen}
        />
        <ImportNumberModal
          open={importModalOpen}
          onOpenChange={setImportModalOpen}
        />
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
    </AppLayout>
  )
}
