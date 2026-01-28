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
import { Loader2, Phone, Server } from 'lucide-react'
import { useImportNumber } from '@/hooks/use-telephony'
import { useToast } from '@/hooks/use-toast'

interface ImportNumberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportNumberModal({ open, onOpenChange }: ImportNumberModalProps) {
  const { toast } = useToast()
  const importMutation = useImportNumber()

  const [provider, setProvider] = useState<'telnyx' | 'twilio' | 'custom_sip'>('telnyx')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [friendlyName, setFriendlyName] = useState('')

  // Telnyx/Twilio fields
  const [apiKey, setApiKey] = useState('')
  const [accountSid, setAccountSid] = useState('')
  const [authToken, setAuthToken] = useState('')

  // Custom SIP fields
  const [sipUsername, setSipUsername] = useState('')
  const [sipPassword, setSipPassword] = useState('')
  const [sipServer, setSipServer] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate based on provider
    if (provider === 'custom_sip') {
      if (!sipUsername || !sipPassword || !sipServer) {
        toast({
          title: 'Validation error',
          description: 'SIP username, password, and server are required',
          variant: 'destructive',
        })
        return
      }
    } else if (provider === 'twilio') {
      if (!apiKey || !accountSid) {
        toast({
          title: 'Validation error',
          description: 'API key and Account SID are required for Twilio',
          variant: 'destructive',
        })
        return
      }
    } else if (provider === 'telnyx') {
      if (!apiKey) {
        toast({
          title: 'Validation error',
          description: 'API key is required for Telnyx',
          variant: 'destructive',
        })
        return
      }
    }

    if (!phoneNumber) {
      toast({
        title: 'Validation error',
        description: 'Phone number is required',
        variant: 'destructive',
      })
      return
    }

    try {
      await importMutation.mutateAsync({
        phone_number: phoneNumber,
        provider_type: provider,
        friendly_name: friendlyName || undefined,
        api_key: apiKey || undefined,
        account_sid: accountSid || undefined,
        auth_token: authToken || undefined,
        sip_username: sipUsername || undefined,
        sip_password: sipPassword || undefined,
        sip_server: sipServer || undefined,
      })
      toast({
        title: 'Number imported',
        description: `Phone number ${phoneNumber} has been imported successfully.`,
      })
      onOpenChange(false)
      // Reset form
      resetForm()
    } catch (error) {
      // Error handled by hook
    }
  }

  const resetForm = () => {
    setProvider('telnyx')
    setPhoneNumber('')
    setFriendlyName('')
    setApiKey('')
    setAccountSid('')
    setAuthToken('')
    setSipUsername('')
    setSipPassword('')
    setSipServer('')
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      resetForm()
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Import Phone Number
          </DialogTitle>
          <DialogDescription>
            Import an existing phone number from your carrier (BYOC - Bring Your Own Carrier)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Provider Selection */}
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={provider} onValueChange={(value: 'telnyx' | 'twilio' | 'custom_sip') => setProvider(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telnyx">Telnyx</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="custom_sip">Custom SIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label>Phone Number (E.164 format)</Label>
              <Input
                placeholder="+15551234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Enter the phone number in E.164 format (e.g., +15551234567)
              </p>
            </div>

            {/* Friendly Name */}
            <div className="space-y-2">
              <Label>Friendly Name (Optional)</Label>
              <Input
                placeholder="e.g., Main Business Line"
                value={friendlyName}
                onChange={(e) => setFriendlyName(e.target.value)}
              />
            </div>

            {/* Provider-Specific Fields */}
            {provider === 'telnyx' && (
              <div className="space-y-2">
                <Label>Telnyx API Key *</Label>
                <Input
                  type="password"
                  placeholder="Your Telnyx API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                />
              </div>
            )}

            {provider === 'twilio' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Twilio Account SID *</Label>
                  <Input
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={accountSid}
                    onChange={(e) => setAccountSid(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twilio Auth Token *</Label>
                  <Input
                    type="password"
                    placeholder="Your Twilio auth token"
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twilio API Key (Optional)</Label>
                  <Input
                    type="password"
                    placeholder="Your Twilio API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              </div>
            )}

            {provider === 'custom_sip' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>SIP Server *</Label>
                  <Input
                    placeholder="sip.provider.com"
                    value={sipServer}
                    onChange={(e) => setSipServer(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>SIP Username *</Label>
                  <Input
                    placeholder="Your SIP username"
                    value={sipUsername}
                    onChange={(e) => setSipUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>SIP Password *</Label>
                  <Input
                    type="password"
                    placeholder="Your SIP password"
                    value={sipPassword}
                    onChange={(e) => setSipPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Info Banner */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                After importing, you'll need to configure your carrier's webhook settings to point
                to the Ultravox webhook URL. This will be shown after you assign the number to an agent.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={importMutation.isPending} className="gap-2">
              {importMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4" />
                  Import Number
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
