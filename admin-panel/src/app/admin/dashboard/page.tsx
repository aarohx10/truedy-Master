'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, Phone, Activity } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase'

interface DashboardStats {
  totalRevenue: number
  totalMinutesUsed: number
  totalClients: number
  activeSubscriptions: number
  tierDistribution: Record<string, number>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [ultravoxStatus, setUltravoxStatus] = useState<'healthy' | 'unhealthy' | 'checking'>('checking')

  useEffect(() => {
    loadStats()
    checkUltravox()
  }, [])

  async function loadStats() {
    try {
      // Get total revenue from credit transactions
      const { data: transactions } = await supabaseAdmin
        .from('credit_transactions')
        .select('amount')
        .eq('type', 'purchased')
        .eq('reference_type', 'stripe_payment')

      const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0

      // Get total minutes used from calls
      const { data: calls } = await supabaseAdmin
        .from('calls')
        .select('duration_seconds')

      const totalMinutesUsed = Math.floor(
        (calls?.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) || 0) / 60
      )

      // Get total clients
      const { data: clients, count: totalClients } = await supabaseAdmin
        .from('clients')
        .select('*', { count: 'exact', head: true })

      // Get active subscriptions
      const { data: subscriptions, count: activeSubscriptions } = await supabaseAdmin
        .from('clients')
        .select('subscription_tier_id', { count: 'exact', head: true })
        .not('subscription_tier_id', 'is', null)

      // Get tier distribution
      const { data: clientsWithTiers } = await supabaseAdmin
        .from('clients')
        .select('subscription_tier_id')
        .not('subscription_tier_id', 'is', null)

      const tierDistribution: Record<string, number> = {}
      if (clientsWithTiers) {
        for (const client of clientsWithTiers) {
          if (client.subscription_tier_id) {
            const { data: tier, error: tierError } = await supabaseAdmin
              .from('subscription_tiers')
              .select('name')
              .eq('id', client.subscription_tier_id)
              .maybeSingle()

            if (tierError) {
              console.error('Error fetching tier:', tierError)
              continue
            }

            if (tier?.name) {
              tierDistribution[tier.name] = (tierDistribution[tier.name] || 0) + 1
            }
          }
        }
      }

      setStats({
        totalRevenue,
        totalMinutesUsed,
        totalClients: totalClients || 0,
        activeSubscriptions: activeSubscriptions || 0,
        tierDistribution,
      })
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ADMIN] [DASHBOARD] Error loading stats (RAW ERROR)', {
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

  async function checkUltravox() {
    try {
      // Check if Ultravox API key exists in api_keys table
      const { data } = await supabaseAdmin
        .from('api_keys')
        .select('id')
        .eq('service', 'ultravox')
        .eq('is_active', true)
        .limit(1)

      setUltravoxStatus(data && data.length > 0 ? 'healthy' : 'unhealthy')
    } catch (error) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ADMIN] [DASHBOARD] Error checking Ultravox (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      setUltravoxStatus('unhealthy')
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Global platform statistics and monitoring</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">From all Stripe transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Minutes Used</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMinutesUsed.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">Platform-wide call minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
            <p className="text-xs text-muted-foreground">Registered clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ultravox Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{ultravoxStatus}</div>
            <p className="text-xs text-muted-foreground">
              {ultravoxStatus === 'healthy' ? 'API configured' : 'API not configured'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Distribution</CardTitle>
          <CardDescription>Active subscriptions by tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats?.tierDistribution && Object.keys(stats.tierDistribution).length > 0 ? (
              Object.entries(stats.tierDistribution).map(([tier, count]) => (
                <div key={tier} className="flex justify-between items-center">
                  <span className="capitalize font-medium">{tier}</span>
                  <span className="text-muted-foreground">{count} clients</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No active subscriptions</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
