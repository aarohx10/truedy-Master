'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { CreditCard } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { apiClient, endpoints } from '@/lib/api'
import { useAuthReady } from '@/lib/clerk-auth-client'
import { useToast } from '@/hooks/use-toast'
import { useOrganization } from '@clerk/nextjs'
import { useAppStore } from '@/stores/app-store'

export default function BillingPage() {
  const { toast } = useToast()
  const isAuthReady = useAuthReady()
  const { organization } = useOrganization()
  const { activeOrgId, setActiveOrgId } = useAppStore()
  
  // CRITICAL: Use orgId for organization-first approach
  const orgId = organization?.id || activeOrgId

  // CRITICAL: Fetch subscription status for the Organization, not the individual user
  const { data: clientData } = useQuery({
    queryKey: ['client', 'billing', orgId], // Include orgId in query key
    queryFn: async () => {
      const response = await apiClient.get(endpoints.auth.me)
      return response.data
    },
    enabled: isAuthReady && !!orgId,
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
