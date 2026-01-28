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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Phone, Search, CheckCircle2 } from 'lucide-react'
import { useSearchNumbers, usePurchaseNumber } from '@/hooks/use-telephony'
import { useToast } from '@/hooks/use-toast'
import { AvailableNumber } from '@/hooks/use-telephony'

interface BuyNumberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BuyNumberModal({ open, onOpenChange }: BuyNumberModalProps) {
  const { toast } = useToast()
  const searchMutation = useSearchNumbers()
  const purchaseMutation = usePurchaseNumber()

  const [step, setStep] = useState<'search' | 'select' | 'confirm'>('search')
  const [countryCode, setCountryCode] = useState('US')
  const [locality, setLocality] = useState('')
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([])
  const [selectedNumber, setSelectedNumber] = useState<AvailableNumber | null>(null)

  const handleSearch = async () => {
    try {
      const numbers = await searchMutation.mutateAsync({
        country_code: countryCode,
        locality: locality || undefined,
      })
      setAvailableNumbers(numbers)
      setStep('select')
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleSelect = (number: AvailableNumber) => {
    setSelectedNumber(number)
    setStep('confirm')
  }

  const handlePurchase = async () => {
    if (!selectedNumber) return

    try {
      await purchaseMutation.mutateAsync({
        phone_number: selectedNumber.phone_number,
      })
      toast({
        title: 'Number purchased',
        description: `Phone number ${selectedNumber.phone_number} has been purchased successfully.`,
      })
      onOpenChange(false)
      // Reset state
      setStep('search')
      setSelectedNumber(null)
      setAvailableNumbers([])
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset state after a delay to allow modal to close
    setTimeout(() => {
      setStep('search')
      setSelectedNumber(null)
      setAvailableNumbers([])
      setLocality('')
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Buy Phone Number
          </DialogTitle>
          <DialogDescription>
            Search and purchase a phone number from Telnyx
          </DialogDescription>
        </DialogHeader>

        {step === 'search' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="IN">India</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>City / Locality (Optional)</Label>
              <Input
                placeholder="e.g., New York, Los Angeles"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSearch}
              disabled={searchMutation.isPending}
              className="w-full gap-2"
            >
              {searchMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search Numbers
                </>
              )}
            </Button>
          </div>
        )}

        {step === 'select' && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Available Numbers</h3>
              <Button variant="outline" size="sm" onClick={() => setStep('search')}>
                Back
              </Button>
            </div>

            {availableNumbers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No numbers found. Try a different search.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {availableNumbers.map((number) => (
                  <div
                    key={number.phone_number}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-900 rounded-lg hover:border-primary transition-colors cursor-pointer"
                    onClick={() => handleSelect(number)}
                  >
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{number.phone_number}</div>
                        {number.region_information?.locality && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {number.region_information.locality}
                          </div>
                        )}
                      </div>
                    </div>
                    {number.cost_information && (
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          ${number.cost_information.monthly_cost || 'N/A'}/mo
                        </div>
                        {number.cost_information.upfront_cost && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            ${number.cost_information.upfront_cost} upfront
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'confirm' && selectedNumber && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Confirm Purchase</h3>
              <Button variant="outline" size="sm" onClick={() => setStep('select')}>
                Back
              </Button>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-900 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="h-5 w-5 text-primary" />
                <div className="font-medium text-lg">{selectedNumber.phone_number}</div>
              </div>
              {selectedNumber.region_information?.locality && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedNumber.region_information.locality}
                </div>
              )}
              {selectedNumber.cost_information && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Monthly:</span>{' '}
                    <span className="font-medium">
                      ${selectedNumber.cost_information.monthly_cost || 'N/A'}
                    </span>
                  </div>
                  {selectedNumber.cost_information.upfront_cost && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Upfront:</span>{' '}
                      <span className="font-medium">
                        ${selectedNumber.cost_information.upfront_cost}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700 dark:text-gray-300">
                This number will be automatically configured for Trudy. You can assign it to an agent
                after purchase.
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'search' && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </>
          )}
          {step === 'select' && (
            <>
              <Button variant="outline" onClick={() => setStep('search')}>
                Back
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </>
          )}
          {step === 'confirm' && (
            <>
              <Button variant="outline" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={purchaseMutation.isPending}
                className="gap-2"
              >
                {purchaseMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Purchasing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Purchase Number
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
