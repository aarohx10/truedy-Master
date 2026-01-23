'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { supabaseAdmin } from '@/lib/supabase'
import { Save, Loader2 } from 'lucide-react'

interface SubscriptionTier {
  id: string
  name: string
  display_name: string
  price_usd: number
  price_cents: number
  minutes_allowance: number
  initial_credits: number
  stripe_price_id: string | null
  is_active: boolean
  display_order: number
}

export default function PricingPage() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTier, setEditingTier] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<SubscriptionTier>>({})

  useEffect(() => {
    loadTiers()
  }, [])

  async function loadTiers() {
    try {
      const { data, error } = await supabaseAdmin
        .from('subscription_tiers')
        .select('*')
        .order('display_order')

      if (error) throw error
      setTiers(data || [])
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ADMIN] [PRICING] Error loading tiers (RAW ERROR)', {
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

  function startEdit(tier: SubscriptionTier) {
    setEditingTier(tier.id)
    setFormData({
      price_usd: tier.price_usd,
      price_cents: tier.price_cents,
      minutes_allowance: tier.minutes_allowance,
      initial_credits: tier.initial_credits,
      stripe_price_id: tier.stripe_price_id || '',
    })
  }

  function cancelEdit() {
    setEditingTier(null)
    setFormData({})
  }

  async function saveTier(tierId: string) {
    setSaving(tierId)
    try {
      const updateData: any = {}
      if (formData.price_usd !== undefined) {
        updateData.price_usd = parseFloat(formData.price_usd.toString())
        updateData.price_cents = Math.round(updateData.price_usd * 100)
      }
      if (formData.minutes_allowance !== undefined) {
        updateData.minutes_allowance = parseInt(formData.minutes_allowance.toString(), 10)
      }
      if (formData.initial_credits !== undefined) {
        updateData.initial_credits = parseInt(formData.initial_credits.toString(), 10)
      }
      if (formData.stripe_price_id !== undefined) {
        updateData.stripe_price_id = formData.stripe_price_id || null
      }

      const { error } = await supabaseAdmin
        .from('subscription_tiers')
        .update(updateData)
        .eq('id', tierId)

      if (error) throw error

      await loadTiers()
      setEditingTier(null)
      setFormData({})
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ADMIN] [PRICING] Error saving tier (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
        tierId,
        formData,
      })
      alert('Failed to save tier. Please try again.')
    } finally {
      setSaving(null)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading pricing tiers...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pricing Manager</h1>
        <p className="text-muted-foreground">Manage subscription tiers and pricing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Tiers</CardTitle>
          <CardDescription>
            Edit pricing, minutes allowance, and credits for each tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>Price (USD)</TableHead>
                <TableHead>Price (Cents)</TableHead>
                <TableHead>Minutes</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Stripe Price ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.map((tier) => (
                <TableRow key={tier.id}>
                  <TableCell className="font-medium">{tier.display_name}</TableCell>
                  <TableCell>
                    {editingTier === tier.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price_usd || tier.price_usd}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price_usd: parseFloat(e.target.value),
                            price_cents: Math.round(parseFloat(e.target.value) * 100),
                          })
                        }
                        className="w-24"
                      />
                    ) : (
                      `$${tier.price_usd.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTier === tier.id ? (
                      <span className="text-sm text-muted-foreground">
                        {formData.price_cents || tier.price_cents}
                      </span>
                    ) : (
                      tier.price_cents
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTier === tier.id ? (
                      <Input
                        type="number"
                        value={formData.minutes_allowance ?? tier.minutes_allowance}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minutes_allowance: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-24"
                      />
                    ) : (
                      tier.minutes_allowance.toLocaleString()
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTier === tier.id ? (
                      <Input
                        type="number"
                        value={formData.initial_credits ?? tier.initial_credits}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            initial_credits: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-24"
                      />
                    ) : (
                      tier.initial_credits
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTier === tier.id ? (
                      <Input
                        type="text"
                        value={formData.stripe_price_id ?? tier.stripe_price_id ?? ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stripe_price_id: e.target.value,
                          })
                        }
                        className="w-48"
                        placeholder="price_..."
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {tier.stripe_price_id || 'Not set'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTier === tier.id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveTier(tier.id)}
                          disabled={saving === tier.id}
                        >
                          {saving === tier.id ? (
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
                      <Button size="sm" variant="outline" onClick={() => startEdit(tier)}>
                        Edit
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
