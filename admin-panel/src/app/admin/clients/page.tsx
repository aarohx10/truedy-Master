'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { supabaseAdmin } from '@/lib/supabase'
import { Save, Loader2, Edit2 } from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  subscription_tier_id: string | null
  minutes_balance: number
  minutes_allowance: number
  credits_balance: number
  subscription_status: string
  created_at: string
}

interface Tier {
  id: string
  name: string
  display_name: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [tiers, setTiers] = useState<Record<string, Tier>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [editingClient, setEditingClient] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [minutesOverride, setMinutesOverride] = useState<number | null>(null)

  useEffect(() => {
    loadClients()
    loadTiers()
  }, [])

  async function loadTiers() {
    try {
      const { data } = await supabaseAdmin
        .from('subscription_tiers')
        .select('id, name, display_name')

      if (data) {
        const tiersMap: Record<string, Tier> = {}
        data.forEach((tier) => {
          tiersMap[tier.id] = tier
        })
        setTiers(tiersMap)
      }
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ADMIN] [CLIENTS] Error loading tiers (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
    }
  }

  async function loadClients() {
    try {
      const { data, error } = await supabaseAdmin
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ADMIN] [CLIENTS] Error loading clients (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
    } finally {
      setIsLoading(false)
    }
  }

  function startEdit(client: Client) {
    setEditingClient(client.id)
    setMinutesOverride(client.minutes_balance)
  }

  function cancelEdit() {
    setEditingClient(null)
    setMinutesOverride(null)
  }

  async function saveClient(clientId: string) {
    if (minutesOverride === null) return

    setSaving(clientId)
    try {
      const { error } = await supabaseAdmin
        .from('clients')
        .update({ minutes_balance: minutesOverride })
        .eq('id', clientId)

      if (error) throw error

      await loadClients()
      setEditingClient(null)
      setMinutesOverride(null)
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ADMIN] [CLIENTS] Error saving client (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
        clientId,
        minutesOverride,
      })
      alert('Failed to update client. Please try again.')
    } finally {
      setSaving(null)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading clients...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Management</h1>
        <p className="text-muted-foreground">View and manage all platform clients</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>
            View client details and manually override minutes balance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Minutes Balance</TableHead>
                <TableHead>Minutes Allowance</TableHead>
                <TableHead>Credits Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    {client.subscription_tier_id
                      ? tiers[client.subscription_tier_id]?.display_name || 'Unknown'
                      : 'No tier'}
                  </TableCell>
                  <TableCell>
                    {editingClient === client.id ? (
                      <Input
                        type="number"
                        value={minutesOverride ?? client.minutes_balance}
                        onChange={(e) =>
                          setMinutesOverride(parseInt(e.target.value, 10))
                        }
                        className="w-24"
                      />
                    ) : (
                      client.minutes_balance.toLocaleString()
                    )}
                  </TableCell>
                  <TableCell>{client.minutes_allowance.toLocaleString()}</TableCell>
                  <TableCell>{client.credits_balance.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        client.subscription_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : client.subscription_status === 'suspended'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {client.subscription_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {editingClient === client.id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveClient(client.id)}
                          disabled={saving === client.id}
                        >
                          {saving === client.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(client)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
