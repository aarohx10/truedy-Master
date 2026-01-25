'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Phone, Loader2 } from 'lucide-react'

interface CreateCallModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateCall: (data: { phone_number: string; direction: 'inbound' | 'outbound' }) => void
  isLoading: boolean
}

export function CreateCallModal({ isOpen, onClose, onCreateCall, isLoading }: CreateCallModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  // Direction is always outbound
  const direction: 'outbound' = 'outbound'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber.trim()) {
      return
    }
    onCreateCall({
      phone_number: phoneNumber.trim(),
      direction,
    })
  }

  const handleClose = () => {
    setPhoneNumber('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white dark:bg-black border-gray-200 dark:border-gray-900">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Create New Call
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Enter phone number in E.164 format (e.g., +1234567890)
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!phoneNumber.trim() || isLoading}
              className="bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4" />
                  Create Call
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

