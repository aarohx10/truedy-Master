'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { CreditCard } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { useClientId, useAuthReady } from '@/lib/clerk-auth-client'
import { useToast } from '@/hooks/use-toast'

export default function BillingPage() {
  const { toast } = useToast()
  const clientId = useClientId()
  const isAuthReady = useAuthReady()

  // Fetch client data for credits
  const { data: clientData } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const response = await apiClient.get(endpoints.auth.me)
      return response.data
    },
    enabled: isAuthReady && !!clientId,
  })

  const creditsBalance = clientData?.credits_balance || 0

  const handleStripePortal = () => {
    // TODO: Implement Stripe portal redirect
    toast({
      title: 'Stripe Portal',
      description: 'Stripe customer portal will be implemented soon.',
    })
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Billing</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your credits and billing information
          </p>
        </div>

        {/* Credits & Billing Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Credits & Billing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-white">
                Credits Remaining
              </Label>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {creditsBalance.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                1 Credit = $1.00 USD
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => window.location.href = '/billing'}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Purchase Credits
              </Button>
              <Button
                variant="outline"
                onClick={handleStripePortal}
              >
                Stripe Portal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
