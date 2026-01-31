'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CreditCard, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react'
import { STRIPE_CONFIG } from '@/lib/stripe'
import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe'
import { PaymentForm } from '@/components/billing/payment-form'
import { useUser } from '@clerk/nextjs'
import { apiClient } from '@/lib/api'
import { useAuthClient } from '@/lib/clerk-auth-client'

export default function BillingPage() {
  const { user } = useUser()
  const { orgId } = useAuthClient()
  const [selectedAmount, setSelectedAmount] = useState<string>('2500')
  const [customAmount, setCustomAmount] = useState('')
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isCreatingIntent, setIsCreatingIntent] = useState(false)

  // Calculate credits based on amount
  const calculateCredits = (amountCents: number) => {
    return Math.floor(amountCents / 100 * STRIPE_CONFIG.creditRate)
  }

  // Get selected amount in cents
  const getAmountInCents = () => {
    if (selectedAmount === 'custom') {
      const amount = parseFloat(customAmount)
      if (isNaN(amount) || amount < 5) return null
      return Math.round(amount * 100)
    }
    return parseInt(selectedAmount)
  }

  const handlePurchase = async () => {
    const amount = getAmountInCents()
    if (!amount || amount < STRIPE_CONFIG.minAmount) {
      alert(`Minimum purchase is $${STRIPE_CONFIG.minAmount / 100}`)
      return
    }
    
    setIsCreatingIntent(true)
    setPaymentDialogOpen(true)
    
    try {
      // Create payment intent before opening dialog
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'usd',
          client_id: clientId || '',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment intent')
      }

      const { clientSecret: secret } = await response.json()
      setClientSecret(secret)
    } catch (error: any) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[BILLING_PAGE] Error creating payment intent (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCode: error.code,
        errorType: error.type,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      })
      alert(rawError.message || 'Failed to initialize payment')
      setPaymentDialogOpen(false)
    } finally {
      setIsCreatingIntent(false)
    }
  }

  // Fetch credits balance from database
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await apiClient.get('/auth/me')
        // Credits balance is organization-scoped (organization-first billing)
        const credits = response.data?.credits_balance || 0
        setCreditsBalance(credits)
      } catch (error) {
        const rawError = error instanceof Error ? error : new Error(String(error))
        console.error('[BILLING_PAGE] Error fetching credits (RAW ERROR)', {
          error: rawError,
          errorMessage: rawError.message,
          errorStack: rawError.stack,
          errorName: rawError.name,
          fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
        })
        setCreditsBalance(0)
      }
    }
    fetchCredits()
  }, [])

  const amount = getAmountInCents()
  const credits = amount ? calculateCredits(amount) : 0

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Credits</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Purchase credits to use for calls and voice operations
          </p>
        </div>

        {/* Current Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {creditsBalance !== null ? creditsBalance : '...'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">Credits</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              1 Credit = $1.00 USD
            </p>
          </CardContent>
        </Card>

        {/* Purchase Credits */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Credits</CardTitle>
            <CardDescription>
              Select an amount or enter a custom amount to purchase credits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Select Amounts */}
            <div className="space-y-2">
              <Label>Select Amount</Label>
              <Select value={selectedAmount} onValueChange={setSelectedAmount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STRIPE_CONFIG.defaultAmounts.map((option) => (
                    <SelectItem key={option.amount} value={option.amount.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Amount Input */}
            {selectedAmount === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="custom-amount">Custom Amount (USD)</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  min="5"
                  max="1000"
                  step="0.01"
                  placeholder="Enter amount (min $5.00)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Minimum: ${STRIPE_CONFIG.minAmount / 100}, Maximum: ${STRIPE_CONFIG.maxAmount / 100}
                </p>
              </div>
            )}

            {/* Purchase Summary */}
            {amount && amount >= STRIPE_CONFIG.minAmount && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${(amount / 100).toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Credits:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {credits} Credits
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${(amount / 100).toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Purchase Button */}
            <Button
              onClick={handlePurchase}
              disabled={!amount || amount < STRIPE_CONFIG.minAmount || isLoading}
              size="lg"
              className="w-full"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Purchase {credits} Credits
            </Button>
          </CardContent>
        </Card>

        {/* Payment Dialog */}
        <Dialog open={paymentDialogOpen} onOpenChange={(open) => {
          setPaymentDialogOpen(open)
          if (!open) {
            setClientSecret(null)
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
              <DialogDescription>
                Purchase {credits} credits for ${(amount! / 100).toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            {isCreatingIntent ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Initializing payment...</p>
                </div>
              </div>
            ) : amount && clientSecret ? (
              <Elements stripe={getStripe()} options={{ clientSecret }}>
                <PaymentForm
                  amount={amount}
                  credits={credits}
                  orgId={orgId || ''}
                  clientSecret={clientSecret}
                  onSuccess={() => {
                    setPaymentDialogOpen(false)
                    setClientSecret(null)
                    // Refresh credits balance
                    window.location.reload()
                  }}
                  onCancel={() => {
                    setPaymentDialogOpen(false)
                    setClientSecret(null)
                  }}
                />
              </Elements>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 dark:text-gray-400">Failed to initialize payment. Please try again.</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}

